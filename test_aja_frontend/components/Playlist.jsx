import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectSong } from '../controllers/songSlice';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

export default function PlaylistScreen() {
  const dispatch = useDispatch();
  const [playlistData, setPlaylistData] = useState({
    data: [],
    isLoading: false,
    modalVisible: false,
    songTitle: '',
    songOriTitle: '',
    songUri: null,
  });

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = () => {
    axios
      .get('http://10.0.2.2:8000/api/playlist')
      .then((response) => {
        setPlaylistData((prevData) => ({
          ...prevData,
          data: response.data.playlist,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSongPress = (data) => {
    dispatch(selectSong(data.song));
  };

  const handleModal = () => {
    setPlaylistData((prevData) => ({
      ...prevData,
      modalVisible: !prevData.modalVisible,
    }));
  };

  const handleSongTitleChange = (event) => {
    setPlaylistData((prevData) => ({
      ...prevData,
      songTitle: event.nativeEvent.text,
    }));
  };

  const handleFilePick = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'audio/mpeg' });
      if (file.type === 'success') {
        setPlaylistData((prevData) => ({
          ...prevData,
          songUri: file.uri,
          songTitle: file.name,
          songOriTitle: file.name,
          modalVisible: true,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleResetForm = () => {
    setPlaylistData((prevData) => ({
      ...prevData,
      songTitle: '',
      songOriTitle: '',
      songUri: null,
      modalVisible: false,
    }));
  };

  const handleUploadSong = () => {
    setPlaylistData((prevData) => ({
      ...prevData,
      isLoading: true,
    }));

    const formData = new FormData();
    formData.append('title', playlistData.songTitle);
    formData.append('song', {
      uri: playlistData.songUri,
      type: 'audio/mpeg',
      name: playlistData.songOriTitle,
    });

    axios
      .post('http://10.0.2.2:8000/api/playlist', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data.message);
        setPlaylistData((prevData) => ({
          ...prevData,
          isLoading: false,
        }));
        fetchPlaylist();
        handleResetForm();
      })
      .catch((error) => {
        console.error(error);
        setPlaylistData((prevData) => ({
          ...prevData,
          isLoading: false,
        }));
      });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSongPress(item)}>
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  const { data, isLoading, modalVisible, songTitle, songOriTitle, songUri } = playlistData;

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
        <Text style={styles.uploadButtonText}>Upload Playlist</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="slide" onRequestClose={handleModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Upload Song</Text>
          <TextInput
            style={styles.input}
            placeholder="Song Title"
            defaultValue={songTitle}
            onChange={handleSongTitleChange}
          />
          <Button
            title={isLoading ? 'Uploading...' : 'Upload'}
            onPress={handleUploadSong}
            disabled={isLoading || songTitle === ''}
          />
          <Button title="Cancel" onPress={handleResetForm} color="red" />
        </View>
      </Modal>
    </View>
  );
}

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