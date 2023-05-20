import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const PlaylistScreen = () => {
  const [playlistData, setPlaylistData] = useState([]);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/api/playlist')
      .then(response => response.json())
      .then(data => setPlaylistData(data.playlist))
      .catch(error => console.error(error));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSongPress(item)}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleSongPress = (song) => {
    console.log('Lagu dipilih:', song.title);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={playlistData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    backgroundColor: 'blue',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: 'white'
  },
});

export default PlaylistScreen;
