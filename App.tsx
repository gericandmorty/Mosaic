import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/app/navigation/AuthNavigator';
import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';

function App() {
  return (
    <NavigationContainer>
      <AuthNavigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

registerRootComponent(App);
