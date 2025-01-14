import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function Stats() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Stats Page</Text>
      <Link style={styles.link} href="/"> {"< "}Back</Link>
      {/* <StatusBar style="auto" /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4
}, link: {
    borderWidth: 1,
    width: 72,
    textAlign: 'center',
    padding: 6,
    margin: 4,
    position: "absolute",
    top: 4,
    left: 4
  }
});