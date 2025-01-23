import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native'

// Import your global CSS file
import '../global.css'

export default function Layout() {
  return (
    <SafeAreaView className="bg-ncsuwhite">
      <Slot />
    </SafeAreaView>
  )
}
