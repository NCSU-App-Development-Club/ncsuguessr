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
            title="Games Played"
            text="30 Games"
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={
              <SimpleLineIcons name="location-pin" size={28} color="#CC0000" />
            }
            title="Average Distance"
            text="30.23 mi."
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
            title="Best Overall Guess"
            text="NCSU Waterfountain: 2 ft."
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="target" size={28} color="#CC0000" />}
            title="Best Weekly Guess"
            text="Brickyard: 5 ft."
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="fire" size={28} color="#CC0000" />}
            title="Challenge Streak"
            text="7 Days"
          />
        </View>
        <View className="w-1/2 p-2">
          <StatBox
            icon={<SimpleLineIcons name="clock" size={28} color="#CC0000" />}
            title="Average Time"
            text="2:23"
          />
        </View>
      </View>

      {/* Line Graph */}
      <View className="mt-8 w-full">
        <Text className="text-3xl font-bold mb-4">Average Daily Distances</Text>
        <LineGraph data={dummyData} width={350} height={200} />
      </View>

      {/* Back Link */}
      <BackLink to="/home" />
    </ScreenView>
  )
}
