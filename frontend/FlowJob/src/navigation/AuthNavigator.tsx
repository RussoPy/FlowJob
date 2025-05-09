// src/navigation/AuthNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RoleScreen from '../screens/RoleScreen';
import WorkerRegisterScreen from '../screens/WorkerRegisterScreen';
import BusinessRegisterScreen from '../screens/BusinessRegisterScreen';
import WorkerProfileNavigator from './WorkerProfileNavigator'; // Import the Worker Profile Navigator
import BusinessProfileNavigator from './BusinessProfileNavigator'; // Import the Business Profile Navigator

// Define your params
export type AuthStackParamList = {
    RoleScreen: undefined;
    Login: undefined;
    WorkerRegister: undefined;
    BusinessRegister: undefined;
    WorkerProfileSetup: undefined; // Add route for Worker Profile Setup Navigator
    BusinessProfileSetup: undefined; // Add route for Business Profile Setup Navigator
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RoleScreen" component={RoleScreen} />
          <Stack.Screen name="WorkerRegister" component={WorkerRegisterScreen} />
          <Stack.Screen name="BusinessRegister" component={BusinessRegisterScreen} />
          <Stack.Screen name="WorkerProfileSetup" component={WorkerProfileNavigator} />
          <Stack.Screen name="BusinessProfileSetup" component={BusinessProfileNavigator} />
          
        </Stack.Navigator>
    );
};

export default AuthNavigator;