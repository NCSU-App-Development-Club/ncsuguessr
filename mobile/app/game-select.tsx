import { ReactNode, useEffect, useMemo, useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { useRouter } from 'expo-router'

import { formatOffsetDate } from '../util/time'
import { getGameDates } from '../util'

export default function GameSelect() {
  const [error, setError] = useState('')
  const router = useRouter()

  const [gameDatesLoading, setGameDatesLoading] = useState(false)
  const [gameDates, setGameDates] = useState<string[]>([])

  useEffect(() => {
    const fetchGameDates = async () => {
      try {
        setGameDatesLoading(true)
        const gameDatesResponse = await getGameDates()

        if (!gameDatesResponse.success) {
          throw new Error(gameDatesResponse.error)
        }

        setGameDates(gameDatesResponse.games.map((game) => game.date))
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

  const todayGameExists = useMemo(
    () => gameDates.includes(today),
    [today, gameDates]
  )

  return (
    <ScreenView className="justify-center">
      <Text className="text-5xl text-[#CC0000] font-bold self-center mb-5">
        Game Selection
      </Text>
      <BackLink to="/" />
      {gameDatesLoading ? (
        <View>
          <Text className="text-center">Loading...</Text>
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

          <Text className="text-center mb-[10px] font-bold mx-10 mt-4">
            Play today's daily game and explore new locations at NCSU!
          </Text>

          <Image
            source={require('../assets/mrwuf.png')}
            className="w-[100px] h-[100px] my-5 self-center rounded-full border-solid border-2 border-[#CC0000]"
          />
        </View>
      )}

      {/* <Text className="text-xl font-bold mt-4 mb-4 text-[#CC0000] self-center">
        Previous Challenges
      </Text>
      <GameButton onPress={() => {}}>Yesterday</GameButton>
      <GameButton onPress={() => {}}>Two Days Ago</GameButton>
      <GameButton onPress={() => {}}>Three Days Ago</GameButton> */}
    </ScreenView>
  )
}

function GameButton({
  children,
  onPress,
}: {
  children: ReactNode
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center shadow-lg"
      onPress={onPress}
    >
      <Text className="text-white font-bold text-lg self-center">
        {children}
      </Text>
    </TouchableOpacity>
  )
}
