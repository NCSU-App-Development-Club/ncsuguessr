import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import { View, TouchableOpacity, Share } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { ImageDto } from '@ncsuguessr/types/src/images'
import { calculateDistance } from '../util/map'
import BackLink from '../components/global/BackLink'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { fetchGame } from '../util/api/games'
import z from 'zod'

const UserGuessSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

type UserGuess = z.infer<typeof UserGuessSchema>

const GameFinishedParamsSchema = z.object({
  gameDate: z.string(),
  userGuess: z.string(),
})

type GameFinishedParams = z.infer<typeof GameFinishedParamsSchema>

export default function GameFinished() {
  const params = useLocalSearchParams<GameFinishedParams>()

  const [gameDataLoading, setGameDataLoading] = useState(true)
  const [gameDataError, setGameDataError] = useState<string | null>(null)
  const [gameData, setGameData] = useState<ImageDto | null>(null)

  const mapRef = useRef<MapView>(null)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setGameDataLoading(true)
        const gameDataResponse = await fetchGame(params.gameDate)

        if (!gameDataResponse.success) {
          throw new Error(gameDataResponse.error)
        }

        setGameData(gameDataResponse.game.image)
      } catch (e) {
        console.error(e)
        setGameDataError(`${e}`)
      } finally {
        setGameDataLoading(false)
      }
    }

    fetchGameData()
  }, [])

  const actualLocation = {
    latitude: gameData?.latitude || 0,
    longitude: gameData?.longitude || 0,
  }

  const userGuess = UserGuessSchema.parse(JSON.parse(params.userGuess)) || {
    latitude: 0,
    longitude: 0,
  }

  useEffect(() => {
    if (mapRef.current && gameData) {
      mapRef.current.fitToCoordinates([actualLocation, userGuess], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      })
    }
  }, [gameData, mapReady])

  const distance = calculateDistance(userGuess, actualLocation).toFixed(2)
  const locationName = gameData?.location_name || ''

  if (gameDataLoading) {
    return <Text>Loading...</Text>
  }

  const GameFinishedMap = () => {
    return (
      <MapView
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
        onMapReady={() => setMapReady(true)}
        initialRegion={{
          latitude: (userGuess.latitude + actualLocation.latitude) / 2,
          longitude: (userGuess.longitude + actualLocation.longitude) / 2,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* User's guess marker */}
        <Marker coordinate={userGuess} pinColor="blue">
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="person-pin" size={30} color="#4285F4" />
          </View>
        </Marker>

        {/* Actual location marker with flag */}
        <Marker coordinate={actualLocation} pinColor="red">
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MaterialIcons name="flag" size={30} color="#EA4335" />
          </View>
        </Marker>

        {/* Line connecting the points */}
        <Polyline
          coordinates={[userGuess, actualLocation]}
          strokeColor="black"
          strokeWidth={2}
          lineDashPattern={[5, 5]}
        />
      </MapView>
    )
  }

  const handleShareScore = async () => {
    const shareText = `NCSUGuessr ${params.gameDate}:\n📍---- ${distance}km ----🏁`
    await Share.share({
      message: shareText,
    })
  }

  return (
    <ScreenView className="items-center justify-between py-10 px-5">
      <BackLink to="/home" label="Home" />

      <Text className="text-4xl font-bold mb-10">Results</Text>

      <View className="w-full items-center justify-center mb-4">
        <Text className="text-2xl text-center mb-2">
          Your closest guess was{' '}
          <Text className="text-red-600 font-bold">{distance} km</Text> from the
          location:{' '}
          <Text className="text-red-600 font-bold">{locationName}</Text>
        </Text>
      </View>

      <TouchableOpacity
        className="bg-red-600 w-full py-4 rounded-full mb-6 flex-row justify-center items-center"
        onPress={handleShareScore}
      >
        <Text className="text-2xl font-bold mr-2">Share Score</Text>
        <FontAwesome name="clipboard" size={24} color="black" />
      </TouchableOpacity>

      <View className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-gray-300 mb-6">
        <GameFinishedMap />
      </View>

      <View className="w-full flex-row space-x-4 mb-6">
        <TouchableOpacity
          className="bg-red-600 flex-1 py-4 rounded-full"
          onPress={() => router.replace('/')}
        >
          <Text className="text-white text-xl font-bold text-center">
            Play More
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 flex-1 py-4 rounded-full"
          onPress={() => router.push('/stats')}
        >
          <Text className="text-white text-xl font-bold text-center">
            View Stats
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  )
}
