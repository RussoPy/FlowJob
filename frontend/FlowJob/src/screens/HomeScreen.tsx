// src/screens/HomeScreen.tsx

import React, { useState } from 'react';
import { BottomNavigation, Text as PaperText } from 'react-native-paper';
import { SafeAreaView, StyleSheet, View } from 'react-native'; // Added View for more flexible centering
import { useAppTheme, AppTheme } from '../styles/theme'; // Import useAppTheme and AppTheme type

// --- Placeholder Screens (Replace with your actual implementations) ---
// Updated to use useAppTheme and better styling from theme
const PlaceholderScreen = ({ routeTitle }: { routeTitle: string }) => {
  const theme = useAppTheme(); // Use your custom hook

  // Create styles within the component or pass theme to a style function
  const placeholderStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background, // Use theme background
      padding: theme.spacing.l, // Use theme spacing
    },
    text: {
      color: theme.colors.onBackground, // Use theme text color on background
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.background}}>
      <View style={placeholderStyles.container}>
        <PaperText variant="headlineMedium" style={placeholderStyles.text}>
          {routeTitle || 'Screen'} Content
        </PaperText>
        <PaperText variant="bodyMedium" style={placeholderStyles.text}>
          (This is a placeholder)
        </PaperText>
      </View>
    </SafeAreaView>
  );
};

// Define routes with components
const JobMatchScreen = () => <PlaceholderScreen routeTitle="FlowJob" />;
const ProfileScreen = () => <PlaceholderScreen routeTitle="Profile" />;
const ChatScreen = () => <PlaceholderScreen routeTitle="Matches" />;
// --- End Placeholder Screens ---


export default function HomeScreen() {
  const theme = useAppTheme(); // Use your custom hook for the main component theme
  const [index, setIndex] = useState(1); // Default to 'match' screen (index 1)

  const [routes] = useState([
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline', component: ProfileScreen },
    { key: 'match', title: 'FlowJob', focusedIcon: 'gesture-swipe-horizontal', unfocusedIcon: 'gesture-swipe', component: JobMatchScreen },
    { key: 'chat', title: 'Matches', focusedIcon: 'chat', unfocusedIcon: 'chat-outline', component: ChatScreen },
  ]);

  // Render Scene map - needed by BottomNavigation V5+
  // Ensure the component type is correct if they take props
  const renderScene = BottomNavigation.SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = route.component;
      return acc;
    }, {} as { [key: string]: React.ComponentType<any> }) // Type assertion for SceneMap
  );

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      // --- Theming Applied ---
      activeColor={theme.colors.primary} // Active icon and label color
      inactiveColor={theme.colors.onSurfaceVariant} // Inactive icon and label color (using onSurfaceVariant for muted)
      barStyle={{ backgroundColor: theme.colors.surface }} // Background of the navigation bar
      // theme={theme} // PaperProvider should handle this, but explicitly passing can ensure it
      // For V5, ensure the theme prop is typed correctly if used: theme={theme as any} or ensure full MD3 compatibility
      
      // Scene animation props
      sceneAnimationEnabled={true}
      sceneAnimationType="opacity" // 'shifting' or 'opacity'
      // labelMaxLines={1} // Ensure labels don't wrap if too long

      // If you want to customize the indicator (the ripple effect or underline for active tab):
      // activeIndicatorStyle={{ backgroundColor: theme.colors.primaryContainer }} // Example
    />
  );
}

// --- Styles (Mostly for placeholders, now integrated into PlaceholderScreen or defined there) ---
// No global styles needed here if PlaceholderScreen handles its own,
// or if general layout is handled by SafeAreaView + theme.
// const styles = StyleSheet.create({
//   // placeholderContainer is now part of the PlaceholderScreen component for better encapsulation
// });