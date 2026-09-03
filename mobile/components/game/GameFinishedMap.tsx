import React, { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { MaterialIcons } from '@expo/vector-icons'
import { GameFinishedMapProps } from './types'

export default function GameFinishedMap({
  userGuess,
  actualLocation,
}: GameFinishedMapProps) {
  const mapRef = useRef<MapView>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (mapRef.current && mapReady && actualLocation) {
      mapRef.current.fitToCoordinates(
        [actualLocation.toJSON(), userGuess.toJSON()],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      )
    }
  }, [mapReady, userGuess, actualLocation])

  return (
    <MapView
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
      onMapReady={() => setMapReady(true)}
      initialRegion={{
        latitude: actualLocation
          ? (userGuess.getLatitude() + actualLocation.getLatitude()) / 2
          : userGuess.getLatitude(),
        longitude: actualLocation
          ? (userGuess.getLongitude() + actualLocation.getLongitude()) / 2
          : userGuess.getLongitude(),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >
      <Marker coordinate={userGuess.toJSON()} pinColor="blue">
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <MaterialIcons name="person-pin" size={30} color="#4285F4" />
        </View>
      </Marker>

      {actualLocation && (
        <Marker coordinate={actualLocation.toJSON()} pinColor="red">
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="flag" size={30} color="#EA4335" />
          </View>
        </Marker>
      )}

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
