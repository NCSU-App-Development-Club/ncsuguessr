import { FontAwesome } from '@expo/vector-icons'
import { ImageDto } from '@ncsuguessr/types/src/images'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Share, TouchableOpacity, View } from 'react-native'
import MapView from 'react-native-maps'
import z from 'zod'
import GameFinishedMap from '../components/game/GameFinishedMap'
import BackLink from '../components/global/BackLink'
import ScreenView from '../components/global/ScreenView'
import Text from '../components/global/Text'
import { fetchGame } from '../util/api/games'
import { Coordinate } from '../util/space/location'

const UserGuessSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const GameFinishedParamsSchema = z.object({
  gameDate: z.string(),
  userGuess: z.string(),
})

type GameFinishedParams = z.infer<typeof GameFinishedParamsSchema>

export default function GameFinished() {
  const params = useLocalSearchParams<GameFinishedParams>()
  const userGuess = Coordinate.ofObject(
    UserGuessSchema.parse(JSON.parse(params.userGuess))
  )

  const [gameDataLoading, setGameDataLoading] = useState(true)
  const [gameDataError, setGameDataError] = useState<string | null>(null)
  const [imageData, setImageData] = useState<ImageDto | null>(null)
  const actualLocation = imageData
    ? new Coordinate(imageData.latitude, imageData.longitude)
    : null

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

        setImageData(gameDataResponse.game.image)
      } catch (e) {
        console.error(e)
        setGameDataError(`${e}`)
      } finally {
        setGameDataLoading(false)
      }
    }

    fetchGameData()
  }, [])

  useEffect(() => {
    if (mapRef.current && imageData && actualLocation) {
      mapRef.current.fitToCoordinates(
        [actualLocation.toJSON(), userGuess.toJSON()],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      )
    }
  }, [imageData, mapReady])

  const handleShareScore = async () => {
    const shareText = `NCSUGuessr ${params.gameDate}:\n📍---- ${distance}km ----🏁`
    await Share.share({
      message: shareText,
    })
  }

  const distance = actualLocation ? userGuess.distance(actualLocation) : null
  const locationName = imageData?.location_name || ''

  if (gameDataLoading) {
    return <Text>Loading...</Text>
  }

  if (gameDataError) {
    return (
      <ScreenView className="items-center justify-center py-10 px-5">
        <BackLink to="/home" label="Home" />
        <Text className="text-4xl font-bold mb-10">Results</Text>
        <Text className="text-red-600 text-xl font-bold text-center">
          Error: {gameDataError}
        </Text>
      </ScreenView>
    )
  }

  return (
    <ScreenView className="items-center justify-between py-10 px-5">
      <BackLink to="/home" label="Home" />

      <Text className="text-4xl font-bold mb-10">Results</Text>

      <View className="w-full items-center justify-center mb-4">
        <Text className="text-2xl text-center mb-2">
          Your closest guess was{' '}
          <Text className="text-red-600 font-bold">
            {distance?.toKilometers().toFixed(2)} km
          </Text>{' '}
          from the location:{' '}
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
        <GameFinishedMap
          mapRef={mapRef}
          setMapReady={setMapReady}
          userGuess={userGuess}
          actualLocation={actualLocation}
        />
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
