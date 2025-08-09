// App.js
import React, { useEffect } from 'react';
import { initDatabase } from './database/db';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DecideScreen from './DecideScreen';
import SortScreen   from './SortScreen';
import WheelScreen  from './WheelScreen';
import HistoryScreen from './HistoryScreen';
import PresetScreen from './PresetScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Decide"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Decide" component={DecideScreen} />
        <Stack.Screen name="Sort"   component={SortScreen} />
        <Stack.Screen name="Wheel"  component={WheelScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Preset" component={PresetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
