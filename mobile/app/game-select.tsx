import { ReactNode, useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { useRouter } from 'expo-router'

import { formatOffsetDate } from '../util/time'
import { getGameDates } from '../util'

import {
  Calendar,
  CalendarList,
  Agenda,
  DateData,
} from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'
import { opacity } from 'react-native-reanimated/lib/typescript/Colors'

export default function GameSelect() {
  const [error, setError] = useState('')
  const router = useRouter()

  const [gameDatesLoading, setGameDatesLoading] = useState(false)
  const [gameDates, setGameDates] = useState<string[]>([])

  const [selectedDate, setSelectedDate] = useState('')
  const [markedDates, setMarkedDates] = useState<MarkedDates>({})

  useEffect(() => {
    const fetchGameDates = async () => {
      try {
        setGameDatesLoading(true)
        const gameDatesResponse = await getGameDates()

        if (!gameDatesResponse.success) {
          throw new Error(gameDatesResponse.error)
        }

        setGameDates(gameDatesResponse.games.map((game) => game.date))
        const toMark: MarkedDates = {}
        gameDatesResponse.games.forEach((game) => {
          toMark[game.date] = { marked: true }
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

  const today = useMemo(() => formatOffsetDate(0), [])
  const yesterday = useMemo(() => formatOffsetDate(1), [])

  const todayGameExists = useMemo(
    () => gameDates.includes(today),
    [today, gameDates]
  )

  return (
    <ScreenView className="flex flex-col p-8">
      <BackLink to="/" />
      <Text className="text-5xl text-[#CC0000] font-bold self-center mt-8">
        Game Selection
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
          {todayGameExists ? (
            <GameButton
              onPress={() => {
                router.navigate(`/games/${today}`)
              }}
            >
              Today's Game
            </GameButton>
          ) : (
            <Text>Today's game hasn't been posted yet, stay tuned!</Text>
          )}

          <Text className="font-bold">Previous Games:</Text>
          <Calendar
            onDayPress={(day: DateData) => {
              setSelectedDate(day.dateString)
            }}
            markedDates={{
              ...markedDates,
              [selectedDate]: {
                ...markedDates[selectedDate],
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange',
              },
              [today]: {
                ...markedDates[today],
                disableTouchEvent: true,
                disabled: true,
              },
            }}
            maxDate={yesterday}
            minDate="2025-05-01"
          />
          <GameButton
            disabled={!gameDates.includes(selectedDate)}
            onPress={() => {
              router.navigate(`/games/${selectedDate}`)
            }}
          >
            {gameDates.includes(selectedDate)
              ? 'Play Selected Game'
              : 'No game for this date.'}
          </GameButton>
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
