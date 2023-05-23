import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Player from './components/Player';
import PlaylistScreen from './components/Playlist';
import store from './controllers/store';
import { Provider } from 'react-redux';

const Tab = createBottomTabNavigator();

const App = () => (
  <Provider store={store}>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Media Player" component={Player} />
        <Tab.Screen name="Playlist" component={PlaylistScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  </Provider>
);

export default App;
