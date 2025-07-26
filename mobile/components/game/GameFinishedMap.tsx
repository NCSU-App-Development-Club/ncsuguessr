import React from 'react'
import { View } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { MaterialIcons } from '@expo/vector-icons'
import { Coordinate } from '../../util/space/location'

interface GameFinishedMapProps {
  mapRef: React.RefObject<MapView>
  setMapReady: (ready: boolean) => void
  userGuess: Coordinate
  actualLocation: Coordinate | null
}

export default function GameFinishedMap({
  mapRef,
  setMapReady,
  userGuess,
  actualLocation,
}: GameFinishedMapProps) {
  return (
    <MapView
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
      onMapReady={() => setMapReady(true)}
      initialRegion={{
        latitude:
          (userGuess.getLatitude() + (actualLocation?.getLatitude() ?? 0)) / 2,
        longitude:
          (userGuess.getLongitude() + (actualLocation?.getLongitude() ?? 0)) /
          2,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      {/* User's guess marker */}
      <Marker coordinate={userGuess.toJSON()} pinColor="blue">
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="person-pin" size={30} color="#4285F4" />
        </View>
      </Marker>

      {/* Actual location marker with flag */}
      <Marker
        coordinate={
          actualLocation?.toJSON() ?? {
            latitude: 0,
            longitude: 0,
          }
        }
        pinColor="red"
      >
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="flag" size={30} color="#EA4335" />
        </View>
      </Marker>

      {/* Line connecting the points */}
      {actualLocation && (
        <Polyline
          coordinates={[userGuess.toJSON(), actualLocation.toJSON()]}
          strokeColor="black"
          strokeWidth={2}
          lineDashPattern={[5, 5]}
        />
      )}
    </MapView>
  )
}
