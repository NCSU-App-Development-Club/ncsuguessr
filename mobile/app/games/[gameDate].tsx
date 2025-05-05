import Text from '../../components/global/Text'
import ScreenView from '../../components/global/ScreenView'
import BackLink from '../../components/global/BackLink'

import {
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Dimensions,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'

import {
  GetGameSuccessResponse,
  GetGameSuccessResponseSchema,
} from '@ncsuguessr/types/src/games'

import { recordGuess } from '../../storage/statsStorage'

// Conditionally import MapView
const MapView =
  Platform.OS === 'web' ? null : require('react-native-maps').default
const Marker =
  Platform.OS === 'web' ? null : require('react-native-maps').Marker

import { useState, useEffect, useRef } from 'react'
import { incrementGamesPlayed } from '../../storage/statsStorage'
import { fetchGame } from '../../util'

import { formatTime } from '../../util/time'

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
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [guessMarker, setGuessMarker] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
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
  const isWeb = Platform.OS === 'web'
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const correctLocation = useRef({
    name: '',
    latitude: 0,
    longitude: 0,
  })

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

  const calculateDistance = (guess: {
    latitude: number
    longitude: number
  }) => {
    // Simple distance calculation (you could use a more accurate formula)
    const latDiff = Math.abs(guess.latitude - correctLocation.current.latitude)
    const lonDiff = Math.abs(
      guess.longitude - correctLocation.current.longitude
    )
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111 // Rough conversion to kilometers
  }

  const handleMapPress = (event: any) => {
    if (gameOver) return
    const coords = isWeb
      ? { latitude: event.latLng.lat(), longitude: event.latLng.lng() }
      : event.nativeEvent.coordinate
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

    const distance = calculateDistance(guessMarker)
    const remainingGuesses = 3 - (guessCount + 1)

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
        message: `You're out of guesses! The location was ${correctLocation.current.latitude.toFixed(4)}, ${correctLocation.current.longitude.toFixed(4)}`,
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

  // Function to render Google Maps iframe for web
  const renderGoogleMap = (width: string | number, height: string | number) => {
    return (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.9950865144584!2d-78.68429492427866!3d35.78469997258063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89acf5a2e3c3b38f%3A0xbc19fe1c5a8312ef!2sNorth%20Carolina%20State%20University!5e0!3m2!1sen!2sus!4v1716414060646!5m2!1sen!2sus"
        width={width}
        height={height}
        style={{ border: 0, borderRadius: isWeb ? '16px' : undefined }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }

  // Function to render native map for mobile
  const renderNativeMap = (smallMap: boolean) => {
    if (isWeb || !MapView || !Marker) return null

    const mapStyle = smallMap ? styles.smallMap : styles.fullMap

    return (
      <MapView
        style={mapStyle}
        initialRegion={{
          latitude: 35.7847,
          longitude: -78.6821,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {guessMarker && <Marker coordinate={guessMarker} pinColor="blue" />}
        {gameOver && <Marker coordinate={correctLocation} pinColor="green" />}
      </MapView>
    )
  }

  return (
    <View className="flex-1 items-center justify-center p-4">
      {/* Game End Modal */}
      <GameEventModal
        open={showGameEventModal}
        setOpen={setShowGameEventModal}
        onClose={
          gameOver
            ? () => {
                router.push('/game-finished')
              }
            : undefined
        }
        title={gameEventModalContent.title}
        message={gameEventModalContent.message}
        subMessage={gameEventModalContent.subMessage}
      />

      <Text className="text-3xl mb-4">Where is this?</Text>
      <View className="flex-row items-center justify-between w-full px-4 mb-2">
        <Text className="text-gray-500">
          Guesses remaining: {3 - guessCount}
        </Text>
        <Text className="text-gray-500">Time: {formatTime(elapsedTime)}</Text>
      </View>

      <TouchableOpacity onPress={() => setExpandedImage('map')}>
        <View className="relative p-2">
          <View className="overflow-hidden rounded-2xl">
            {isWeb ? renderGoogleMap(300, 200) : renderNativeMap(true)}
          </View>
          <View className="absolute top-4 right-4 bg-black/90 rounded-full w-14 h-14 items-center justify-center">
            <Text className="text-black-200/90 text-4xl font-bold">+</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setExpandedImage('belltower')}>
        <View className="relative p-2">
          <View className="overflow-hidden rounded-2xl">
            {error ? (
              <Text className="text-red-500">{error}</Text>
            ) : imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={{ width: 300, height: 200 }}
              />
            ) : (
              <Text>Loading image...</Text>
            )}
          </View>
          <View className="absolute top-4 right-4 bg-black/90 rounded-full w-14 h-14 items-center justify-center">
            <Text className="text-black-200/90 text-4xl font-bold">+</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={expandedImage !== null} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
          {/* Modal content */}
          <View style={{ flex: 1 }}>
            {expandedImage === 'map' ? (
              isWeb ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    margin: 20,
                    borderRadius: 16,
                    padding: 20,
                  }}
                >
                  {renderGoogleMap('90%', '90%')}
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    margin: 20,
                    borderRadius: 16,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                  }}
                >
                  {renderNativeMap(false)}
                </View>
              )
            ) : (
              <TouchableOpacity
                style={{
                  flex: 1,
                  margin: 20,
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                }}
                activeOpacity={1}
                onPress={() => setExpandedImage(null)}
              >
                {error ? (
                  <Text className="text-red-500">{error}</Text>
                ) : imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={{
                      width: '100%',
                      height: '100%',
                      resizeMode: 'contain',
                    }}
                  />
                ) : (
                  <Text>Loading image...</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom close button */}
          {expandedImage === 'map' && (
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
                onPress={() => setExpandedImage(null)}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 30,
                }}
              >
                <Text className="text-white text-base font-bold">
                  Close Map
                </Text>
              </TouchableOpacity>
            </View>
          )}
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

      {gameOver && (
        <TouchableOpacity
          onPress={() => {
            setGuessCount(0)
            setGuessMarker(null)
            setGameOver(false)
          }}
        >
          <View className="rounded bg-blue-500 w-52 p-1.5 m-1.5 text-center font-bold flex flex-row justify-center items-center">
            <Text className="text-white font-bold text-center">Play Again</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Dev button for instant game completion */}
      {__DEV__ && SHOW_DEV_CONTROLS && (
        <TouchableOpacity
          onPress={() => {
            setGameOver(true)
            setGameEventModalContent({
              title: 'Game Over 😔',
              message: `You're out of guesses! The location was ${correctLocation.current.latitude.toFixed(4)}, ${correctLocation.current.longitude.toFixed(4)}`,
              subMessage: `Time: ${formatTime(elapsedTime)}`,
            })
            setShowGameEventModal(true)
            submitStats(0.001, true) // Submit near-perfect score for dev button (1 meter)
          }}
          style={{ position: 'absolute', bottom: 10, right: 10 }}
        >
          <View className="bg-gray-200 px-3 py-1 rounded-full border border-gray-400">
            <Text className="text-xs text-gray-600">DEV: Win</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
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
