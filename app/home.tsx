import { ImageBackground, View, TouchableOpacity, Linking } from 'react-native';
import Text from '../components/global/Text';
import ScreenView from '../components/global/ScreenView';
import BackLink from '../components/global/BackLink';

export default function Home() {
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
            <Text className="text-white text-3xl font-bold">NCSU GUESSER</Text>
          </View>
        </View>

        {/* Center Buttons */}
        <View className="flex-1 justify-end items-center pb-32">
          <TouchableOpacity 
            className="bg-ncsured px-12 py-4 rounded-full shadow-xl mb-8"
          >
            <Text className="text-white text-xl font-bold">Start Game</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/contribute')}>
            <Text className="text-white text-lg">Contribute to NCSUGuesser!</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL('https://example.com/how-to-play')}>
            <Text className="text-white text-lg mt-3">How to play?</Text>
          </TouchableOpacity>
        </View>

        {/* Optional back link */}
        <View className="items-center pb-4">
          <BackLink to="/" />
        </View>
      </ImageBackground>
    </ScreenView>
  );
}