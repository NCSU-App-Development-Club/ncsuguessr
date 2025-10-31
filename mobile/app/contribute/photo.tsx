import Text from '../../components/global/Text'
import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import React, { useRef, useState } from 'react'
import { View, Button, TouchableOpacity, Pressable } from 'react-native'
import { useCameraPermissions, CameraView } from 'expo-camera'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import ScreenButton from '../../components/global/ScreenButton'

export default function ContributePhoto() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [locationPermission, requestLocationPermission] =
    Location.useForegroundPermissions()

  const [tookPicture, setTookPicture] = useState(false)

  const cameraViewRef = useRef<CameraView | null>(null)

  if (!cameraPermission || !locationPermission) {
    // Permissions are still loading.
    return (
      <View>
        <BackLink to="/" />
      </View>
    )
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <ScreenView className="items-center justify-center border-4">
        <Text>We need your permission to access the camera.</Text>
        <ScreenButton
          onPress={requestCameraPermission}
          title="Grant Camera Permission"
        />
        <BackLink to="/" />
      </ScreenView>
    )
  }

  if (!locationPermission.granted) {
    // Location permissions are not granted yet.
    return (
      <ScreenView className="items-center justify-center border-4">
        <Text>We need your permission to access your current location.</Text>
        <ScreenButton
          onPress={requestLocationPermission}
          title="Grant Location Permission"
        />
        <BackLink to="/" />
      </ScreenView>
    )
  }

  async function takePhoto() {
    const camera = cameraViewRef.current?._cameraRef.current
    if (!camera) return
    const picture = await camera.takePicture({})
    const loc = await Location.getCurrentPositionAsync()
    router.navigate({
      pathname: '/contribute/finalize',
      params: {
        imageData: picture.uri,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        locationName: 'todo',
      },
    })
  }

  return (
    <ScreenView className="items-center justify-center border-4">
      {tookPicture ? (
        <View>Processing...</View>
      ) : (
        <CameraView
          facing="back"
          ref={cameraViewRef}
          // className="absolute top-0 bottom-0 left-0 right-0 w-[100px] h-[100px]"
          // style={{ flex: 1, width: '100%' }}
          style={{ width: '100%', height: '80%' }}
          zoom={0}
          ratio="4:3"
        />
      )}
      <Pressable
        onPress={takePhoto}
        className={`rounded bg-ncsured w-52 p-1.5 m-1.5`}
      >
        <Text className="text-center text-white font-bold">text</Text>
      </Pressable>
      <BackLink to="/" />
    </ScreenView>
  )
}
