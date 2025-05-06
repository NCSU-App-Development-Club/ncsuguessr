import { ImageBackground, View, TouchableOpacity, Image } from 'react-native'
import { useRouter } from 'expo-router'
import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'

export default function Home() {
  const router = useRouter()

  return (
    <ScreenView className="flex flex-col items-center justify-center gap-6">
      {/* <ImageBackground
        source={require('../assets/wolf.png')}
        resizeMode="cover"
        className="flex-1 w-full h-full"
      > */}
      {/* Header with red background behind text */}
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
      ></Image>

      {/* Center Buttons */}
      {/* <View className="flex-1 justify-end items-center pb-32"> */}
      <TouchableOpacity
        onPress={() => router.push('/game-select')}
        className="bg-ncsured w-60 py-4 rounded-full items-center"
      >
        <Text className="text-white text-xl font-bold">Start Game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/stats')}
        className="bg-ncsured w-60 py-4 rounded-full items-center"
      >
        <Text className="text-white text-xl font-bold">Stats</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity 
            onPress={() => router.push('/contribute')}
            className="bg-ncsured px-12 py-4 rounded-full shadow-xl mb-8"
          >
            <Text className="text-white text-xl font-bold">How to play?</Text>
          </TouchableOpacity> */}
      {/* </View> */}

      {/* Optional back link */}
      <BackLink to="/" />
      {/* </ImageBackground> */}
    </ScreenView>
  )
}
