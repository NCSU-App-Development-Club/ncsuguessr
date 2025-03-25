import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'

export default function GameSelect() {
  return (
    <ScreenView>
      <Text className="text-2xl pt-12 font-bold self-center">
        Game Selection
      </Text>
      <BackLink to="/" />

      <TouchableOpacity className="bg-[#CC0000] p-3 rounded-[10px] my-[10px] w-4/5 items-center self-center">
        <Text className="text-white font-bold text-base">Daily Challenge</Text>
      </TouchableOpacity>
      <Text className="text-center mb-[10px]">
        Play today's daily game and explore new locations at NCSU!
      </Text>

      <Image
        source={{
          uri: 'https://sportslogohistory.com/wp-content/uploads/2018/09/north_carolina_state_wolfpack_2006-pres-a.png',
        }}
        className="w-[100px] h-[100px] my-[10px] self-center"
      />

      <TouchableOpacity className="bg-[#CC0000] p-3 rounded-[10px] my-[10px] w-4/5 items-center self-center">
        <Text className="text-white font-bold text-base">
          Previous Challenges
        </Text>
      </TouchableOpacity>
      <Text className="text-center mb-[10px]">
        View and play games from previous dates!
      </Text>

      <Text className="text-xl font-bold mt-5 text-[#CC0000] self-center">
        Previous Challenges
      </Text>
      <TouchableOpacity className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center">
        <Text className="text-white font-bold text-lg self-center">
          Yesterday
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center">
        <Text className="text-white font-bold text-lg self-center">
          Two Days Ago
        </Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-[#CC0000] p-[15px] rounded-[30px] w-4/5 items-center my-[5px] self-center">
        <Text className="text-white font-bold text-lg self-center">
          Three Days Ago
        </Text>
      </TouchableOpacity>
    </ScreenView>
  )
}
