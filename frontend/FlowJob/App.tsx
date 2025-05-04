// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper'; // Import PaperProvider
import { View, ActivityIndicator } from 'react-native'; // For font loading indicator
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message'; // Import Toast
import RootNavigator from './src/navigation/RootNavigator'; // Adjust path if needed
import { theme, useCustomFonts } from './src/styles/theme'; // Import theme and font hook

export default function App() {
  // Load custom fonts
  const [fontsLoaded, fontError] = useCustomFonts();

  // Show loading indicator while fonts are loading or if there's an error
  // You might want more sophisticated error handling
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        {/* Optionally show an error message if fontError exists */}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* PaperProvider wraps everything and applies the theme */}
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
  );
}