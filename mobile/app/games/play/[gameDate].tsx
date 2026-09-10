import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
  Image,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native'
import GameEventModal from '../../../components/game/GameEventModal'
import GameMap from '../../../components/game/GameMap'
import { MapPressEvent } from '../../../components/game/types'
import BackLink from '../../../components/global/BackLink'
import Button from '../../../components/global/Button'
import Text from '../../../components/global/Text'
import { fetchGame } from '../../../util/api/games'
import { Distance } from '../../../util/space/distance'
import { Coordinate } from '../../../util/space/location'
import { GamesLocalStore } from '../../../util/storage/games'
import { StatsLocalStore } from '../../../util/storage/stats'
import { formatTime } from '../../../util/time'
import { Day } from '../../../util/time/day'
import { Duration } from '../../../util/time/duration'

const IMAGE_WIDTH_COLLAPSED = 192
const IMAGE_WIDTH_EXPANDED_WEB = 384
// Gap kept between the expanded image preview and each screen edge on mobile
const SCREEN_EDGE_INSET = 40

export default function Game() {
  const router = useRouter()
  const { gameDate } = useLocalSearchParams<{ gameDate: string }>()
  const gameDay = Day.ofString(gameDate)

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
  // aspect ratio (width / height) of the loaded image, so the preview box can
  // match non-square images instead of cropping them into a fixed square
  const [imageAspectRatio, setImageAspectRatio] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const correctLocation = useRef<{
    name: string
    coord: Coordinate
  } | null>(null)
  const closestGuess = useRef<Coordinate | null>(null)
  const closestDistance = useRef<Distance>(Distance.infinity())

  // generate a circle polygon (returns [{latitude, longitude}, ...])
  function circlePolygon(
    center: { latitude: number; longitude: number },
    radiusMeters: number,
    points = 64
  ) {
    const coords: { latitude: number; longitude: number }[] = []
    const R = 6378137 // Earth radius in meters
    const latRad = (center.latitude * Math.PI) / 180
    const lonRad = (center.longitude * Math.PI) / 180
    const dDivR = radiusMeters / R

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * 2 * Math.PI
      const lat =
        Math.asin(
          Math.sin(latRad) * Math.cos(dDivR) +
            Math.cos(latRad) * Math.sin(dDivR) * Math.cos(theta)
        ) *
        (180 / Math.PI)
      const lon =
        (lonRad +
          Math.atan2(
            Math.sin(theta) * Math.sin(dDivR) * Math.cos(latRad),
            Math.cos(dDivR) - Math.sin(latRad) * Math.sin((lat * Math.PI) / 180)
          )) *
        (180 / Math.PI)
      coords.push({ latitude: lat, longitude: lon })
    }

    return coords
  }
  // allowed area where player can drop a pin
  const allowedPolygon = circlePolygon(
    { latitude: 35.78, longitude: -78.675 }, // long and lat for center of the circle
    5250, // radius in meters of the circle on the map
    64 // number of points for the circle
  )
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

  const isWeb = Platform.OS === 'web'
  // web: preview grows while hovered. native: tap toggles it (no hover there).
  const [imageHovered, setImageHovered] = useState(false)
  const [imageTapped, setImageTapped] = useState(false)
  const imageBig = isWeb ? imageHovered : imageTapped

  const { width: screenWidth } = useWindowDimensions()
  const maxImageWidth = Math.max(0, screenWidth - SCREEN_EDGE_INSET * 2)
  const previewWidth = Math.min(IMAGE_WIDTH_COLLAPSED, maxImageWidth)
  const imageWidth = imageBig
    ? Math.min(isWeb ? IMAGE_WIDTH_EXPANDED_WEB : Infinity, maxImageWidth)
    : previewWidth

  return (
    <>
      <View>
        <BackLink to="/" />
      </View>
      <View className="flex-1 items-center gap-2 absolute top-0 left-0 right-0 bottom-0">
        <GameEventModal
          open={showGameEventModal}
          setOpen={setShowGameEventModal}
          onClose={
            gameOver
              ? // TODO: why this check? when would gameOver be false here?
                async () => {
                  await GamesLocalStore.addLocalPlayedGame(gameDay)
                  router.replace({
                    pathname: '/games/finished',
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

        <View
          className="absolute bottom-6 right-10 z-10 items-end gap-2"
          style={{ width: previewWidth }}
        >
          <Pressable
            onHoverIn={() => setImageHovered(true)}
            onHoverOut={() => setImageHovered(false)}
            onPress={isWeb ? undefined : () => setImageTapped((v) => !v)}
          >
            <View
              className="overflow-hidden rounded-2xl"
              style={
                {
                  width: imageWidth,
                  aspectRatio: imageAspectRatio,
                  // web (react-native-web): smoothly animate the size change
                  transitionProperty: 'width',
                  transitionDuration: '150ms',
                  transitionTimingFunction: 'ease-out',
                } as object
              }
            >
              {error ? (
                <View className="w-full h-full justify-center items-center">
                  <Text className="text-red-500">{error}</Text>
                </View>
              ) : imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                  onLoad={(e) => {
                    // native gives nativeEvent.source.{width,height};
                    // react-native-web gives the DOM <img> on nativeEvent.target
                    const source = e.nativeEvent?.source
                    const target = (
                      e.nativeEvent as { target?: HTMLImageElement }
                    )?.target
                    const width = source?.width ?? target?.naturalWidth
                    const height = source?.height ?? target?.naturalHeight
                    if (width && height) {
                      setImageAspectRatio(width / height)
                    }
                  }}
                />
              ) : (
                <View className="w-full h-full justify-center items-center">
                  <Text>Loading image...</Text>
                </View>
              )}
            </View>
          </Pressable>

          <Button
            onPress={!guessMarker || gameOver ? undefined : handleGuess}
            title="Guess"
            fullWidth
            icon={<SimpleLineIcons name="check" size={22} color="#fff" />}
          />
        </View>

        <View className="w-full h-full overflow-hidden rounded-2xl">
          <GameMap
            guessMarker={guessMarker}
            onPress={handleMapPress}
            allowedPolygon={allowedPolygon}
          />
        </View>
      </View>
    </>
  )
}
