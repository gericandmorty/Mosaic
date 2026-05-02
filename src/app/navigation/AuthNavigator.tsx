import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../../modules/auth/screens/LoginScreen';
import { RegisterScreen } from '../../modules/auth/screens/RegisterScreen';
import { DashboardScreen } from '../../modules/dashboard/screens/DashboardScreen';
import { ProfileScreen } from '../../modules/profile/screens/ProfileScreen';
import { SearchScreen } from '../../modules/music/screens/SearchScreen';
import { PlayerScreen } from '../../modules/music/screens/PlayerScreen';

import { useAuthStore } from '../../modules/auth/store/auth.slice';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { token } = useAuthStore();
  const isAuthenticated = !!token;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
