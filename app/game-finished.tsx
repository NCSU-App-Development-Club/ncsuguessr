import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Link, useLocalSearchParams, router } from 'expo-router'
import { useState, useEffect } from 'react'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

// Conditionally import MapView
const MapView =
  Platform.OS === 'web' ? null : require('react-native-maps').default
const Marker =
  Platform.OS === 'web' ? null : require('react-native-maps').Marker
const Polyline =
  Platform.OS === 'web' ? null : require('react-native-maps').Polyline

export default function GameFinished() {
  // Get parameters from the previous screen if available
  const params = useLocalSearchParams()

  // Use the actual Bell Tower coordinates rather than generics
  const actualLocation = {
    latitude: 35.7857,
    longitude: -78.664,
  }

  // Get passed guess coordinates or use a default guess
  const userGuess = {
    latitude: 35.7747,
    longitude: -78.6908,
  }

  // Calculate distance in feet
  const distance = params.distance ? Number(params.distance) : 500
  const locationName = params.location || 'Belltower'
  const isWeb = Platform.OS === 'web'

  // Function to render Google Maps for web
  const renderGoogleMap = () => {
    return (
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6473.990173028917!2d-78.69079912749329!3d35.78470000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89acf583f5be2c4f%3A0x57cf469722e0c518!2sNC%20State%20Bell%20Tower!5e0!3m2!1sen!2sus!4v1716427532889!5m2!1sen!2sus"
        width={'100%'}
        height={'100%'}
        style={{ border: 0, borderRadius: 16 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }

  // Function to render native map
  const renderNativeMap = () => {
    if (isWeb || !MapView || !Marker || !Polyline) return null

    return (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: (userGuess.latitude + actualLocation.latitude) / 2,
          longitude: (userGuess.longitude + actualLocation.longitude) / 2,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* User's guess marker */}
        <Marker coordinate={userGuess} pinColor="blue">
          <View style={styles.markerContainer}>
            <MaterialIcons name="person-pin" size={30} color="#4285F4" />
          </View>
        </Marker>

        {/* Actual location marker with flag */}
        <Marker coordinate={actualLocation} pinColor="red">
          <View style={styles.markerContainer}>
            <MaterialIcons name="flag" size={30} color="#EA4335" />
          </View>
        </Marker>

        {/* Line connecting the points */}
        <Polyline
          coordinates={[userGuess, actualLocation]}
          strokeColor="black"
          strokeWidth={2}
          lineDashPattern={[5, 5]}
        />
      </MapView>
    )
  }

  // Share score function
  const handleShareScore = () => {
    // Implementation for sharing score would go here
    const shareText = `I was ${distance} feet away from finding the ${locationName} on NC State Guessr!`

    if (navigator && navigator.share) {
      navigator
        .share({
          title: 'My NC State Guessr Score',
          text: shareText,
        })
        .catch((err) => {
          console.error('Error sharing:', err)
        })
    } else {
      // Fallback for platforms without Web Share API
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText)
        alert('Score copied to clipboard!')
      }
    }
  }

  return (
    <ScreenView className="items-center justify-between py-10 px-5">
      <View className="w-full items-start">
        <Link href="/" asChild>
          <TouchableOpacity>
            <Text className="text-2xl font-bold underline">Home</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <Text className="text-4xl font-bold mb-10">Results</Text>

      <View className="w-full items-center justify-center mb-10">
        <Text className="text-2xl text-center mb-2">
          Your guess was{' '}
          <Text className="text-red-600 font-bold">{distance} feet</Text> from
          today's location:{' '}
          <Text className="text-red-600 font-bold">{locationName}</Text>
        </Text>
      </View>

      <TouchableOpacity
        className="bg-red-600 w-full py-4 rounded-full mb-6 flex-row justify-center items-center"
        onPress={handleShareScore}
      >
        <Text className="text-white text-2xl font-bold mr-2">Share Score</Text>
        <FontAwesome name="clipboard" size={24} color="white" />
      </TouchableOpacity>

      <View className="w-full aspect-square rounded-3xl overflow-hidden border-2 border-gray-300 mb-6">
        {isWeb ? renderGoogleMap() : renderNativeMap()}
      </View>

      <View className="w-full flex-row space-x-4 mb-6">
        <TouchableOpacity
          className="bg-red-600 flex-1 py-4 rounded-full"
          onPress={() => router.replace('/')}
        >
          <Text className="text-white text-xl font-bold text-center">
            Play More
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 flex-1 py-4 rounded-full"
          onPress={() => router.push('/stats')}
        >
          <Text className="text-white text-xl font-bold text-center">
            View Stats
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
