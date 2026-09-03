import React, { useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polygon,
} from 'react-native-maps'
import { GameMapProps, MapPressEvent } from './types'

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

const GameMap = ({ guessMarker, onPress, allowedPolygon }: GameMapProps) => {
  const mapRef = useRef<MapView | null>(null)

  const [mapReady, setMapReady] = useState(false)
  const [layoutReady, setLayoutReady] = useState(false)

  useEffect(() => {
    if (mapReady && layoutReady) moveMapToCenter()
  }, [mapReady, layoutReady])

  const moveMapToCenter = () => {
    if (guessMarker === null) return

    mapRef.current?.animateToRegion(
      {
        ...guessMarker.toJSON(),
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500
    )
  }

  const handlePress = (event: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } }
  }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    if (allowedPolygon) {
      let inside = false
      for (
        let i = 0, j = allowedPolygon.length - 1;
        i < allowedPolygon.length;
        j = i++
      ) {
        const xi = allowedPolygon[i].longitude
        const yi = allowedPolygon[i].latitude
        const xj = allowedPolygon[j].longitude
        const yj = allowedPolygon[j].latitude
        const intersect =
          yi > latitude !== yj > latitude &&
          longitude < ((xj - xi) * (latitude - yi)) / (yj - yi) + xi
        if (intersect) inside = !inside
      }
      if (!inside) return
    }
    onPress(event as MapPressEvent)
  }

  return (
    <View style={styles.mapContainer}>
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
        onPress={handlePress}
        provider={
          Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
      >
        {guessMarker && (
          <Marker coordinate={guessMarker.toJSON()} pinColor="blue" />
        )}
        {allowedPolygon && allowedPolygon.length > 2 && (
          <Polygon
            coordinates={allowedPolygon}
            strokeColor="#CC0000"
            strokeWidth={3}
            fillColor="rgba(204,0,0,0.06)"
          />
        )}
      </MapView>
    </View>
  )
}

export default GameMap
