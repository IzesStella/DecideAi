// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import DecideScreen from './DecideScreen';
import SortScreen   from './SortScreen';
import WheelScreen  from './WheelScreen';  // <— aqui!

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Decide"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Decide" component={DecideScreen} />
        <Stack.Screen name="Sort"   component={SortScreen} />
        <Stack.Screen name="Wheel"  component={WheelScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
