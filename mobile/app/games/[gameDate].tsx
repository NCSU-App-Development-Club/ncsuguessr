import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Image, Modal, TouchableOpacity, View } from 'react-native'
import { MapPressEvent } from 'react-native-maps'
import GameEventModal from '../../components/game/GameEventModal'
import GameMap from '../../components/game/GameMap'
import Text from '../../components/global/Text'
import { fetchGame } from '../../util/api'
import { Distance } from '../../util/space/distance'
import { Coordinate } from '../../util/space/location'
import { GamesLocalStore } from '../../util/storage/games'
import { StatsLocalStore } from '../../util/storage/stats'
import { formatTime } from '../../util/time'
import { Day } from '../../util/time/day'
import { Duration } from '../../util/time/duration'

export default function Game() {
  const router = useRouter()
  const { gameDate } = useLocalSearchParams<{ gameDate: string }>()
  const gameDay = Day.ofString(gameDate)

  const [expandedImage, setExpandedImage] = useState<boolean>(false)

  const [guessMarker, setGuessMarker] = useState<Coordinate | null>(null)
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
  const [startTime] = useState(new Date())
  const [elapsedTime, setElapsedTime] = useState(Duration.zero())
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const correctLocation = useRef<{
    name: string
    coord: Coordinate
  } | null>(null)
  const closestGuess = useRef<Coordinate | null>(null)
  const closestDistance = useRef<Distance>(Distance.infinity())

  // Update timer every second
  useEffect(() => {
    if (gameOver) return

    const timer = setInterval(() => {
      const now = new Date()
      setElapsedTime(Duration.fromDates(startTime, now))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime, gameOver])

  useEffect(() => {
    // TODO: a loading state?
    const fetchGameAndImage = async () => {
      setError(null)

      try {
        const gameData = await fetchGame(gameDate)
        if (!gameData.success) {
          throw new Error(`failed to fetch game: ${gameData.error}`)
        }

        setImageUrl(gameData.game.image.url)

        correctLocation.current = {
          name: gameData.game.image.location_name,
          coord: new Coordinate(
            gameData.game.image.latitude,
            gameData.game.image.longitude
          ),
        }
      } catch (err) {
        setError('Failed to load image')
        console.error('Error fetching game or image:', err)
      }
    }

    // TODO: why? better way to do this?
    if (gameDate) {
      fetchGameAndImage()
    } else {
      setError('No game ID provided')
    }
  }, [gameDate])

  const handleMapPress = (event: MapPressEvent) => {
    if (gameOver) return

    const coords = Coordinate.ofObject(event.nativeEvent.coordinate)
    setGuessMarker(coords)
  }

  const submitGameStats = async (
    finalDistance: Distance,
    wasSuccessful: boolean
  ) => {
    const gameEndTime = new Date()
    const timeSpent = Duration.fromDates(startTime, gameEndTime)
    const today = Day.ofDate(gameEndTime)

    // Log stats in a more readable format for development
    if (__DEV__) {
      console.log('Game Stats:')
      console.log(`Location: ${correctLocation.current?.name}`)
      console.log(`Time Spent: ${timeSpent.toSeconds()} seconds`)
      console.log(`Final Distance: ${finalDistance.toKilometers()} km`)
      console.log(`Found Location: ${wasSuccessful ? 'Yes' : 'No'}`)
      console.log('-------------------')
    }

    // Record the guess in stats
    try {
      await StatsLocalStore.recordGame(
        finalDistance,
        // TODO: how to handle null location?
        correctLocation.current?.name ?? '',
        today,
        timeSpent
      )
    } catch (error) {
      console.error('Failed to record stats:', error)
    }
  }

  const handleGuess = () => {
    if (!guessMarker || gameOver) return

    if (correctLocation.current === null) {
      // TODO: throw some kind of error?
      return
    }

    const distance = guessMarker.distance(correctLocation.current.coord)
    // TODO: what
    const remainingGuesses = 3 - (guessCount + 1)

    if (distance < closestDistance.current) {
      closestDistance.current = distance
      // TODO: guessMarker was copied before being assigned to closestGuess.current. Why?
      closestGuess.current = guessMarker
    }

    if (distance < Distance.ofMeters(200)) {
      // Within ~200 meters - Success!
      setGameOver(true)
      setGameEventModalContent({
        title: 'Yay! 🎉',
        message: 'Congratulations! You found the correct location!',
        subMessage: `Time: ${formatTime(elapsedTime.toMillis())}`,
      })
      setShowGameEventModal(true)
      submitGameStats(distance, true)
    } else if (guessCount >= 2) {
      // Out of guesses - Game Over
      setGameOver(true)
      setGameEventModalContent({
        title: 'Game Over 😔',
        message: `You're out of guesses!`,
        subMessage: `Time: ${formatTime(elapsedTime.toMillis())}`,
      })
      setShowGameEventModal(true)
      submitGameStats(distance, false)
    } else {
      // Not a correct guess and more guesses left
      setGameEventModalContent({
        title: 'Try Again',
        message: `You're about ${distance.toKilometers().toFixed(2)}km away. ${remainingGuesses} ${remainingGuesses === 1 ? 'guess' : 'guesses'} remaining.`,
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
              ? // TODO: why this check? when would gameOver be false here?
                async () => {
                  await GamesLocalStore.addLocalPlayedGame(gameDay)
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
          <Text className="text-gray-500">
            Time: {formatTime(elapsedTime.toMillis())}
          </Text>
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
