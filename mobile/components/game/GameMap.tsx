import React, { useEffect, useRef, useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Polygon,
} from 'react-native-maps'
import Text from '../../components/global/Text'
import { Coordinate } from '../../util/space/location'
//import { event } from 'react-native/types_generated/Libraries/Animated/AnimatedExports'

const styles = StyleSheet.create({
  fullMap: {
    width: '100%',
    height: '100%',
  },
    mapContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 12,
    overflow: 'hidden',
  },
})

const GameMap = ({
  guessMarker,
  onPress,
  allowedPolygon,
}: {
  guessMarker: Coordinate | null
  onPress: (event: MapPressEvent) => void
  allowedPolygon?: { latitude: number; longitude: number }[]
}) => {
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
  const pointInPolygon = (
    lat: number,
    lng: number,
    polygon: { latitude: number; longitude: number }[]
  ) => {
    let inside = false
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].longitude
      const yi = polygon[i].latitude
      const xj = polygon[j].longitude
      const yj = polygon[j].latitude

      const intersect =
        (yi > lat) !== (yj > lat) &&
        lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi

      if (intersect) inside = !inside
    }
    return inside
  }


  const handlePress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    if (allowedPolygon) {
      const inside = pointInPolygon(latitude, longitude, allowedPolygon)
      if (!inside) {
        return
      }
    }
    onPress(event)
  }
  return (
    <>
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
