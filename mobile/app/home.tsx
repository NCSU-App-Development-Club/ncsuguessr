import { BlurView } from 'expo-blur'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ImageBackground, useWindowDimensions, View } from 'react-native'
import { MarkedDates } from 'react-native-calendars/src/types'
import { GameSelectCalendar } from '../components/home/GameSelectCalendar'
import { PlayButton } from '../components/home/PlayButton'
import { TabBar } from '../components/home/TabBar'
import { getGameDates } from '../util/api/games'
import { GamesLocalStore } from '../util/storage/games'
import { Day } from '../util/time/day'

export default function Home() {
  const router = useRouter()

  const [error, setError] = useState<string | null>(null)

  const [today] = useState(Day.ofDate(new Date()))
  const [selectedDate, setSelectedDate] = useState(today)

  const [gameDatesLoading, setGameDatesLoading] = useState(false)
  const [gameDates, setGameDates] = useState<Day[]>([])

  const [playedAlready, setPlayedAlready] = useState<Day[]>([])

  const selectedGameExists = useMemo(
    () =>
      gameDates.map((day) => day.toString()).includes(selectedDate.toString()),
    [selectedDate, gameDates]
  )

  const selectedGamePlayed = useMemo(
    () =>
      playedAlready
        .map((day) => day.toString())
        .includes(selectedDate.toString()),
    [selectedDate, playedAlready]
  )

  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  useEffect(() => {
    const fetchGameDates = async () => {
      try {
        setGameDatesLoading(true)
        const gameDatesResponse = await getGameDates()
        const playedGames = await GamesLocalStore.getPlayedGamesOrDefault()

        setPlayedAlready(playedGames)

        if (!gameDatesResponse.success) {
          throw new Error(gameDatesResponse.error)
        }

        setGameDates(
          gameDatesResponse.games.map((game) => Day.ofString(game.date))
        )

        const playedGamesSet = new Set(
          [...playedGames].map((gameDay) => gameDay.toString())
        )

        const toMark: MarkedDates = Object.fromEntries(
          gameDatesResponse.games.map((game) => [
            game.date,
            {
              marked: true,
              dotColor: playedGamesSet.has(game.date) ? 'gray' : '#CC0000',
            },
          ])
        )

        setMarkedDates(toMark)
      } catch (e) {
        console.error(e)
        setError(`${e}`)
      } finally {
        setGameDatesLoading(false)
      }
    }

    fetchGameDates()
  }, [])

  const { height } = useWindowDimensions()

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center">
        <View className="w-full h-full self-center">
          <GameSelectCalendar
            gameDatesLoading={gameDatesLoading}
            error={error}
            today={today}
            markedDates={markedDates}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </View>
      </View>

      <View
        style={{ height: height * 0.35 }}
        className="rounded-t-3xl overflow-hidden shadow-2xl"
      >
        <ImageBackground
          source={require('../assets/lighthouse.jpeg')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        >
          <BlurView
            intensity={80}
            tint="dark"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <View className="flex-1 justify-center items-center px-8">
            <PlayButton
              selectedGameExists={selectedGameExists}
              selectedGamePlayed={selectedGamePlayed}
              gameDatesLoading={gameDatesLoading}
              selectedDate={selectedDate}
              today={today}
              router={router}
            />
          </View>
        </ImageBackground>
      </View>

      <TabBar router={router} />
    </View>
  )
}
