import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/app/navigation/AuthNavigator';
import { registerRootComponent } from 'expo';
import { useFonts, PatrickHand_400Regular } from '@expo-google-fonts/patrick-hand';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    PatrickHand_400Regular,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <AuthNavigator />
    </NavigationContainer>
  );
}

registerRootComponent(App);
