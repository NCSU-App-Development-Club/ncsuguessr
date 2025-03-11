import { View, Text } from 'react-native'

interface Icon {
  icon: JSX.Element // Accepts an entire icon component
  title: string
  text: string
}

export default function StatBox({ icon, title, text }: Icon) {
  return (
    <View className="border border-[#CC0000] p-2 rounded-lg items-center w-full bg-[#FFFFFF] shadow-sm h-28 flex justify-center">
      {/* Icon */}
      <View className="mb-1">{icon}</View>

      {/* Title and Text */}
      <View className="items-center">
        <Text className="underlinetext-base font-bold text-[#000000] text-center">
          {title}
        </Text>
        <Text className="font-bold text-xs text-[#000000] text-center mt-1">
          {text}
        </Text>
      </View>
    </View>
  )
}
