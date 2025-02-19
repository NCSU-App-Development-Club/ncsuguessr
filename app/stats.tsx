import ScreenView from '../components/global/ScreenView'
import BackLink from '../components/global/BackLink'
import StatBox from '../components/team-3/StatBox'
import {View, Text, StyleSheet} from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function Stats() {
  return (
    <ScreenView className="items-center justify-center border-4">
        <View style={styles.container}>
            <Text style={styles.titleText}>Statistics</Text>
        </View>
        <View style={styles.boxContainer}>
            <StatBox style={styles.statBox}             
                icon={<SimpleLineIcons name="map" size={24} color="black" />}
                title="Games Played"
                text="30 Games"
            />
            <StatBox style={styles.statBox}             
                icon={<SimpleLineIcons name="location-pin" size={24} color="black" />}
                title="Average Distance"
                text="200 ft"
            />
        </View>
        <View style={styles.boxContainer}>
            <StatBox style={styles.statBox}             
                    icon={<SimpleLineIcons name="target" size={24} color="black" />}
                    title="Best Guess"
                    text="EB2 Room 1226: 2ft"
                />
            <StatBox style={styles.statBox}             
                    icon={<SimpleLineIcons name="clock" size={24} color="black" />}
                    title="Average Round Time"
                    text="2:23"
                />
        </View>
      <BackLink to="/home" />
    </ScreenView>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 50
    },
    baseText: {
      fontFamily: 'Cochin',
    },
    titleText: {
      fontSize: 50,
      fontWeight: 'bold',
    },
    boxContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    statBox: {
        width: "100%",
        marginBottom: 15,
        margin: 20
      }
  });


