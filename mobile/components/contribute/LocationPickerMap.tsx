import React, { useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps'

export interface LocationPickerMapProps {
  selectedLocation: { latitude: number; longitude: number }
  onPress: (coords: { latitude: number; longitude: number }) => void
}

const styles = StyleSheet.create({
  fullMap: {
    width: '100%',
    height: '100%',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    borderColor: '#d1d5db',
    overflow: 'hidden',
  },
})

const LocationPickerMap = ({
  selectedLocation,
  onPress,
}: LocationPickerMapProps) => {
  const mapRef = useRef<MapView | null>(null)

  const [mapReady, setMapReady] = useState(false)
  const [layoutReady, setLayoutReady] = useState(false)
  const didCenter = useRef(false)

  useEffect(() => {
    if (mapReady && layoutReady && !didCenter.current) {
      didCenter.current = true
      mapRef.current?.animateToRegion(
        {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      )
    }
  }, [mapReady, layoutReady, selectedLocation])

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.fullMap}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onMapReady={() => setMapReady(true)}
        onLayout={() => setLayoutReady(true)}
        onPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate
          onPress({ latitude, longitude })
        }}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
      >
        <Marker coordinate={selectedLocation} pinColor="#CC0000" />
      </MapView>
    </View>
  )
}

export default LocationPickerMap
