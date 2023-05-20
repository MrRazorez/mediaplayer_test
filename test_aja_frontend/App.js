import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Player from './components/Player';
import PlaylistScreen from './components/Playlist';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Player" component={Player} />
        <Tab.Screen name="PlaylistScreen" component={PlaylistScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
