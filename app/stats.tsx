import { ScrollView, View, Text, Button } from 'react-native'
import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import StatBox from '../components/team-3/StatBox'
import LineGraph from '../components/team-3/LineGraph'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons'
import { useEffect, useState } from 'react';
import { getGamesPlayed } from '../storage/statsStorage'; // adjust path as needed
import { incrementGamesPlayed } from '../storage/statsStorage'; // adjust path as needed


export default function Stats() {
  const dummyData = [15, 20, 18, 22, 25, 19, 17]
  
  const [gamesPlayed, setGamesPlayed] = useState<number | null>(null);

  useEffect(() => {
    const fetchGamesPlayed = async () => {
      const value = await getGamesPlayed();
      setGamesPlayed(value);
    };
  
    fetchGamesPlayed();
  }, []);

  const handleTestIncrement = async () => {
    await incrementGamesPlayed();
    const updated = await getGamesPlayed();
    setGamesPlayed(updated);
  };
  

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
              text={gamesPlayed !== null ? `${gamesPlayed} Games` : 'Loading...'}            
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
        <View className="items-center mt-8 w-full">
          <Text className="text-2xl font-bold mb-4 text-center">
            Average Daily Distances
          </Text>
          <LineGraph data={dummyData} width={350} height={200} />
        </View>

         {/* 🔧 TEST BUTTON */}
         <View className="mt-4 items-center">
          <Button title="Test Increment Games Played" onPress={handleTestIncrement} />
        </View>


        {/* Back Link */}
        <BackLink to="/home" />
      </ScrollView>
    </ScreenView>
  )
}
