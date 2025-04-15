import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { View, Image, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'

export default function GameFinished() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          'http://ncsuguessr-backendelb-staging-576889603.us-east-1.elb.amazonaws.com/api/v1/games/9'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch image')
        }
        const data = await response.json()
        setImageUrl(data.imageUrl)
      } catch (err) {
        setError('Failed to load image')
        console.error('Error fetching image:', err)
      }
    }

    fetchImage()
  }, [])

  return (
    <ScreenView className="items-center justify-center border-4">
      <Text className="text-2xl font-bold mb-4">Game Finished!</Text>

      {error ? (
        <Text className="text-red-500">{error}</Text>
      ) : imageUrl ? (
        <View className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-gray-300">
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      ) : (
        <Text>Loading image...</Text>
      )}

      <BackLink to="/" />
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
})
