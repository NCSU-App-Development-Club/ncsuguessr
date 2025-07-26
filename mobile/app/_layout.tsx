import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native'
import '../global.css'

export default function Layout() {
  return (
    <SafeAreaView className="bg-ncsuwhite flex-1">
      <Slot />
    </SafeAreaView>
  )
}
