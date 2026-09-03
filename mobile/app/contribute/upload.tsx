import Text from '../../components/global/Text'
import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { extractGpsFromImage } from '../../util/exif'

export default function ContributeUpload() {
  const [picking, setPicking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    pickImage()
  }, [])

  async function pickImage() {
    setPicking(true)
    setError(null)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
        exif: true,
      })

      if (result.canceled || !result.assets?.[0]) {
        setPicking(false)
        return
      }

      const asset = result.assets[0]
      let latitude: number | null = null
      let longitude: number | null = null
      // TODO ask for this
      let locationName = 'NCSU'

      // Try to get GPS from EXIF on mobile
      if (Platform.OS !== 'web') {
        const exif = asset.exif as Record<string, unknown> | undefined
        if (exif) {
          const gpsLat = exif['GPSLatitude'] as number | undefined
          const gpsLatRef = exif['GPSLatitudeRef'] as string | undefined
          const gpsLon = exif['GPSLongitude'] as number | undefined
          const gpsLonRef = exif['GPSLongitudeRef'] as string | undefined

          if (gpsLat != null && gpsLon != null) {
            latitude = gpsLatRef === 'S' ? -gpsLat : gpsLat
            longitude = gpsLonRef === 'W' ? -gpsLon : gpsLon
          }
        }
      }

      // Fallback: parse EXIF from the image file (works on web)
      if (latitude === null || longitude === null) {
        const gps = await extractGpsFromImage(asset.uri)
        if (gps) {
          latitude = gps.latitude
          longitude = gps.longitude
        }
      }

      if (latitude === null || longitude === null) {
        setError(
          'Could not read location from image. Please use a photo that contains GPS data.'
        )
        setPicking(false)
        return
      }

      router.navigate({
        pathname: '/contribute/finalize',
        params: {
          imageData: asset.uri,
          latitude,
          longitude,
          locationName,
        },
      })
    } catch (e) {
      console.error('Failed to pick image:', e)
      setError('Failed to pick image. Please try again.')
      setPicking(false)
    }
  }

  return (
    <ScreenView className="items-center justify-center border-4">
      {picking && <Text>Selecting image...</Text>}
      {error && (
        <>
          <Text>{error}</Text>
          <BackLink to="/contribute" />
        </>
      )}
      {!picking && !error && <Text>No image selected.</Text>}
      <BackLink to="/contribute" />
    </ScreenView>
  )
}
