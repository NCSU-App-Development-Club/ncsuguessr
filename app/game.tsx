import Text from '../components/global/Text'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import { View, Image, TouchableOpacity, Pressable, Modal, Dimensions } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useState } from 'react'

export default function Game() {
  const [expandedImage, setExpandedImage] = useState<string | null>(null)

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text>Where is this?</Text>
      
      <TouchableOpacity onPress={() => setExpandedImage('map')}>
        <View className="relative p-2">
          <View className="overflow-hidden rounded-2xl">
            <MapView
              style={{ width: 300, height: 200 }}
              initialRegion={{
                latitude: 35.7847,  // NC State's approximate coordinates
                longitude: -78.6821,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 35.7847,
                  longitude: -78.6821,
                }}
              />
            </MapView>
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
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)' }}
          activeOpacity={1}
          onPress={() => setExpandedImage(null)}
        >
          {expandedImage === 'map' ? (
            <MapView
              style={{ width: '100%', height: '100%' }}
              initialRegion={{
                latitude: 35.7847,
                longitude: -78.6821,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 35.7847,
                  longitude: -78.6821,
                }}
              />
            </MapView>
          ) : (
            <Image 
              source={require('../assets/belltower.png')}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />
          )}
        </TouchableOpacity>
      </Modal>

      <TouchableOpacity onPress={() => {}}>
        <View className="rounded bg-ncsured w-52 p-1.5 m-1.5 text-center text-white font-bold flex flex-row justify-center items-center">           
          <Pressable>
            <Text className="text-white font-bold text-center">Submit</Text>
          </Pressable>
        </View> 
      </TouchableOpacity>
    </View>
  )
}
