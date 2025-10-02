import { View, Image } from 'react-native'
import { useRouter } from 'expo-router'
import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import Button from '../components/global/Button'

export default function Home() {
  const router = useRouter()

  return (
    <ScreenView className="flex flex-col items-center justify-center gap-6">
      <View className="w-full">
        <View className="w-full h-24 flex items-center justify-center">
          <Text className="text-[#c00] text-5xl font-bold mb-3">
            NCSUGuessr
          </Text>
          <Text className="text-md font-bold">
            By NCSU App Development Club
          </Text>
        </View>
      </View>

      <Image
        className="w-[25vh] h-[27vh]"
        source={require('../assets/wolf.png')}
      />

      <View className="w-64 flex flex-col gap-3">
        <Button
          onPress={() => router.push('/games/select')}
          title="Play"
          size="lg"
          fullWidth
          icon={
            <Image
              source={require('../assets/favicon.png')}
              className="w-6 h-6"
            />
          }
        />

        <Button
          onPress={() => router.push('/stats')}
          title="Stats"
          size="lg"
          fullWidth
          variant="secondary"
        />
      </View>

      {__DEV__ && <BackLink to="/" />}
    </ScreenView>
  )
}
