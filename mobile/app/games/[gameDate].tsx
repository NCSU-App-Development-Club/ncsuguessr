import {
  GetGameSuccessResponse,
  GetGameSuccessResponseSchema,
} from '@ncsuguessr/types/src/games'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Image, Modal, TouchableOpacity, View } from 'react-native'
import GameEventModal from '../../components/game/GameEventModal'
import GameMap from '../../components/game/GameMap'
import Text from '../../components/global/Text'
import { calculateDistance } from '../../util/map'
import { addLocalPlayedGame } from '../../util/storage/gamesStorage'
import { recordGuess } from '../../util/storage/statsStorage'
import { formatTime } from '../../util/time'

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
  }

  const handleGuess = () => {
    if (!guessMarker || gameOver) return

    const distance = calculateDistance(guessMarker, correctLocation.current)
    const remainingGuesses = 3 - (guessCount + 1)

    if (distance < closestDistance.current) {
      closestDistance.current = distance
      closestGuess.current = { ...guessMarker }
    }

    if (distance < 0.2) {
      // Within ~200 meters - Success!
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
                  await addLocalPlayedGame(gameDate)
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
