import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'; // Corrected name

// Define your params if needed
// export type AppStackParamList = {
//   Home: undefined;
// };

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'FlowJob' }}/>
      {/* Add other screens like Profile, Matches etc. */}
    </Stack.Navigator>
  );
};

export default AppNavigator;