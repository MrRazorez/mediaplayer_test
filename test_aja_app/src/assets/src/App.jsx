import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [audioSrc, setAudioSrc] = useState('');
  const [currentSong, setCurrentSong] = useState(null);
  const [title, setTitle] = useState('');
  const [song, setSong] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/playlist');
      const data = response.data;
      setPlaylist(data.playlist);
    } catch (error) {
      console.error('Failed to fetch playlist:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    setSong(file);
    setTitle(fileName);
  };
  

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!song || !title) {
      setMessage('Please select a file and enter a title.');
      return;
    }

    const formData = new FormData();
    formData.append('song', song);
    formData.append('title', title);

    try {
      await axios.post('http://127.0.0.1:3000/api/playlist', formData);
      setMessage('Song saved successfully');
      fetchPlaylist();
    } catch (error) {
      console.error('Failed to save song:', error);
      setMessage('Failed to save song.');
    }
  };

  const handleSongClick = (song) => {
    if (currentSong === song) {
      pauseAudio();
    } else {
      playAudio(song);
    }
  };

  const playAudio = (song) => {
    setCurrentSong(song);
    setAudioSrc(`http://127.0.0.1:3000/api/music/${encodeURIComponent(song.song)}`);
  };

  const pauseAudio = () => {
    setCurrentSong(null);
    setAudioSrc('');
  };

  return (
    <div>
      <h1>Playlist</h1>
      <ul>
        {playlist.map((item) => (
          <li key={item.id} onClick={() => handleSongClick(item)} style={{cursor: 'pointer'}}>
            {item.title}
          </li>
        ))}
      </ul>
      <form onSubmit={handleFormSubmit}>
        <input type="file" onChange={handleFileChange} />
        <input type="text" placeholder="Enter title" value={title} onChange={handleTitleChange} />
        <button type="submit">Save Song</button>
      </form>
      {message && <p>{message}</p>}
      {currentSong && (
        <div>
          <h2>Now Playing: {currentSong.title}</h2>
          <audio src={audioSrc} controls autoPlay />
        </div>
      )}
    </div>
  );
}

export default App;
