// Image-related helpers for the contribute flow.
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator'

// downscale the longest edge and re-encode as a compressed JPEG before uploading
const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.6

/**
 * Downscales an image so its longest edge is at most MAX_DIMENSION and
 * re-encodes it as a compressed JPEG. If compression fails for any reason the
 * original uri is returned unchanged so the upload can still proceed.
 */
export async function compressImage(uri: string): Promise<string> {
  try {
    // render the original to get its width and height
    const source = await ImageManipulator.manipulate(uri).renderAsync()
    const longestEdge = Math.max(source.width, source.height)

    const context = ImageManipulator.manipulate(uri)
    if (longestEdge > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / longestEdge
      context.resize({
        width: Math.round(source.width * scale),
        height: Math.round(source.height * scale),
      })
    }

    const rendered = await context.renderAsync()
    const result = await rendered.saveAsync({
      compress: JPEG_QUALITY,
      format: SaveFormat.JPEG,
    })

    return result.uri
  } catch (e) {
    console.warn('image compression failed, uploading original:', e)
    return uri
  }
}
