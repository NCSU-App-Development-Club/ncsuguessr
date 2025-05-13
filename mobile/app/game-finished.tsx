import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import { View, TouchableOpacity, Platform, Share, Image } from 'react-native'
import { Link, useLocalSearchParams, router } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { fetchGame } from '../util'
import { ImageDto } from '@ncsuguessr/types/src/images'

import { calculateDistance } from '../util/map'
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'

type GameFinishedProps = { gameDate: string; userGuess: LatLng | undefined }
type GameFinishedParams = { gameDate: string; userGuess: string }

export function GameFinishedMap(props: GameFinishedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [gameData, setGameData] = useState<ImageDto | null>(null)

  const mapRef = useRef<MapView>(null)
  const [mapReady, setMapReady] = useState(false)

  const [showImage, setShowImage] = useState(false)

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true)
        const gameDataResponse = await fetchGame(props.gameDate)

        if (!gameDataResponse.success) {
          throw new Error(gameDataResponse.error)
        }

        setGameData(gameDataResponse.game.image)
      } catch (e) {
        console.error(e)
        setError(`${e}`)
      } finally {
        setLoading(false)
      }
    }

    fetchGameData()
  }, [props.gameDate])

  const actualLocation = {
    latitude: gameData?.latitude || 0,
    longitude: gameData?.longitude || 0,
  }

  const userGuess = props.userGuess || { latitude: 0, longitude: 0 }

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
  const isWeb = Platform.OS === 'web'

  if (loading) return <Text>Loading...</Text>

  // Function to render native map
  const renderNativeMap = () => {
    if (isWeb || !MapView || !Marker || !Polyline) return null

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
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialIcons name="person-pin" size={30} color="#4285F4" />
          </View>
        </Marker>

        {/* Actual location marker with flag */}
        <Marker coordinate={actualLocation} pinColor="red">
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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

  const renderImage = () => {
    // @ts-ignore
    const imageUrl: string = gameData?.url
    return imageUrl ? (
      <Image
        source={{ uri: imageUrl }}
        style={{ width: undefined, height: undefined, flex: 1 }}
        resizeMode="cover"
      />
    ) : (
      <Text>Loading image...</Text>
    )
  }

  const handleShareScore = async () => {
    const shareText = `NCSUGuessr 2025-05-04:\n📍---- ${distance}m ----🏁`
    await Share.share({ message: shareText })
  }

  return (
    <View className="flex-1 items-center">
      <View className="w-full items-center justify-center mb-4">
        <Text className="text-2xl text-center mb-2">
          Your guess was
          <Text className="text-red-600 font-bold">{distance} meters</Text> from
          the actual location:
          <Text className="text-red-600 font-bold">{locationName}</Text>
        </Text>
      </View>

      <View className="justify-center flex-row w-full py-4 mb-6">
        <TouchableOpacity
          className="bg-red-600 rounded-full flex-row justify-center items-center"
          onPress={handleShareScore}
        >
          <Text className="text-2xl font-bold mr-2">Share Score</Text>
          <FontAwesome name="clipboard" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-600 rounded-full flex-row justify-center items-center"
          onPress={() => {
            setShowImage(!showImage)
            setMapReady(false)
          }}
        >
          <Text className="text-2xl font-bold mr-2">
            {showImage ? 'View Map' : 'View Image'}
          </Text>
          <FontAwesome
            name={showImage ? 'map' : 'image'}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 w-full aspect-square rounded-3xl overflow-hidden border-2 border-gray-300 mb-6">
        {!isWeb && !showImage && renderNativeMap()}
        {showImage && renderImage()}
      </View>
    </View>
  )
}

export default function GameFinished() {
  const params: any = useLocalSearchParams<GameFinishedParams>()
  params.userGuess = JSON.stringify(params.userGuess) || {
    latitude: 0,
    longitude: 0,
  }
  return (
    <ScreenView className="items-center justify-between py-10 px-5">
      <Text className="text-4xl font-bold mb-10">Results</Text>
      <View className="w-full items-start">
        <Link href="/home" asChild>
          <TouchableOpacity>
            <Text className="text-2xl font-bold">Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {GameFinishedMap(params as GameFinishedProps)}
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
