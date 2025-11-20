import { Router } from 'expo-router'
import { useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Text from '../global/Text'

export const TabBar = ({ router }: { router: Router }) => {
  const [activeTab, setActiveTab] = useState('play')

  return (
    <View className="bg-white border-t border-gray-200">
      <View className="flex-row justify-around items-center pt-3 px-6">
        <TouchableOpacity
          onPress={() => {
            router.push('/stats')
            setActiveTab('stats')
          }}
          className="flex-1 items-center py-2"
        >
          <Image
            source={require('../../assets/stats.png')}
            className="w-8 h-8"
            style={{ opacity: activeTab === 'stats' ? 1 : 0.4 }}
          />
          <Text
            className="text-xs mt-1"
            style={{ color: activeTab === 'stats' ? '#CC0000' : '#9CA3AF' }}
          >
            Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push('/home')
            setActiveTab('play')
          }}
          className="flex-1 items-center py-2"
        >
          <Image
            source={require('../../assets/play-red.png')}
            className="w-8 h-8"
            style={{ opacity: activeTab === 'play' ? 1 : 0.4 }}
          />
          <Text
            className="text-xs mt-1"
            style={{ color: activeTab === 'play' ? '#CC0000' : '#9CA3AF' }}
          >
            Play
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.push('/contribute')
            setActiveTab('contribute')
          }}
          className="flex-1 items-center py-2"
        >
          <Image
            source={require('../../assets/camera.png')}
            className="w-8 h-8"
            style={{ opacity: activeTab === 'contribute' ? 1 : 0.4 }}
          />
          <Text
            className="text-xs mt-1"
            style={{
              color: activeTab === 'contribute' ? '#CC0000' : '#9CA3AF',
            }}
          >
            Contribute
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
