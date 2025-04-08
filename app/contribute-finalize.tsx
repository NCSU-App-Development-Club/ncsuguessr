import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { router, useLocalSearchParams } from 'expo-router'
import { Image, View } from 'react-native'
import ScreenButton from '../components/global/ScreenButton'

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
    formData.append('takenAt', new Date().toISOString().split('T')[0])
    formData.append('locationName', locationName.toString())
    formData.append('image', {
      uri: imageData,
      type: 'image/jpeg',
      name: 'photo.jpg',
    })
    console.log(formData)

    await fetch('/api/v1/images', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    })
    router.navigate('/')
  }

  return (
    <ScreenView className="flex-1">
      <Image
        source={{ uri: imageData }}
        className="flex-1"
        resizeMode="cover"
      />
      <View className="flex-row justify-items-end">
        <ScreenButton
          className="flex-1"
          title="Retake"
          onPress={() => router.navigate({ pathname: '/contribute-photo' })}
        />
        <ScreenButton
          className="flex-1"
          title="Submit"
          onPress={async () => await submitImage()}
        />
      </View>
      <BackLink to="/" />
    </ScreenView>
  )
}
