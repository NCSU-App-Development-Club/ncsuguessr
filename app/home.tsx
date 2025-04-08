import { ImageBackground, View, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import Text from '../components/global/Text';
import ScreenView from '../components/global/ScreenView';
import BackLink from '../components/global/BackLink';

export default function Home() {
  const router = useRouter();

  return (
    <ScreenView className="flex-1">
      <ImageBackground
        source={require('../assets/home_screen_background.png')}
        resizeMode="cover"
        className="flex-1 w-full h-full"
      >
        {/* Header with red background behind text */}
        <View className="absolute top-0 left-0 right-0 w-full">
          <View className="bg-ncsured w-full h-24 flex items-center justify-center">
            <Text className="text-white text-3xl font-bold">NCSU GUESSR</Text>
          </View>
        </View>

        {/* Center Buttons */}
        <View className="flex-1 justify-end items-center pb-32">
          <TouchableOpacity
            onPress={() => router.push('/game-select')}
            className="bg-ncsured w-60 py-4 rounded-full shadow-xl mb-8 items-center"
          >
            <Text className="text-white text-xl font-bold">Start Game</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/contribute')}
            className="bg-ncsured w-60 py-4 rounded-full shadow-xl mb-8 items-center"
          >
            <Text className="text-white text-xl font-bold">Contribute</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity 
            onPress={() => router.push('/contribute')}
            className="bg-ncsured px-12 py-4 rounded-full shadow-xl mb-8"
          >
            <Text className="text-white text-xl font-bold">How to play?</Text>
          </TouchableOpacity> */}
        </View>

        {/* Optional back link */}
        <View className="items-center pb-4">
          <BackLink to="/" />
        </View>
      </ImageBackground>
    </ScreenView>
  );
}
