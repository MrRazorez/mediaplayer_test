import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Player from './components/Player';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Player</Text>
      <Player />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
});
