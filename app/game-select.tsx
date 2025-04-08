import { useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { useRouter } from 'expo-router'

export default function GameSelect() {
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChallengeForOffset = async (offsetDays: number) => {
    const today = new Date()
    today.setDate(today.getDate() - offsetDays)
    const year = today.getFullYear()
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    const day = today.getDate().toString().padStart(2, '0')
    const dateString = `${year}-${month}-${day}`

    try {
      const response = await fetch(
        `http://ncsuguessr-backendelb-staging-576889603.us-east-1.elb.amazonaws.com/api/v1/games?date=${dateString}`
      )
      if (!response.ok) {
        throw new Error('API call failed')
      }
      const data = await response.json()
      console.log(`Data for offset ${offsetDays}:`, data)
      const gameId = data.games[0].id // ID returned by the API call
      router.navigate(`/api/v1/games/${gameId}`) // change the page
      // Navigate or process data accordingly
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error fetching challenge:', err)
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <ScreenView>
      <Text className="text-2xl pt-12 font-bold self-center">
        Game Selection
      </Text>
      <BackLink to="/" />

      <TouchableOpacity
        className="bg-[#CC0000] p-3 rounded-[10px] my-[10px] w-4/5 items-center self-center"
        onPress={() => handleChallengeForOffset(0)}
      >
        <Text className="text-white font-bold text-base">Daily Challenge</Text>
      </TouchableOpacity>
      <Text className="text-center mb-[10px]">
        Play today's daily game and explore new locations at NCSU!
      </Text>

      <Image
        source={{
          uri: 'https://sportslogohistory.com/wp-content/uploads/2018/09/north_carolina_state_wolfpack_2006-pres-a.png',
        }}
        className="w-[100px] h-[100px] my-[10px] self-center"
      />

      <Text className="text-xl font-bold mt-5 text-[#CC0000] self-center">
        Previous Challenges
      </Text>
      <TouchableOpacity
        className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center"
        onPress={() => handleChallengeForOffset(1)}
      >
        <Text className="text-white font-bold text-lg self-center">
          Yesterday
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center"
        onPress={() => handleChallengeForOffset(2)}
      >
        <Text className="text-white font-bold text-lg self-center">
          Two Days Ago
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center"
        onPress={() => handleChallengeForOffset(7)}
      >
        <Text className="text-white font-bold text-lg self-center">
          Three Days Ago
        </Text>
      </TouchableOpacity>
    </ScreenView>
  )
}
