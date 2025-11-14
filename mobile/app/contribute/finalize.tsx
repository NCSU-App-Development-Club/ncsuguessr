import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import { router, useLocalSearchParams } from 'expo-router'
import { Image, View } from 'react-native'
import ScreenButton from '../../components/global/ScreenButton'
import React from 'react'
import Text from '../../components/global/Text'
import Button from '../../components/global/Button'

export default function ContributeFinalize() {
  const { imageData, latitude, longitude, locationName } =
    useLocalSearchParams()

  if (typeof imageData === 'object') {
    console.log('why is this object')
    return
  }

  console.log(imageData)

  async function submitImage() {
    console.log('Submitting')
    const formData = new FormData()
    formData.append('latitude', latitude.toString())
    formData.append('longitude', longitude.toString())
    // TODO: note this date is currently being represented in UTC
    formData.append('takenAt', new Date().toISOString().split('T')[0])
    formData.append('locationName', locationName.toString())
    console.log(formData)

    const blob = await (await fetch(imageData.toString())).blob()
    formData.append('image', blob)
    console.log('sending')

    // TODO: won't work, need to provide full URL
    const response = await fetch('/api/v1/images', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    })
    router.navigate('/')
  }

  return (
    <ScreenView className="flex-1">
      {imageData ? (
        <Image
          source={{ uri: imageData }}
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
