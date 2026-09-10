import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'
import { router, useLocalSearchParams } from 'expo-router'
import { Image, View } from 'react-native'
import React, { useState } from 'react'
import Text from '../../components/global/Text'
import Button from '../../components/global/Button'
import LocationPickerMap from '../../components/contribute/LocationPickerMap'

const DEFAULT_LOCATION = { latitude: 35.7847, longitude: -78.6821 }

export default function ContributeLocation() {
  const { imageData, locationName } = useLocalSearchParams()

  const imageUri = typeof imageData === 'string' ? imageData : null

  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION)

  function handleConfirm() {
    if (!imageUri) return

    router.navigate({
      pathname: '/contribute/finalize',
      params: {
        imageData: imageUri,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        locationName:
          typeof locationName === 'string' && locationName
            ? locationName
            : 'NCSU',
      },
    })
  }

  return (
    <ScreenView className="flex-1">
      <BackLink to="/contribute" />
      <View className="flex-1 pt-10 px-2 pb-4 gap-2">
        {imageUri ? (
          <View className="w-full h-48 overflow-hidden rounded-2xl">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        ) : (
          <View>
            <Text>No image provided</Text>
          </View>
        )}

        <Text className="text-center">
          Tap the map to set where this photo was taken.
        </Text>

        <View className="flex-1 overflow-hidden rounded-2xl">
          <LocationPickerMap
            selectedLocation={selectedLocation}
            onPress={setSelectedLocation}
          />
        </View>

        <View className="w-full">
          <Button
            onPress={handleConfirm}
            title="Use this location"
            size="lg"
            fullWidth
          />
        </View>
      </View>
    </ScreenView>
  )
}
