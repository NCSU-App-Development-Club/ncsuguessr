import { View } from 'react-native'
import Text from '../global/Text'
import { JSX } from 'react'

interface Icon {
  icon: JSX.Element // Accepts an entire icon component
  title: string
  text: string
}

export default function StatBox({ icon, title, text }: Icon) {
  return (
    <View className="border border-[#CC0000] p-2 rounded-lg items-center w-full bg-[#FFFFFF] shadow-sm h-28 flex justify-center">
      <View className="mb-1">{icon}</View>
      <View className="items-center">
        <Text className="underlinetext-base font-bold text-xl text-[#000000] text-center">
          {text}
        </Text>
        <Text className="text-xs text-[#000000] text-center mt-1">{title}</Text>
      </View>
    </View>
  )
}
