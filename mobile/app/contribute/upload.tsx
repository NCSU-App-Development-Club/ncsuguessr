import Text from '../../components/global/Text'
import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'

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
      })

      if (result.canceled || !result.assets?.[0]) {
        setPicking(false)
        return
      }

      const asset = result.assets[0]

      router.navigate({
        pathname: '/contribute/location',
        params: {
          imageData: asset.uri,
          locationName: 'NCSU',
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
