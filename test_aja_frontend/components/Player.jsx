import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';

export default function Player() {
    const selectedSongUri = useSelector((state) => state.song.value);
    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audio) {
            audio.setOnPlaybackStatusUpdate((status) => {
                setPosition(status.positionMillis);
                setDuration(status.durationMillis);

                if (status.positionMillis >= status.durationMillis) {
                stopSound();
                }
            });
        }
    }, [audio, position]);

    const stopAndReset = async () => {
        if (audio && (isPlaying || isPaused)) {
            await audio.stopAsync();
            setIsPlaying(false);
            setIsPaused(false);
        }
        setAudio(null);
    };

    const updatePositionAndPlay = async (value) => {
        if (audio) {
        await stopAndReset();
        await audio.setPositionAsync(value);
        setPosition(value);
        if (isPlaying || isPaused) {
            await audio.playAsync();
            setIsPlaying(true);
            setIsPaused(false);
        }
        }
    };

    const playSound = async () => {
        if (selectedSongUri) {
            try {
                await stopAndReset();
                const { sound } = await Audio.Sound.createAsync({
                    uri: `http://10.0.2.2:3000/api/music/${selectedSongUri}`,
                });
                setAudio(sound);
                await sound.playAsync();
                setIsPlaying(true);
            } catch (error) {
                alert(error);
            }
        }
    };

    const handlePlayback = async () => {
        if (audio) {
            if (isPlaying) {
                if (isPaused) {
                await audio.playAsync();
                setIsPaused(false);
                } else {
                await audio.pauseAsync();
                setIsPaused(true);
                }
            } else {
                await stopAndReset();
                await audio.playAsync();
                setIsPlaying(true);
            }
        } else {
            playSound();
        }
    };

    const stopSound = async () => {
        await stopAndReset();
    };

    const updatePosition = (value) => {
        if (audio) {
        audio.setPositionAsync(value);
        setPosition(value);
        if (isPlaying && !isPaused) {
            audio.playAsync();
        }
        }
    };

    const seekBack = async () => {
        const newPosition = position - 5000;
        await updatePositionAndPlay(newPosition >= 0 ? newPosition : 0);
    };

    const seekNext = async () => {
        const newPosition = position + 5000;
        await updatePositionAndPlay(newPosition <= duration ? newPosition : duration);
    };

    const formatPosition = (position) => {
        const seconds = Math.floor((position / 1000) % 60);
        const minutes = Math.floor((position / 1000 / 60) % 60);
        const formattedPosition = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return formattedPosition;
    };

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
