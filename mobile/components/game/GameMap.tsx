import React, { useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps'
import Text from '../../components/global/Text'

const styles = StyleSheet.create({
  fullMap: {
    width: '100%',
    height: '100%',
  },
})

const GameMap = ({
  guessMarker,
  onPress,
  onClose,
}: {
  guessMarker: GuessMarker | null
  onPress: (event: any) => void
  onClose?: () => void
}) => {
  const mapRef = useRef<MapView | null>(null)

  const [mapReady, setMapReady] = useState(false)
  const [layoutReady, setLayoutReady] = useState(false)

  useEffect(() => {
    if (mapReady && layoutReady) moveMapToCenter()
  }, [mapReady, layoutReady])

  const moveMapToCenter = () => {
    if (!guessMarker?.latitude || !guessMarker.longitude) return
    mapRef.current?.animateToRegion(
      {
        ...guessMarker,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500
    )
  }
  return (
    <>
      <MapView
        ref={mapRef}
        style={styles.fullMap}
        initialRegion={{
          latitude: 35.7847,
          longitude: -78.6821,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onMapReady={() => setMapReady(true)}
        onLayout={() => setLayoutReady(true)}
        onPress={onPress}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
      >
        {guessMarker && <Marker coordinate={guessMarker} pinColor="blue" />}
      </MapView>
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <TouchableOpacity
          onPress={moveMapToCenter}
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 30,
          }}
        >
          <Text className="text-white text-base font-bold">Center Pin</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default GameMap
