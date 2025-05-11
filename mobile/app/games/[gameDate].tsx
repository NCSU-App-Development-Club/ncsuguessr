import Text from '../../components/global/Text'

import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

import {
  GetGameSuccessResponse,
  GetGameSuccessResponseSchema,
} from '@ncsuguessr/types/src/games'

import { recordGuess } from '../../storage/statsStorage'

import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps'

import { useState, useEffect, useRef } from 'react'

import { formatTime } from '../../util/time'

import { calculateDistance } from '../../util/map'
import { addPlayedGame } from '../../storage/gamesStorage'
import React from 'react'

type GuessMarker = {
  latitude: number
  longitude: number
}

// Development settings
const SHOW_DEV_CONTROLS = true // Toggle this to show/hide dev controls

// Mock function for stats submission - to be replaced by actual implementation
const submitGameStats = (stats: {
  locationName: string
  timeSpentMs: number
  finalDistanceKm: number
  wasSuccessful: boolean
}) => {
  console.log('Submitting game stats:', stats)
}

const GameEventModal = ({
  open,
  setOpen,
  onClose,
  title,
  message,
  subMessage,
}: {
  open: boolean
  setOpen: (s: boolean) => void
  onClose?: () => void
  title: string
  message: string
  subMessage?: string
}) => {
  return (
    <Modal visible={open} transparent={true} animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 24,
              borderRadius: 16,
              width: '80%',
              maxWidth: 320,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              display: 'flex',
              gap: 10,
            }}
          >
            <Text className="text-2xl font-bold">{title}</Text>
            <Text className="text-lg text-center">{message}</Text>
            {subMessage ? (
              <Text className="text-base text-center text-gray-600">
                {subMessage}
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                setOpen(false)
                onClose?.()
              }}
              style={{ width: '100%' }}
            >
              <View
                style={{
                  backgroundColor: '#CC0000',
                  borderRadius: 9999,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                }}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Continue
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default function Game() {
  const router = useRouter()
  const { gameDate } = useLocalSearchParams<{ gameDate: string }>()
  const [expandedImage, setExpandedImage] = useState<boolean>(false)
  const [guessMarker, setGuessMarker] = useState<GuessMarker | null>(null)
  const [guessCount, setGuessCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showGameEventModal, setShowGameEventModal] = useState(false)
  const [gameEventModalContent, setGameEventModalContent] = useState<{
    title: string
    message: string
    subMessage?: string
  }>({
    title: '',
    message: '',
    subMessage: '',
  })
  const [startTime] = useState(Date.now())
  const [elapsedTime, setElapsedTime] = useState(0)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const correctLocation = useRef({
    name: '',
    latitude: 0,
    longitude: 0,
  })

  const closestGuess = useRef<{
    latitude: number
    longitude: number
  }>({
    latitude: 0,
    longitude: 0,
  })
  const closestDistance = useRef<number>(Infinity)

  // Update timer every second
  useEffect(() => {
    if (gameOver) return

    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, gameOver])

  useEffect(() => {
    const fetchGameAndImage = async () => {
      setError('')
      try {
        const gameResponse = await fetch(
          `https://ncsuguessr-api-staging.ncsuappdevelopmentclub.workers.dev/games/${gameDate}`
        )
        if (!gameResponse.ok) {
          throw new Error('Failed to fetch game')
        }
        const gameJson = await gameResponse.json()
        const gameData: GetGameSuccessResponse =
          GetGameSuccessResponseSchema.parse(gameJson)
        setImageUrl(gameData.game.image.url)
        correctLocation.current = {
          name: gameData.game.image.location_name,
          latitude: gameData.game.image.latitude,
          longitude: gameData.game.image.longitude,
        }
      } catch (err) {
        setError('Failed to load image')
        console.error('Error fetching game or image:', err)
      }
    }

    if (gameDate) {
      fetchGameAndImage()
    } else {
      setError('No game ID provided')
    }
  }, [gameDate])

  const handleMapPress = (event: any) => {
    if (gameOver) return
    const coords = event.nativeEvent.coordinate
    setGuessMarker(coords)
  }

  // In game.tsx, update the submitStats function to use recordGuess:

  const submitStats = async (finalDistance: number, wasSuccessful: boolean) => {
    const timeSpent = Date.now() - startTime
    const timeSpentSeconds = Math.round(timeSpent / 1000)
    const today = new Date().toISOString().split('T')[0]

    const stats = {
      locationName: correctLocation.current.name,
      timeSpentMs: timeSpent,
      finalDistanceKm: finalDistance,
      wasSuccessful,
    }

    // Log stats in a more readable format for development
    if (__DEV__) {
      console.log('Game Stats:')
      console.log(`Location: ${stats.locationName}`)
      console.log(
        `Time Spent: ${(stats.timeSpentMs / 1000).toFixed(1)} seconds`
      )
      console.log(`Final Distance: ${stats.finalDistanceKm.toFixed(2)} km`)
      console.log(`Found Location: ${stats.wasSuccessful ? 'Yes' : 'No'}`)
      console.log('-------------------')
    }

    // Record the guess in stats
    try {
      await recordGuess(
        finalDistance,
        correctLocation.current.name,
        today,
        timeSpentSeconds
      )
    } catch (error) {
      console.error('Failed to record stats:', error)
    }

    submitGameStats(stats) // Keep your existing submission if needed
  }

  const handleGuess = () => {
    if (!guessMarker || gameOver) return

    const distance = calculateDistance(guessMarker, correctLocation.current)
    const remainingGuesses = 3 - (guessCount + 1)

    if (distance < closestDistance.current) {
      closestDistance.current = distance
      closestGuess.current = { ...guessMarker }
    }

    if (distance < 0.1) {
      // Within ~100 meters - Success!
      setGameOver(true)
      setGameEventModalContent({
        title: 'Yay! 🎉',
        message: 'Congratulations! You found the correct location!',
        subMessage: `Time: ${formatTime(elapsedTime)}`,
      })
      setShowGameEventModal(true)
      submitStats(distance, true)
    } else if (guessCount >= 2) {
      // Out of guesses - Game Over
      setGameOver(true)
      setGameEventModalContent({
        title: 'Game Over 😔',
        message: `You're out of guesses!`,
        subMessage: `Time: ${formatTime(elapsedTime)}`,
      })
      setShowGameEventModal(true)
      submitStats(distance, false)
    } else {
      setGameEventModalContent({
        title: 'Try Again',
        message: `You're about ${distance.toFixed(2)}km away. ${remainingGuesses} ${remainingGuesses === 1 ? 'guess' : 'guesses'} remaining.`,
      })
      setShowGameEventModal(true)
      setGuessCount((prev) => prev + 1)
    }
  }

  return (
    <>
      <View className="p-4 flex-1 items-center gap-4 mt-8">
        <GameEventModal
          open={showGameEventModal}
          setOpen={setShowGameEventModal}
          onClose={
            gameOver
              ? async () => {
                  await addPlayedGame(gameDate)
                  router.replace({
                    pathname: '/game-finished',
                    params: {
                      gameDate,
                      userGuess: JSON.stringify(closestGuess.current),
                    },
                  })
                }
              : undefined
          }
          title={gameEventModalContent.title}
          message={gameEventModalContent.message}
          subMessage={gameEventModalContent.subMessage}
        />

        <Text className="text-3xl">Where is this?</Text>
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-gray-500">
            Guesses remaining: {3 - guessCount}
          </Text>
          <Text className="text-gray-500">Time: {formatTime(elapsedTime)}</Text>
        </View>

        <TouchableOpacity
          className="absolute bottom-4 left-4 h-24 w-24 rounded-2xl"
          onPress={() => setExpandedImage(true)}
        >
          <View className="overflow-hidden rounded-2xl">
            {error ? (
              <Text className="text-red-500">{error}</Text>
            ) : imageUrl ? (
              <Image source={{ uri: imageUrl }} className="h-24 w-24" />
            ) : (
              <Text>Loading image...</Text>
            )}
          </View>
        </TouchableOpacity>

        <View className="w-full h-[70%]">
          <View className="overflow-hidden rounded-2xl">
            <GameMap guessMarker={guessMarker} onPress={handleMapPress} />
          </View>
        </View>

        <Modal visible={expandedImage} transparent={true} className="h-fit">
          <View
            className="h-fit"
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                className="h-full bg-white border-r-16 m-2 p-2 flex-1"
                activeOpacity={1}
                onPress={() => setExpandedImage(false)}
              >
                {error ? (
                  <Text className="text-red-500">{error}</Text>
                ) : imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                ) : (
                  <Text>Loading image...</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={handleGuess}
          disabled={!guessMarker || gameOver}
        >
          <View
            className={`rounded w-52 p-1.5 m-1.5 text-center font-bold flex flex-row justify-center items-center ${!guessMarker || gameOver ? 'bg-gray-400' : 'bg-ncsured'}`}
          >
            <Text className="text-white font-bold text-center">
              {gameOver
                ? 'Game Over'
                : guessMarker
                  ? 'Submit Guess'
                  : 'Drop a pin first'}
            </Text>
          </View>
        </TouchableOpacity>

        <Text className="absolute bottom-14">(Click image to expand)</Text>

        {gameOver && (
          <TouchableOpacity
            onPress={() => {
              setGuessCount(0)
              setGuessMarker(null)
              setGameOver(false)
            }}
          >
            <View className="rounded bg-blue-500 w-52 p-1.5 m-1.5 text-center font-bold flex flex-row justify-center items-center">
              <Text className="text-white font-bold text-center">
                Play Again
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}

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

const styles = StyleSheet.create({
  smallMap: {
    width: 300,
    height: 200,
  },
  fullMap: {
    width: '100%',
    height: '100%',
  },
})
