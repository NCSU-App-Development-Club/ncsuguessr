import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import BackLink from '../components/global/BackLink'
import ScreenView from '../components/global/ScreenView'
import LineGraph from '../components/stats/LineGraph'
import StatBox from '../components/stats/StatBox'
import { formatSecondsToMMSS, lastNDays } from '../util/time'
import { StatsData, StatsLocalStore } from '../util/storage/stats'
import Button from '../components/global/Button'

export default function Stats() {
  const [graphData, setGraphData] = useState<number[]>([])
  const [graphLabels, setGraphLabels] = useState<string[]>([])

  const [statsState, setStatsState] = useState<StatsData | null>(null)

  // fetches stats from local device storage on initialization
  useEffect(() => {
    const buildDailyGraphData = (stats: StatsData): number[] =>
      lastNDays(7).map((day) => {
        const dateKey = day.toISOString().split('T')[0]
        return stats.dailyGames ? stats.dailyGames[dateKey] || 0 : 0
      })

    const buildDailyGraphLabels = (): string[] =>
      lastNDays(7).map((day) =>
        day.toLocaleDateString('en-US', { weekday: 'short' })
      )

    const fetchStats = async () => {
      const stats = await StatsLocalStore.getStats()

      const labels = buildDailyGraphLabels()
      const data = stats
        ? (setStatsState(stats), buildDailyGraphData(stats))
        : Array(7).fill(0)

      setGraphData(data)
      setGraphLabels(labels)
    }

    fetchStats()
  }, [])

  const handleResetStats = async () => {
    await StatsLocalStore.resetStats()
    setStatsState(null)
    console.log('Stats cleared')
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
        <BackLink to="/home" label="Home" />
        <View className="mb-5 mt-14">
          <Text className="text-4xl font-bold text-[#000000] text-center">
            Statistics
          </Text>
        </View>

        <View className="flex flex-row flex-wrap justify-between w-full">
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="map" size={28} color="#CC0000" />}
              title="Games Played"
              text={
                statsState && statsState.gamesPlayed !== null
                  ? `${statsState.gamesPlayed} Games`
                  : '0 Games'
              }
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
                statsState?.totalGuessDistance && statsState?.gamesPlayed
                  ? `${statsState.totalGuessDistance.divide(statsState.gamesPlayed).toKilometers().toFixed(2)} km`
                  : '0 km'
              }
            />
          </View>
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
              title="Best Overall Guess"
              text={
                statsState && statsState.bestOverallGuess
                  ? `${statsState.bestOverallGuess.location}: ${statsState.bestOverallGuess.distance.toKilometers().toFixed(2)} km`
                  : 'None yet'
              }
            />
          </View>
          {/* TODO: replace this with something, perhaps best of last 10 days */}
          {/* <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
              title="Best Weekly Guess"
              text={
                statsState && statsState.bestWeeklyGuess
                  ? `${statsState.bestWeeklyGuess.location}: ${statsState.bestWeeklyGuess.distance.toFixed(2)} km`
                  : 'None this week'
              }
            />
          </View> */}
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="fire" size={28} color="#CC0000" />}
              title="Play Streak"
              text={
                statsState && statsState.playStreak
                  ? `${statsState.playStreak.current} Day${statsState.playStreak.current !== 1 ? 's' : ''}`
                  : '0 Days'
              }
            />
          </View>
          <View className="w-1/2 p-2">
            <StatBox
              icon={<SimpleLineIcons name="clock" size={28} color="#CC0000" />}
              title="Average Time"
              text={
                statsState?.totalGuessTime && statsState?.gamesPlayed
                  ? formatSecondsToMMSS(
                      statsState.totalGuessTime
                        .divide(statsState.gamesPlayed)
                        .toSeconds()
                    )
                  : '0:00'
              }
            />
          </View>
        </View>

        {/* TODO: is this graph really relevant? maybe cumulative games played instead */}
        <View className="items-center mt-8 w-full">
          <Text className="text-2xl font-bold mb-4 text-center">
            Daily Games Played
          </Text>
          <LineGraph
            data={graphData}
            width={350}
            height={200}
            unit="games"
            labels={graphLabels}
          />
        </View>

        <View className="mt-8 items-center">
          <Button
            onPress={showResetConfirmation}
            title="Reset All Statistic"
            size="lg"
            variant="primary"
            icon={<SimpleLineIcons name="trash" size={20} color="white" />}
          />
        </View>
      </ScrollView>
    </ScreenView>
  )
}
