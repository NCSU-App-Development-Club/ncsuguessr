import { ReactNode, useState } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { useRouter } from 'expo-router'

import { formatOffsetDate } from '../util/time'

export default function GameSelect() {
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChallengeForOffset = async (offsetDays: number) => {
    const dateString = formatOffsetDate(offsetDays)

    try {
      const response = await fetch(
        `https://ncsuguessr-api-staging.ncsuappdevelopmentclub.workers.dev/games/${dateString}`
      )
      if (!response.ok) {
        throw new Error('API call failed')
      }
      const data = await response.json()
      router.navigate(`/games/${dateString}`)
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
    <ScreenView className="justify-center">
      <Text className="text-5xl text-[#CC0000] font-bold self-center mb-5">
        Game Selection
      </Text>
      <BackLink to="/" />
      <GameButton cb={() => handleChallengeForOffset(0)}>
        Today's Challenge
      </GameButton>

      <Text className="text-center mb-[10px] font-bold mx-10 mt-4">
        Play today's daily game and explore new locations at NCSU!
      </Text>

      <Image
        source={require('../assets/mrwuf.png')}
        className="w-[100px] h-[100px] my-5 self-center rounded-full border-solid border-2 border-[#CC0000]"
      />

      <Text className="text-xl font-bold mt-4 mb-4 text-[#CC0000] self-center">
        Previous Challenges
      </Text>
      <GameButton cb={() => handleChallengeForOffset(1)}>Yesterday</GameButton>
      <GameButton cb={() => handleChallengeForOffset(2)}>
        Two Days Ago
      </GameButton>
      <GameButton cb={() => handleChallengeForOffset(3)}>
        Three Days Ago
      </GameButton>
    </ScreenView>
  )
}

function GameButton({ children, cb }: { children: ReactNode; cb: () => void }) {
  return (
    <TouchableOpacity
      className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center shadow-lg"
      onPress={cb}
    >
      <Text className="text-white font-bold text-lg self-center">
        {children}
      </Text>
    </TouchableOpacity>
  )
}
