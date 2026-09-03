import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import { router, useLocalSearchParams } from 'expo-router'
import { Alert, Image, View } from 'react-native'
import React, { useState } from 'react'
import Text from '../../components/global/Text'
import Button from '../../components/global/Button'
import { API_URL } from '../../util/api'

export default function ContributeFinalize() {
  const { imageData, latitude, longitude, locationName } =
    useLocalSearchParams()

  const [submitting, setSubmitting] = useState(false)

  const imageUri = typeof imageData === 'string' ? imageData : null

  async function submitImage() {
    if (!imageUri) return

    setSubmitting(true)
    try {
      const formData = new FormData()

      // @ts-expect-error React Native FormData expects { uri, name, type } objects
      formData.append('image', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      })
      formData.append('latitude', latitude.toString())
      formData.append('longitude', longitude.toString())
      // TODO: note this date is currently being represented in UTC
      formData.append('taken_at', new Date().toISOString().split('T')[0])
      formData.append('location_name', locationName.toString())
      formData.append('description', '')

      const response = await fetch(`${API_URL}/images`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      router.navigate('/')
    } catch (e) {
      console.error('Failed to submit image:', e)
      Alert.alert('Upload Failed', `${e}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ScreenView className="flex-1">
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          className="flex-1"
          resizeMode="cover"
        />
      ) : (
        <View>
          <Text>No image provided</Text>
        </View>
      )}
      <View className="w-full flex-row space-x-4 mb-6 py-1 gap-4 justify-center">
        <Button
          onPress={() => router.navigate('/contribute/photo')}
          title="Retake"
          size="lg"
        />
        <Button onPress={submitImage} title="Submit" size="lg" />
      </View>
      <BackLink to="/" />
    </ScreenView>
  )
}
