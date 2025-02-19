import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ScreenView from '../components/global/ScreenView';
import BackLink from '../components/global/BackLink';

export default function GameSelect() {
  return (
    <ScreenView>
      <Text style={styles.title}>Game Selection</Text>
      <BackLink to="/" />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Daily Challenge</Text>
      </TouchableOpacity>
      <Text style={styles.description}>Play today's daily game and explore new locations at NCSU!</Text>

      <Image 
        source={{ uri: 'https://sportslogohistory.com/wp-content/uploads/2018/09/north_carolina_state_wolfpack_2006-pres-a.png' }} 
        style={styles.image}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Previous Challenges</Text>
      </TouchableOpacity>
      <Text style={styles.description}>View and play games from previous dates!</Text>

      {/* New Section - Previous Challenges */}
      <Text style={styles.sectionTitle}>Previous Challenges</Text>
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>Yesterday</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>Two Days Ago</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.challengeButton}>
        <Text style={styles.challengeButtonText}>Three Days Ago</Text>
      </TouchableOpacity>
    </ScreenView>
  );
}

// Styles to match the UI in the image
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#CC0000',
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    textAlign: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#CC0000',
    alignSelf: 'center',
  },
  challengeButton: {
    backgroundColor: '#CC0000',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'center',
  },
  challengeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
    alignSelf: 'center',
  },
});

