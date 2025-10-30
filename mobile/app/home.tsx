import {
  Image,
  ImageBackground,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import Text from '../components/global/Text'
import Button from '../components/global/Button'
import { useEffect, useMemo, useState } from 'react'
import { Day } from '../util/time/day'
import { DateData, MarkedDates } from 'react-native-calendars/src/types'
import { getGameDates } from '../util/api/games'
import { GamesLocalStore } from '../util/storage/games'
import { Calendar } from 'react-native-calendars'

const GameSelectCalendar = ({
  gameDatesLoading,
  error,
  today,
  markedDates,
  selectedDate,
  setSelectedDate,
}: {
  gameDatesLoading: boolean
  error: string | null
  today: Day
  markedDates: MarkedDates
  selectedDate: Day
  setSelectedDate: (d: Day) => void
}) => {
  return gameDatesLoading ? (
    <View>
      <Text className="text-center">Loading games...</Text>
    </View>
  ) : error ? (
    <View>
      <Text className="text-center">Error: {error}</Text>
    </View>
  ) : (
    <View>
      <Calendar
        initialDate={today.toString()}
        disableAllTouchEventsForDisabledDays={true}
        theme={{
          selectedDayBackgroundColor: '#CC0000',
          dotColor: '#CC0000',
          arrowColor: '#CC0000',
        }}
        onDayPress={(day: DateData) => {
          setSelectedDate(new Day(day.year, day.month, day.day))
        }}
        markedDates={{
          ...markedDates,
          [selectedDate.toString()]: {
            ...markedDates[selectedDate.toString()],
            selected: true,
            disableTouchEvent: true,
          },
        }}
        maxDate={today.toString()}
        minDate="2025-05-01"
      />
    </View>
  )
}

export default function Home() {
  // this only gets the size on the initial load, not on every render
  const { height } = useWindowDimensions()
  const bottomSnap = height * 0.67
  const topSnap = height * 0.5

  const [error, setError] = useState<string | null>(null)

  const [today] = useState(Day.ofDate(new Date()))
  const [selectedDate, setSelectedDate] = useState(today)

  const [gameDatesLoading, setGameDatesLoading] = useState(false)
  const [gameDates, setGameDates] = useState<Day[]>([])

  const selectedGameExists = useMemo(
    () =>
      gameDates.map((day) => day.toString()).includes(selectedDate.toString()),
    [selectedDate, gameDates]
  )

  const [playedAlready, setPlayedAlready] = useState<Day[]>([]) // TODO: necessary?
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
              dotColor: playedGamesSet.has(game.date) ? 'green' : undefined,
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

  return (
    <ImageBackground
      source={require('../assets/lighthouse.jpeg')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/40" />
      <ScrollView
        className="flex-1"
        snapToOffsets={[0, topSnap]}
        snapToEnd={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ height: bottomSnap }} />
        <View className="bg-white/0 rounded-t-3xl p-6">
          <View className="w-[90%] self-center flex flex-col gap-4">
            <Button
              onPress={
                selectedGameExists ? () => console.log('TODO: play') : undefined
              }
              title={
                gameDatesLoading
                  ? 'Loading...'
                  : selectedGameExists
                    ? selectedDate === today
                      ? 'Play'
                      : 'Play Selected'
                    : 'No Game'
              }
              variant="primary"
              size="xl"
              fullWidth
              icon={
                <Image
                  source={
                    selectedGameExists
                      ? require('../assets/play.png')
                      : require('../assets/clock.png')
                  }
                  className="w-9 h-9"
                />
              }
              baseOpacity={0.9}
              textClassName="font-bold"
            />

            <View className="flex flex-row gap-3 justify-between">
              <Button
                onPress={() => console.log('TODO: contribute')}
                title="Contribute"
                variant="secondary"
                size="lg"
                icon={
                  <Image
                    source={require('../assets/camera.png')}
                    className="w-6 h-6"
                  />
                }
                buttonClassName="flex-1"
                baseOpacity={0.95}
                textClassName="font-medium"
              />
              <Button
                onPress={() => console.log('TODO: stats')}
                title="Stats"
                variant="secondary"
                size="lg"
                icon={
                  <Image
                    source={require('../assets/stats.png')}
                    className="w-6 h-6"
                  />
                }
                buttonClassName="flex-1"
                baseOpacity={0.95}
                textClassName="font-medium"
              />
            </View>
          </View>

          <View className="mt-5 w-[90%] self-center bg-white p-4 rounded-xl border border-gray-200">
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
      </ScrollView>
    </ImageBackground>
  )
}
