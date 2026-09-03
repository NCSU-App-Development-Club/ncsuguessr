import { Platform } from 'react-native'

export interface GpsCoordinates {
  latitude: number
  longitude: number
}

function readUint16(
  view: DataView,
  offset: number,
  littleEndian: boolean
): number {
  return view.getUint16(offset, littleEndian)
}

function readUint32(
  view: DataView,
  offset: number,
  littleEndian: boolean
): number {
  return view.getUint32(offset, littleEndian)
}

function readRational(
  view: DataView,
  offset: number,
  littleEndian: boolean
): number {
  const num = readUint32(view, offset, littleEndian)
  const den = readUint32(view, offset + 4, littleEndian)
  return den === 0 ? 0 : num / den
}

function dmsToDecimal(d: number, m: number, s: number, ref: string): number {
  let decimal = d + m / 60 + s / 3600
  if (ref === 'S' || ref === 'W') decimal = -decimal
  return decimal
}

function parseExifBuffer(buffer: ArrayBuffer): GpsCoordinates | null {
  const view = new DataView(buffer)

  // Check JPEG SOI marker
  if (view.getUint16(0) !== 0xffd8) return null

  // Find EXIF APP1 marker
  let offset = 2
  while (offset < view.byteLength - 1) {
    if (view.getUint8(offset) !== 0xff) return null
    const marker = view.getUint8(offset + 1)
    if (marker === 0xe1) break // APP1
    if (marker === 0xda) return null // SOS - no EXIF found
    const segLen = readUint16(view, offset + 2, false)
    offset += 2 + segLen
  }

  if (offset >= view.byteLength - 1) return null

  const segLen = readUint16(view, offset + 2, false)
  const exifStart = offset + 4

  // Verify "Exif\0\0"
  const exifHeader = String.fromCharCode(
    view.getUint8(exifStart),
    view.getUint8(exifStart + 1),
    view.getUint8(exifStart + 2),
    view.getUint8(exifStart + 3)
  )
  if (exifHeader !== 'Exif\0\0') return null

  const tiffStart = exifStart + 6
  const byteOrder = view.getUint16(tiffStart, false)
  const littleEndian = byteOrder === 0x4949 // 'II'

  // Read IFD0
  const ifd0Offset = readUint32(view, tiffStart + 4, littleEndian)
  const numEntries = readUint16(view, tiffStart + ifd0Offset, littleEndian)

  let gpsIfdOffset = 0
  for (let i = 0; i < numEntries; i++) {
    const entryOffset = tiffStart + ifd0Offset + 2 + i * 12
    const tag = readUint16(view, entryOffset, littleEndian)
    if (tag === 0x8825) {
      // GPSInfo tag
      gpsIfdOffset = readUint32(view, entryOffset + 8, littleEndian)
      break
    }
  }

  if (gpsIfdOffset === 0) return null

  // Parse GPS IFD
  const gpsNumEntries = readUint16(view, tiffStart + gpsIfdOffset, littleEndian)

  let latRef = ''
  let lonRef = ''
  let lat: [number, number, number] = [0, 0, 0]
  let lon: [number, number, number] = [0, 0, 0]

  for (let i = 0; i < gpsNumEntries; i++) {
    const entryOffset = tiffStart + gpsIfdOffset + 2 + i * 12
    const tag = readUint16(view, entryOffset, littleEndian)
    const type = readUint16(view, entryOffset + 2, littleEndian)
    const count = readUint32(view, entryOffset + 4, littleEndian)

    const valueOffset =
      count * (type === 5 ? 8 : type === 3 ? 2 : type === 4 ? 4 : 1) <= 4
        ? entryOffset + 8
        : readUint32(view, entryOffset + 8, littleEndian)

    if (tag === 0x0001) {
      // GPSLatitudeRef
      latRef = String.fromCharCode(view.getUint8(valueOffset))
    } else if (tag === 0x0003) {
      // GPSLongitudeRef
      lonRef = String.fromCharCode(view.getUint8(valueOffset))
    } else if (tag === 0x0002 && type === 5) {
      // GPSLatitude (rational)
      lat = [
        readRational(view, tiffStart + valueOffset, littleEndian),
        readRational(view, tiffStart + valueOffset + 8, littleEndian),
        readRational(view, tiffStart + valueOffset + 16, littleEndian),
      ]
    } else if (tag === 0x0004 && type === 5) {
      // GPSLongitude (rational)
      lon = [
        readRational(view, tiffStart + valueOffset, littleEndian),
        readRational(view, tiffStart + valueOffset + 8, littleEndian),
        readRational(view, tiffStart + valueOffset + 16, littleEndian),
      ]
    }
  }

  if (latRef && lonRef && (lat[0] !== 0 || lon[0] !== 0)) {
    return {
      latitude: dmsToDecimal(lat[0], lat[1], lat[2], latRef),
      longitude: dmsToDecimal(lon[0], lon[1], lon[2], lonRef),
    }
  }

  return null
}

export async function extractGpsFromImage(
  uri: string
): Promise<GpsCoordinates | null> {
  if (Platform.OS === 'web') {
    try {
      const response = await fetch(uri)
      const buffer = await response.arrayBuffer()
      return parseExifBuffer(buffer)
    } catch {
      return null
    }
  }
  return null
}
