import { ReactNode, useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { useRouter } from 'expo-router'
import { formatOffsetDate } from '../util/time'
import { Calendar, DateData } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'
import { getLocalPlayedGames } from '../util/storage/gamesStorage'
import { getGameDates } from '../util/api/games'

export default function GameSelect() {
  const [error, setError] = useState('')
  const router = useRouter()

  const [gameDatesLoading, setGameDatesLoading] = useState(false)
  const [gameDates, setGameDates] = useState<string[]>([])

  const [selectedDate, setSelectedDate] = useState(formatOffsetDate(0))
  const [playedAlready, setPlayedAlready] = useState<string[]>([])
  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  const today = useMemo(() => formatOffsetDate(0), [])

  const todayGameExists = useMemo(
    () => gameDates.includes(today),
    [today, gameDates]
  )

  const buttonText = !selectedDate
    ? 'Select a date'
    : playedAlready.includes(selectedDate)
      ? 'Game Already Played'
      : selectedDate === today && gameDates.includes(selectedDate)
        ? "Play Today's Game"
        : gameDates.includes(selectedDate)
          ? 'Play Selected Game'
          : 'No game for this date yet'

  useEffect(() => {
    const fetchGameDates = async () => {
      try {
        setGameDatesLoading(true)
        const gameDatesResponse = await getGameDates()
        const playedGames = await getLocalPlayedGames()

        setPlayedAlready(playedGames)

        if (!gameDatesResponse.success) {
          throw new Error(gameDatesResponse.error)
        }

        setGameDates(gameDatesResponse.games.map((game) => game.date))
        const toMark: MarkedDates = {}

        gameDatesResponse.games.forEach((game) => {
          toMark[game.date] = { marked: true }
        })

        playedGames.forEach((date) => {
          toMark[date] = {
            marked: true,
            dotColor: 'green',
          }
        })

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
    <ScreenView className="flex flex-col p-8">
      <BackLink to="/home" label="Home" />
      <Text className="text-5xl text-[#000000] font-bold self-center mt-12">
        Game Select
      </Text>
      <Image
        source={require('../assets/mrwuf.png')}
        className="w-[100px] h-[100px] mt-6 mb-2 self-center rounded-full border-solid border-2 border-[#CC0000]"
      />
      {gameDatesLoading ? (
        <View>
          <Text className="text-center">Loading games...</Text>
        </View>
      ) : error ? (
        <View>
          <Text className="text-center">Error: {error}</Text>
        </View>
      ) : (
        <View>
          <Text className="font-bold text-lg">Daily Games:</Text>
          <Calendar
            initialDate={today}
            disableAllTouchEventsForDisabledDays={true}
            theme={{
              selectedDayBackgroundColor: '#CC0000',
              dotColor: '#CC0000',
              arrowColor: '#CC0000',
            }}
            onDayPress={(day: DateData) => {
              setSelectedDate(day.dateString)
            }}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...markedDates[selectedDate],
                selected: true,
                disableTouchEvent: true,
              },
            }}
            maxDate={today}
            minDate="2025-05-01"
          />

          <GameButton
            disabled={
              !gameDates.includes(selectedDate) ||
              playedAlready.includes(selectedDate)
            }
            onPress={() => {
              router.navigate(`/games/${selectedDate}`)
            }}
          >
            {buttonText}
          </GameButton>
          {todayGameExists || (
            <Text className="my-4">
              *Today's game hasn't been posted yet, stay tuned!
            </Text>
          )}
        </View>
      )}
    </ScreenView>
  )
}

function GameButton({
  children,
  onPress,
  disabled,
}: {
  children: ReactNode
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <TouchableOpacity
      className={`${disabled ? 'bg-[#bbb]' : 'bg-[#CC0000]'} p-[15px] rounded-[30px] w-4/5 items-center my-4 self-center shadow-lg`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white font-bold text-lg self-center">
        {children}
      </Text>
    </TouchableOpacity>
  )
}
