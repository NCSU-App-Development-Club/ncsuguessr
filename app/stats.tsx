import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import StatBox from '../components/team-3/StatBox'
import LineGraph from '../components/team-3/LineGraph'
import { View, Text } from 'react-native'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'

export default function Stats() {
  // Dummy data for average guess distance over the past week (in feet)
  const dummyData = [15, 20, 18, 22, 25, 19, 17] // Average guess distance for each day of the week

  return (
    <ScreenView className="flex-1 items-center justify-start p-6">
      {/* Title */}
      <View className="mb-5 mt-14">
        <Text className="text-5xl font-bold text-[#000000] tracking-widest">
          STATISTICS
        </Text>
      </View>

      {/* Stat Boxes */}
      <View className="flex flex-row flex-wrap justify-between w-full">
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="map" size={28} color="#CC0000" />}
            title="30 Games"
            text="Games Played"
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={
              <SimpleLineIcons name="location-pin" size={28} color="#CC0000" />
            }
            title="176 ft."
            text="Average Distance"
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
            title="Talley Market: 2 ft."
            text="Best Overall Guess"
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
            title="Brickyard: 5 ft."
            text="Best Weekly Guess"
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="fire" size={28} color="#CC0000" />}
            title="7 Days"
            text="Challenge Streak"
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="clock" size={28} color="#CC0000" />}
            title="2:23"
            text="Average Time"
          />
        </View>
      </View>

      {/* Line Graph */}
      <View className="mt-8 w-full">
        <Text className="text-3xl font-bold mb-2">Average Daily Distances</Text>
        <LineGraph data={dummyData} width={350} height={200} />
      </View>

      {/* Back Link */}
      <BackLink to="/home" />
    </ScreenView>
  )
}
