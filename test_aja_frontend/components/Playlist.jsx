import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectSong } from '../controllers/songSlice';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const PlaylistScreen = () => {
  const dispatch = useDispatch();
  const [playlistData, setPlaylistData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [songTitle, setSongTitle] = useState('');
  const [songUri, setSongUri] = useState(null);

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
    dispatch(selectSong(song.title));
  };

  const handleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleFilePick = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      if (file.type === 'success') {
        setSongUri(file.uri);
        setSongTitle(file.name);
      }      
      handleModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUploadSong = () => {
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append('song', {
      uri: songUri,
      type: 'audio/*',
      name: songTitle,
    });
  
    axios
      .post('http://10.0.2.2:3000/api/playlist', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then((response) => {
        console.log(response.data.message);
        setIsLoading(false);
        fetchPlaylist();
        setSongTitle('');
        setSongUri(null);
        handleModal();
      })
      .catch((error) => {
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
        onPress={handleFilePick}
      >
        <Text style={styles.uploadButtonText}>Upload Playlist</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Upload Song</Text>
          <TextInput
            editable={false}
            style={styles.input}
            placeholder="Song Title"
            defaultValue={songTitle}
          />
          <Button
            title={isLoading ? 'Uploading...' : 'Upload'}
            onPress={handleUploadSong}
            disabled={isLoading || songTitle === ''}
          />
          <Button
            title="Cancel"
            onPress={handleModal}
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
