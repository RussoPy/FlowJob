// src/navigation/WorkerProfileNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkerProfileStep1Screen from '../screens/workerProfileSetup/WorkerStep1'; // Import the renamed WorkerStep1
import FinishSetupScreen from '../screens/workerProfileSetup/FinishWorkerSetupScreen'; // Import the renamed WorkerStep1


// Define the param list for WorkerProfileNavigator
export type WorkerProfileStackParamList = {
    WorkerProfileStep1: undefined;
    FinishSetup: undefined; // Add other steps here (e.g., WorkerProfileStep2, WorkerProfileStep3)
    // Add other steps here (e.g., WorkerProfileStep2, WorkerProfileStep3)
};

const Stack = createNativeStackNavigator<WorkerProfileStackParamList>();

const WorkerProfileNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="WorkerProfileStep1" component={WorkerProfileStep1Screen} />
            <Stack.Screen name="FinishSetup" component={FinishSetupScreen} />
        </Stack.Navigator>
    );
};

export default WorkerProfileNavigator;