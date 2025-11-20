import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import '../global.css'

export default function Layout() {
  return (
    <SafeAreaView
      className="bg-ncsuwhite flex-1"
      edges={['top', 'left', 'right']}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
          contentStyle: {
            backgroundColor: 'white',
          },
        }}
      />
    </SafeAreaView>
  )
}
