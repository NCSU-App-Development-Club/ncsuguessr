import { View, Text, StyleSheet } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign'
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

interface Icon {
    icon: JSX.Element; // Accepts an entire icon component
    title: string;
    text: string;
}

export default function StatBox({ icon, title, text }: Icon) {
    return (
        <View style={styles.container}>
        {icon}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.baseText}>{text}</Text>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "flex-start",
      borderWidth: 2,
      borderRadius: 15,
      padding: 10,
      borderBlockColor: "black"
    },
    baseText: {
      fontFamily: 'Cochin',
      color: "gray",
      fontSize: 10
    },
    titleText: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    textContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
    },
  });