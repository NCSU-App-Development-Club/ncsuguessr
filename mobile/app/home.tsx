import {
  Image,
  ImageBackground,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native'
import Text from '../components/global/Text'
import Button from '../components/global/Button'

export default function Home() {
  const { height } = useWindowDimensions()
  const bottomSnap = height * 0.67
  const topSnap = height * 0.2

  return (
    <ImageBackground
      source={require('../assets/lighthouse.jpeg')}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/40" />
      <ScrollView
        className="flex-1"
        snapToOffsets={[0, topSnap]}
        snapToEnd={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={{ height: bottomSnap }} />
        <View
          style={{ height: height * 0.5 }}
          className="bg-white/0 rounded-t-3xl p-6"
        >
          <View className="w-[90%] self-center flex flex-col gap-4">
            <Button
              onPress={() => console.log('TODO: play')}
              title="Play"
              variant="primary"
              size="xl"
              fullWidth
              icon={
                <Image
                  source={require('../assets/favicon.png')}
                  className="w-6 h-6"
                />
              }
              className="opacity-90"
            />

            <Button
              onPress={() => console.log('TODO: contribute')}
              title="Contribute"
              variant="secondary"
              size="xl"
              fullWidth
              icon={
                <Image
                  source={require('../assets/favicon.png')}
                  className="w-6 h-6"
                />
              }
              className="opacity-95"
            />
          </View>

          <View className="mt-6 w-[90%] self-center bg-white p-4 rounded-xl border border-gray-200">
            <Text className="text-xl font-bold mb-2">Dummy Card</Text>
            <Text className="text-md">
              This is some dummy content that appears when you swipe up on the
              homepage.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}
