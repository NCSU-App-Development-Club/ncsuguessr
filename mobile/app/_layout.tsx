import { Slot } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import '../global.css'

export default function Layout() {
  return (
    // TODO: edges={[]} makes stuff extend all the way to the top and bottom, not sure if we want that in the
    // long term
    <SafeAreaView className="bg-ncsuwhite flex-1" edges={[]}>
      <Slot />
    </SafeAreaView>
  )
}
