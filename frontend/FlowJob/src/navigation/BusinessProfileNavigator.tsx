// src/navigation/BusinessProfileNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessProfileStep1Screen from '../screens/businessProfileSetup/BusinessStep1'; // Import the renamed BusinessStep1
import FinishSetupScreen from '../screens/businessProfileSetup/FinishBusinessSetupScreen'; // Import the renamed BusinessStep1

// Define the param list for BusinessProfileNavigator
export type BusinessProfileStackParamList = {
  BusinessProfileStep1: undefined;
  FinishSetup: undefined; // Add other steps here (e.g., BusinessProfileStep2, BusinessProfileStep3)
  // Add other steps here (e.g., BusinessProfileStep2, BusinessProfileStep3)
};

const Stack = createNativeStackNavigator<BusinessProfileStackParamList>();

const BusinessProfileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BusinessProfileStep1" component={BusinessProfileStep1Screen} />
      <Stack.Screen name="FinishSetup" component={FinishSetupScreen} />
    </Stack.Navigator>
  );
};

export default BusinessProfileNavigator;