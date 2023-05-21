import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from 'axios';

const PlaylistScreen = () => {
  const [playlistData, setPlaylistData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [songTitle, setSongTitle] = useState('');

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = () => {
    axios.get('http://10.0.2.2:3000/api/playlist')
      .then(response => {
        setPlaylistData(response.data.playlist);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSongPress = (song) => {
    console.log('Lagu dipilih:', song.title);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSongTitleChange = (text) => {
    setSongTitle(text);
  };

  const handleUploadSong = () => {
    setIsLoading(true);

    axios.post('http://10.0.2.2:3000/api/playlist', { title: songTitle })
      .then(response => {
        console.log(response.data.message);
        setIsLoading(false);
        fetchPlaylist();
        setSongTitle('');
        closeModal();
      })
      .catch(error => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSongPress(item)}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={playlistData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={openModal}
      >
        <Text style={styles.uploadButtonText}>Upload Playlist</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Upload Song</Text>
          <TextInput
            style={styles.input}
            placeholder="Song Title"
            value={songTitle}
            onChangeText={handleSongTitleChange}
          />
          <Button
            title={isLoading ? 'Uploading...' : 'Upload'}
            onPress={handleUploadSong}
            disabled={isLoading || songTitle === ''}
          />
          <Button
            title="Cancel"
            onPress={closeModal}
            color="red"
          />
        </View>
      </Modal>
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
  uploadButton: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  uploadButtonText: {
    fontSize: 16,
    color: 'white'
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default PlaylistScreen;
