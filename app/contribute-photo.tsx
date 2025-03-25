import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import React, { useRef } from 'react';
import { View, Button, TouchableOpacity, Pressable } from 'react-native';
import { useCameraPermissions, CameraView } from 'expo-camera';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import ScreenButton from '../components/global/ScreenButton';

export default function ContributePhoto() {

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  
  const cameraViewRef = useRef<CameraView | null >(null);

  if (!cameraPermission || !locationPermission) {
    // Permissions are still loading.
    return <View />;
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <ScreenView className="items-center justify-center border-4">
        <Text>We need your permission to access the camera.</Text>
        <ScreenButton onPress={requestCameraPermission} title="Grant Camera Permission" />
      </ScreenView>
    );
  }

  if (!locationPermission.granted) {
    // Location permissions are not granted yet.
    return (
      <ScreenView className="items-center justify-center border-4">
        <Text>We need your permission to access your current location.</Text>
        <ScreenButton onPress={requestLocationPermission} title="Grant Location Permission" />
      </ScreenView>
    );
  }

  async function takePhoto() {
    const camera = cameraViewRef.current?._cameraRef.current;
    if (!camera) return;
    const picture = await camera.takePicture({});
    const loc = await Location.getCurrentPositionAsync();
    router.navigate({pathname: "/contribute-finalize", params: { pictureUri: picture.uri, latitude: loc.coords.latitude, longitude: loc.coords.longitude }});
  }

  return (
    <ScreenView className="items-center border-4 w-full flex-1">
      <CameraView facing="back" ref={cameraViewRef} className="h-full inest-0 justify-end">
        <ScreenButton onPress={takePhoto} title="Take Photo" />
      </CameraView>
      <BackLink to="/" />
    </ScreenView>
  )
}