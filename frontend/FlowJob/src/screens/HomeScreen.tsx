// src/screens/HomeScreen.tsx

import React, { useState } from 'react';
import { BottomNavigation, Text as PaperText, useTheme } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native'; // Use SafeAreaView



// --- Placeholder Screens (Replace with your actual implementations) ---
const PlaceholderScreen = ({ route }: { route: { title: string }}) => {
    const theme = useTheme();
    return (
        <SafeAreaView style={[styles.placeholderContainer, { backgroundColor: theme.colors.background }]}>
            <PaperText variant='headlineMedium'>
                {route.title || 'Screen'} Content
            </PaperText>
        </SafeAreaView>
    );
};
// Remove these placeholders once you have real screens:
const JobMatchScreen = () => <PlaceholderScreen route={{ title: 'Job Matching' }} />;
const ProfileScreen = () => <PlaceholderScreen route={{ title: 'Profile' }} />;
const ChatScreen = () => <PlaceholderScreen route={{ title: 'Chat / Matches' }} />;
// --- End Placeholder Screens ---


export default function HomeScreen() {
  const theme = useTheme();
  const [index, setIndex] = useState(1); // Default to 'match' screen (index 1)

  const [routes] = useState([
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline', component: ProfileScreen },
    { key: 'match', title: 'FlowJob', focusedIcon: 'gesture-swipe-horizontal', unfocusedIcon: 'gesture-swipe', component: JobMatchScreen }, // Use name for title if desired
    { key: 'chat', title: 'Matches', focusedIcon: 'chat', unfocusedIcon: 'chat-outline', component: ChatScreen },
  ]);

  // Render Scene map - needed by BottomNavigation V5+
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
      // Theming:
      // activeColor={theme.colors.primary} // Color for the active icon and label
      // inactiveColor={theme.colors.onSurfaceDisabled} // Color for the inactive icon and label
      // barStyle={{ backgroundColor: theme.colors.elevation.level2 }} // Background color of the bar (use elevation for subtle color)
      // theme={theme} // Pass the theme explicitly if needed, though Provider should handle it
      // Use theme V3 badge styles if using badges
       sceneAnimationEnabled={true} // Optional: enable transition animation
       sceneAnimationType='opacity' // Optional: animation type
    />
  );
}

// --- Styles (Mostly for placeholders) ---
const styles = StyleSheet.create({
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});