import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RoleScreen from '../screens/RoleScreen';

// Define your params
export type AuthStackParamList = {
    RoleScreen: undefined;
    Login: undefined;
    Register: { role: 'worker' | 'business' } | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="RoleScreen" component={RoleScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;