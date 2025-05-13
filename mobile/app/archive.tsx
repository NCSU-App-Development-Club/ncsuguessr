import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import {
  addPlayedGame,
  GamesPlayedData,
  getPlayedGames,
  PlayedGame,
} from '../storage/gamesStorage'
import { useEffect, useMemo, useState } from 'react'
import { Calendar, DateData } from 'react-native-calendars'
import { MarkedDates } from 'react-native-calendars/src/types'
import { formatOffsetDate } from '../util/time'
import { View } from 'react-native'
import { GameFinishedMap } from './game-finished'

export default function Archive() {
  const [games, setGames] = useState<GamesPlayedData>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedGame, setSelectedGame] = useState<PlayedGame | undefined>(
    undefined
  )
  useEffect(() => {
    setSelectedGame(
      games.find((game) => {
        return selectedDate === game.date
      })
    )
  }, [selectedDate])
  const markedDates: MarkedDates = games.reduce((dates, game) => {
    dates[game.date] = { marked: true }
    return dates
  }, {} as MarkedDates)

  useEffect(() => {
    async function fetchGames() {
      const data = await getPlayedGames()
      setGames(data)
    }
    fetchGames()
  })

  const yesterday = useMemo(() => formatOffsetDate(1), [])

  return (
    <ScreenView className="flex-1 items-center flex-col p-8">
      <BackLink to="/" />

      <View className="h-max flex-1 justify-center">
        {selectedGame === undefined ? (
          <Text>Select a day to view statistics.</Text>
        ) : (
          <View>
            <GameFinishedMap
              gameDate={selectedDate}
              userGuess={{
                latitude: selectedGame.latGuess,
                longitude: selectedGame.longGuess,
              }}
            />
          </View>
        )}
      </View>
      <View className="h-max w-full h-100 justify-center">
        <Calendar
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
          maxDate={yesterday}
          minDate="2025-05-01"
        />
      </View>
    </ScreenView>
  )
}
