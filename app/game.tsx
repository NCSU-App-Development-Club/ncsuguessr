import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import {
  View,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Dimensions,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native'

// Conditionally import MapView
const MapView =
  Platform.OS === 'web' ? null : require('react-native-maps').default
const Marker =
  Platform.OS === 'web' ? null : require('react-native-maps').Marker

import { useState } from 'react'

export default function Game() {
  const [expandedImage, setExpandedImage] = useState<string | null>(null)
  const [guessMarker, setGuessMarker] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [guessCount, setGuessCount] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const isWeb = Platform.OS === 'web'

  // Mock correct location (NC State Bell Tower)
  const correctLocation = {
    latitude: 35.7857,
    longitude: -78.664,
  }

  const calculateDistance = (guess: typeof correctLocation) => {
    // Simple distance calculation (you could use a more accurate formula)
    const latDiff = Math.abs(guess.latitude - correctLocation.latitude)
    const lonDiff = Math.abs(guess.longitude - correctLocation.longitude)
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111 // Rough conversion to kilometers
  }

  const handleMapPress = (event: any) => {
    if (gameOver) return
    const coords = isWeb
      ? { latitude: event.latLng.lat(), longitude: event.latLng.lng() }
      : event.nativeEvent.coordinate
    setGuessMarker(coords)
  }

  const handleGuess = () => {
    if (!guessMarker || gameOver) return

    const distance = calculateDistance(guessMarker)
    const remainingGuesses = 3 - (guessCount + 1)

    if (distance < 0.1) {
      // Within ~100 meters
      Alert.alert('Congratulations!', 'You found the correct location!')
      setGameOver(true)
    } else if (guessCount >= 2) {
      Alert.alert(
        'Game Over',
        `You're out of guesses! The location was ${correctLocation.latitude.toFixed(4)}, ${correctLocation.longitude.toFixed(4)}`
      )
      setGameOver(true)
    } else {
      Alert.alert(
        'Try Again',
        `You're about ${distance.toFixed(2)}km away. ${remainingGuesses} ${remainingGuesses === 1 ? 'guess' : 'guesses'} remaining.`
      )
      setGuessCount((prev) => prev + 1)
    }
  }

  // Function to render Google Maps iframe for web
  const renderGoogleMap = (width: string | number, height: string | number) => {
    return (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3236.9950865144584!2d-78.68429492427866!3d35.78469997258063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89acf5a2e3c3b38f%3A0xbc19fe1c5a8312ef!2sNorth%20Carolina%20State%20University!5e0!3m2!1sen!2sus!4v1716414060646!5m2!1sen!2sus"
        width={width}
        height={height}
        style={{ border: 0, borderRadius: isWeb ? '16px' : undefined }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }

  // Function to render native map for mobile
  const renderNativeMap = (smallMap: boolean) => {
    if (isWeb || !MapView || !Marker) return null

    const mapStyle = smallMap ? styles.smallMap : styles.fullMap

    return (
      <MapView
        style={mapStyle}
        initialRegion={{
          latitude: 35.7847,
          longitude: -78.6821,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {guessMarker && <Marker coordinate={guessMarker} pinColor="blue" />}
        {gameOver && <Marker coordinate={correctLocation} pinColor="green" />}
      </MapView>
    )
  }

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Find the NC State Bell Tower!</Text>
      <Text className="mb-2 text-gray-500">
        Guesses remaining: {3 - guessCount}
      </Text>

      <TouchableOpacity onPress={() => setExpandedImage('map')}>
        <View className="relative p-2">
          <View className="overflow-hidden rounded-2xl">
            {isWeb ? renderGoogleMap(300, 200) : renderNativeMap(true)}
          </View>
          <View className="absolute top-4 right-4 bg-black/90 rounded-full w-14 h-14 items-center justify-center">
            <Text className="text-black-200/90 text-4xl font-bold">+</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setExpandedImage('belltower')}>
        <View className="relative p-2">
          <View className="overflow-hidden rounded-2xl">
            <Image
              source={require('../assets/belltower.png')}
              style={{ width: 300, height: 200 }}
            />
          </View>
          <View className="absolute top-4 right-4 bg-black/90 rounded-full w-14 h-14 items-center justify-center">
            <Text className="text-black-200/90 text-4xl font-bold">+</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={expandedImage !== null} transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}>
          {/* Modal content */}
          <View style={{ flex: 1 }}>
            {expandedImage === 'map' ? (
              isWeb ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {renderGoogleMap('90%', '90%')}
                </View>
              ) : (
                renderNativeMap(false)
              )
            ) : (
              <TouchableOpacity
                style={{ flex: 1, width: '100%' }}
                activeOpacity={1}
                onPress={() => setExpandedImage(null)}
              >
                <Image
                  source={require('../assets/belltower.png')}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Bottom close button */}
          {expandedImage === 'map' && (
            <View
              style={{
                position: 'absolute',
                bottom: 40,
                left: 0,
                right: 0,
                alignItems: 'center',
                zIndex: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => setExpandedImage(null)}
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 30,
                }}
              >
                <Text className="text-white text-base font-bold">
                  Close Map
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <TouchableOpacity
        onPress={handleGuess}
        disabled={!guessMarker || gameOver}
      >
        <View
          className={`rounded w-52 p-1.5 m-1.5 text-center font-bold flex flex-row justify-center items-center ${!guessMarker || gameOver ? 'bg-gray-400' : 'bg-ncsured'}`}
        >
          <Text className="text-white font-bold text-center">
            {gameOver
              ? 'Game Over'
              : guessMarker
                ? 'Submit Guess'
                : 'Drop a pin first'}
          </Text>
        </View>
      </TouchableOpacity>

      {gameOver && (
        <TouchableOpacity
          onPress={() => {
            setGuessCount(0)
            setGuessMarker(null)
            setGameOver(false)
          }}
        >
          <View className="rounded bg-blue-500 w-52 p-1.5 m-1.5 text-center font-bold flex flex-row justify-center items-center">
            <Text className="text-white font-bold text-center">Play Again</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  smallMap: {
    width: 300,
    height: 200,
  },
  fullMap: {
    width: '100%',
    height: '100%',
  },
})
