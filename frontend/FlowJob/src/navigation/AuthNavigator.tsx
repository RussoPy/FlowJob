// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RoleScreen from '../screens/RoleScreen';
import WorkerRegisterScreen from '../screens/WorkerRegisterScreen'; // Import WorkerRegisterScreen
import BusinessRegisterScreen from '../screens/BusinessRegisterScreen'; // Import BusinessRegisterScreen

// Define your params
export type AuthStackParamList = {
    RoleScreen: undefined;
    Login: undefined;
    WorkerRegister: undefined; // Add this line for the worker registration screen
    BusinessRegister: undefined; // Add this line for the business registration screen
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RoleScreen" component={RoleScreen} />
          <Stack.Screen name="WorkerRegister" component={WorkerRegisterScreen} />
          <Stack.Screen name="BusinessRegister" component={BusinessRegisterScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;