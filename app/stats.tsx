import {
  ScrollView,
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import StatBox from '../components/team-3/StatBox'
import LineGraph from '../components/team-3/LineGraph'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { useEffect, useState } from 'react'
import { getStats } from '../storage/statsStorage'
import { incrementGamesPlayed } from '../storage/statsStorage' // adjust path as needed
import { recordGuess } from '../storage/statsStorage' // adjust path as needed
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Stats() {
  const dummyData = [15, 20, 18, 22, 25, 19, 17]

  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null)
  const [averageGuessDistance, setAverageGuessDistance] = useState<
    number | null
  >(null)
  const [bestOverallGuess, setBestOverallGuess] = useState<{
    distance: number
    location: string
  } | null>(null)
  const [bestWeeklyGuess, setBestWeeklyGuess] = useState<{
    distance: number
    location: string
    weekOf: string
  } | null>(null)

  const [playStreak, setPlayStreak] = useState<{
    current: number
    lastPlayed: string
  } | null>(null)
  const [averageGuessTime, setAverageGuessTime] = useState<number | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getStats()
      if (stats) {
        setGamesPlayed(stats.gamesPlayed)
        setAverageGuessDistance(stats.averageGuessDistance)
        setBestOverallGuess(stats.bestOverallGuess)
        setBestWeeklyGuess(stats.bestWeeklyGuess)
        setPlayStreak(stats.playStreak)
        setAverageGuessTime(stats.averageGuessTime)
      }
    }

    fetchStats()
  }, [])

  const handleTestIncrement = async () => {
    await incrementGamesPlayed()
    const stats = await getStats()
    if (stats) {
      setGamesPlayed(stats.gamesPlayed)
      setPlayStreak(stats.playStreak) // ✅ include this for full refresh
    }
  }

  const handleResetStats = async () => {
    await AsyncStorage.removeItem('@myapp:stats')
    setGamesPlayed(null)
    setAverageGuessDistance(null)
    setBestOverallGuess(null)
    setBestWeeklyGuess(null)
    setPlayStreak(null)
    setAverageGuessTime(null)
    console.log('Stats cleared')
  }

  const handleTestRecordGuess = async () => {
    const today = new Date().toISOString().split('T')[0]
    await recordGuess(0.12, 'Talley', '2025-04-08', 52)
    const stats = await getStats()
    if (stats) {
      setGamesPlayed(stats.gamesPlayed)
      setAverageGuessDistance(stats.averageGuessDistance)
      setBestOverallGuess(stats.bestOverallGuess)
      setBestWeeklyGuess(stats.bestWeeklyGuess)
      setPlayStreak(stats.playStreak)
      setAverageGuessTime(stats.averageGuessTime)
    }
  }

  const formatSecondsToMMSS = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const showResetConfirmation = () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all your game statistics? This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: handleResetStats,
        },
      ]
    )
  }

  return (
    <ScreenView className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Title */}
        <View className="mb-8 mt-14">
          <Text className="text-5xl font-bold text-[#000000] text-center">
            STATISTICS
          </Text>
        </View>

        {/* Stat Boxes */}
        <View className="flex flex-row flex-wrap justify-between w-full">
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="map" size={28} color="#CC0000" />}
              title="Games Played"
              text={gamesPlayed !== null ? `${gamesPlayed} Games` : '0 Games'}
            />
          </View>
          <View className="w-1/2 p-2">
            <StatBox
              icon={
                <SimpleLineIcons
                  name="location-pin"
                  size={28}
                  color="#CC0000"
                />
              }
              title="Average Distance"
              text={
                averageGuessDistance !== null
                  ? `${averageGuessDistance.toFixed(2)} mi.`
                  : '0 mi'
              }
            />
          </View>
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
              title="Best Overall Guess"
              text={
                bestOverallGuess
                  ? `${bestOverallGuess.location}: ${bestOverallGuess.distance.toFixed(2)} mi.`
                  : 'None yet'
              }
            />
          </View>
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
              title="Best Weekly Guess"
              text={
                bestWeeklyGuess
                  ? `${bestWeeklyGuess.location}: ${bestWeeklyGuess.distance.toFixed(2)} mi.`
                  : 'None this week'
              }
            />
          </View>
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="fire" size={28} color="#CC0000" />}
              title="Play Streak"
              text={
                playStreak
                  ? `${playStreak.current} Day${playStreak.current !== 1 ? 's' : ''}`
                  : '0 Days'
              }
            />
          </View>
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="clock" size={28} color="#CC0000" />}
              title="Average Time"
              text={
                averageGuessTime !== null
                  ? formatSecondsToMMSS(averageGuessTime)
                  : '0:00'
              }
            />
          </View>
        </View>

        {/* Line Graph */}
        <View className="items-center mt-8 w-full">
          <Text className="text-2xl font-bold mb-4 text-center">
            Average Daily Distances
          </Text>
          <LineGraph data={dummyData} width={350} height={200} />
        </View>

        {/* 🔧 TEST BUTTON */}
        {/* <View className="mt-4 items-center">
          <Button
            title="Test Increment Games Played"
            onPress={handleTestIncrement}
          />
        </View>
        <View className="mt-4 items-center">
          <Button
            title="Test Record Guess"
            onPress={handleTestRecordGuess}
            color="#007aff"
          />
        </View> */}

        {/* Styled Reset Stats Button */}
        <View className="mt-8 items-center">
          <TouchableOpacity
            onPress={showResetConfirmation}
            className="bg-red-500 px-6 py-3 rounded-lg shadow-md active:bg-red-600"
          >
            <View className="flex-row items-center">
              <SimpleLineIcons name="trash" size={20} color="red" />
              <Text className="font-bold ml-2 text-lg">
                Reset All Statistics
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Back Link */}
        <BackLink to="/home" />
      </ScrollView>
    </ScreenView>
  )
}
