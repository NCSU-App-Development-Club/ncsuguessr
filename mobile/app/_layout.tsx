import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import '../global.css'

export default function Layout() {
  return (
    <SafeAreaView className="bg-ncsuwhite flex-1">
      <Slot />
    </SafeAreaView>
  )
}
