import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import StatBox from '../components/team-3/StatBox'
import {View, Text} from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function Stats() {
  return (
    <ScreenView className="flex-1 items-center justify-start border-4 p-20">
        <View>
            <Text className="text-5xl font-bold">STATISTICS</Text>
        </View>
        <View className="items-center space-y-4 mt-6">
            <StatBox           
                icon={<SimpleLineIcons name="map" size={24} color="black" />}
                title="Games Played"
                text="30 Games"
            />
            <StatBox           
                icon={<SimpleLineIcons name="location-pin" size={24} color="black" />}
                title="Average Distance"
                text="200 ft"
            />
        </View>
        <View>
            <StatBox            
                    icon={<SimpleLineIcons name="target" size={24} color="black" />}
                    title="Best Guess"
                    text="EB2 Room 1226: 2ft"
                />
            <StatBox              
                    icon={<SimpleLineIcons name="clock" size={24} color="black" />}
                    title="Average Round Time"
                    text="2:23"
                />
        </View>
      <BackLink to="/home" />
    </ScreenView>
  )
}

