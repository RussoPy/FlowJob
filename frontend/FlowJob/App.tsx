import 'react-native-gesture-handler';
import React from 'react'; // Removed useEffect, useState for RTL logic
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider, Text as PaperText } from 'react-native-paper';
import { View, ActivityIndicator, LogBox, Platform } from 'react-native'; // Removed I18nManager, Alert
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import RootNavigator from './src/navigation/RootNavigator';
import { theme, useCustomFonts } from './src/styles/theme';

// You can keep this if you still see these warnings from other parts of your app
LogBox.ignoreLogs(['Require cycle:']);

export default function App() {
  console.log('[App.tsx] Component rendering/re-rendering...');

  const [fontsLoaded, fontError] = useCustomFonts();

  if (fontError) {
    console.error("[App.tsx] Font loading error encountered:", fontError);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.l, backgroundColor: theme.colors.background }}>
        <PaperText style={{ color: theme.colors.error, textAlign: 'center', fontFamily: 'System' }}>
          שגיאה בטעינת משאבי האפליקציה. אנא נסה להפעיל מחדש.
        </PaperText>
      </View>
    );
  }

  if (!fontsLoaded) {
    console.log('[App.tsx] Showing loading screen: Fonts not loaded.');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <PaperText style={{ marginTop: theme.spacing.m, color: theme.colors.onBackground, fontFamily: 'System' }}>
          טוען גופנים...
        </PaperText>
      </View>
    );
  }
  console.log('[App.tsx] Fonts are loaded. Proceeding to render RootNavigator.');

  // Render the main application
  return (
    <SafeAreaProvider>
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
