import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';

export default function Player() {
    const selectedSongUri = useSelector((state) => state.song.value);
    const [audio, setAudio] = useState({
        instance: null,
        isPlaying: false,
        isPaused: false,
        position: 0,
        duration: 0,
    });

    useEffect(() => {
        if (audio.instance) {
        audio.instance.setOnPlaybackStatusUpdate((status) => {
            setAudio((prevAudio) => ({
            ...prevAudio,
            position: status.positionMillis,
            duration: status.durationMillis,
            }));

            if (status.positionMillis >= status.durationMillis) {
            stopSound();
            }
        });
        }
    }, [audio.instance]);

    const stopAndReset = async () => {
        if (audio.instance && (audio.isPlaying || audio.isPaused)) {
        await audio.instance.stopAsync();
        setAudio((prevAudio) => ({
            ...prevAudio,
            isPlaying: false,
            isPaused: false,
        }));
        }
        setAudio((prevAudio) => ({
        ...prevAudio,
        instance: null,
        }));
    };

    const updatePositionAndPlay = async (value) => {
        if (audio.instance) {
        await stopAndReset();
        await audio.instance.setPositionAsync(value);
        setAudio((prevAudio) => ({
            ...prevAudio,
            position: value,
        }));
        if (audio.isPlaying || audio.isPaused) {
            await audio.instance.playAsync();
            setAudio((prevAudio) => ({
            ...prevAudio,
            isPlaying: true,
            isPaused: false,
            }));
        }
        }
    };

    const playSound = async () => {
        if (selectedSongUri) {
        try {
            await stopAndReset();
            const { sound } = await Audio.Sound.createAsync({
            uri: `http://10.0.2.2:8000/api/music/${selectedSongUri}`,
            });
            setAudio((prevAudio) => ({
            ...prevAudio,
            instance: sound,
            }));
            await sound.playAsync();
            setAudio((prevAudio) => ({
            ...prevAudio,
            isPlaying: true,
            }));
        } catch (error) {
            alert(error);
        }
        }
    };

    const handlePlayback = async () => {
        if (audio.instance) {
        if (audio.isPlaying) {
            if (audio.isPaused) {
            await audio.instance.playAsync();
            setAudio((prevAudio) => ({
                ...prevAudio,
                isPaused: false,
            }));
            } else {
            await audio.instance.pauseAsync();
            setAudio((prevAudio) => ({
                ...prevAudio,
                isPaused: true,
            }));
            }
        } else {
            await stopAndReset();
            await audio.instance.playAsync();
            setAudio((prevAudio) => ({
            ...prevAudio,
            isPlaying: true,
            }));
        }
        } else {
        playSound();
        }
    };

    const stopSound = async () => {
        await stopAndReset();
    };

    const updatePosition = (value) => {
        if (audio.instance) {
        audio.instance.setPositionAsync(value);
        setAudio((prevAudio) => ({
            ...prevAudio,
            position: value,
        }));
        if (audio.isPlaying && !audio.isPaused) {
            audio.instance.playAsync();
        }
        }
    };

    const seekBack = async () => {
        const newPosition = audio.position - 5000;
        if (!audio.isPlaying && !audio.isPaused) {
        await updatePositionAndPlay(newPosition >= 0 ? newPosition : 0);
        } else {
        updatePosition(newPosition >= 0 ? newPosition : 0);
        }
    };

    const seekNext = async () => {
        const newPosition = audio.position + 5000;
        if (!audio.isPlaying && !audio.isPaused) {
        await updatePositionAndPlay(
            newPosition <= audio.duration ? newPosition : audio.duration
        );
        } else {
        updatePosition(newPosition <= audio.duration ? newPosition : audio.duration);
        }
    };

    const formatPosition = (position) => {
        const seconds = Math.floor((position / 1000) % 60);
        const minutes = Math.floor((position / 1000 / 60) % 60);
        const formattedPosition = `${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return formattedPosition;
    };

    const { instance, isPlaying, isPaused, position, duration } = audio;

    return (
        <View style={styles.container}>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handlePlayback}>
            <Text style={styles.buttonText}>
                {isPlaying && !isPaused ? 'Pause' : isPaused ? 'Resume' : 'Play'}
            </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={stopSound}>
            <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={seekBack}>
            <Text style={styles.buttonText}>Seek Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={seekNext}>
            <Text style={styles.buttonText}>Seek Next</Text>
            </TouchableOpacity>
        </View>
        <Text style={styles.status}>
            {isPlaying ? 'Now Playing' : isPaused ? 'Paused' : 'Stopped'}
        </Text>
        <Slider
            style={styles.seekbar}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="blue"
            maximumTrackTintColor="gray"
            thumbTintColor="blue"
            onValueChange={updatePosition}
            onSlidingComplete={async (value) => {
            if (!isPlaying && !isPaused) {
                await updatePositionAndPlay(value);
            } else {
                updatePosition(value);
            }
            }}
        />
        <Text style={styles.status}>{formatPosition(position)}</Text>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        backgroundColor: 'blue',
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    status: {
        fontSize: 18,
    },
    seekbar: {
        width: '100%',
        marginTop: 24,
    },
});
