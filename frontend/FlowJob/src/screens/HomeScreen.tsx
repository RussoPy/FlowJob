// src/screens/HomeScreen.tsx

import React, { useState } from 'react';
import { BottomNavigation, Text as PaperText, Button as PaperButton } from 'react-native-paper'; // Import Button as PaperButton
import { SafeAreaView, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast

import { useAppTheme, AppTheme } from '../styles/theme';
import { auth } from '../api/firebase'; // Import auth from your Firebase config
import { signOut } from 'firebase/auth'; // Import signOut from Firebase Auth

// --- Placeholder Screens (Replace with your actual implementations) ---
const PlaceholderScreen = ({ routeTitle }: { routeTitle: string }) => {
  const theme = useAppTheme();

  const placeholderStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: theme.spacing.l,
    },
    text: {
      color: theme.colors.onBackground,
      textAlign: 'center',
      marginBottom: theme.spacing.m, // Added margin for spacing
    },
    button: {
      marginTop: theme.spacing.m,
    },
  });

  // Conditionally render a sign out button on the Profile screen
  if (routeTitle === 'Profile') {
    const handleSignOut = async () => {
      try {
        await signOut(auth); // Call Firebase signOut
        Toast.show({
          type: 'success',
          text1: 'התנתקת בהצלחה!', // Hebrew for "Signed out successfully!"
          text2: 'נתראה בפעם הבאה 👋', // Hebrew for "See you next time 👋"
        });
        // The RootNavigator (src/navigation/RootNavigator.tsx) will automatically
        // detect the authentication state change and navigate the user back to the AuthNavigator (login screen).
      } catch (error: any) {
        console.error("Sign out error:", error);
        Toast.show({
          type: 'error',
          text1: 'שגיאת התנתקות', // Hebrew for "Sign out error"
          text2: error.message || 'אירעה שגיאה בהתנתקות.', // Hebrew for "An error occurred during sign out."
        });
      }
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View style={placeholderStyles.container}>
          <PaperText variant="headlineMedium" style={placeholderStyles.text}>
            {routeTitle} Content
          </PaperText>
          <PaperText variant="bodyMedium" style={placeholderStyles.text}>
            (This is a placeholder)
          </PaperText>
          <PaperButton
            mode="contained"
            onPress={handleSignOut}
            style={placeholderStyles.button}
            contentStyle={{ paddingVertical: theme.spacing.s }} // Use theme spacing
          >
            התנתקות {/* Hebrew for "Sign Out" */}
          </PaperButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
  const theme = useAppTheme();
  const [index, setIndex] = useState(1); // Default to 'match' screen (index 1)

  const [routes] = useState([
    { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline', component: ProfileScreen },
    { key: 'match', title: 'FlowJob', focusedIcon: 'gesture-swipe-horizontal', unfocusedIcon: 'gesture-swipe', component: JobMatchScreen },
    { key: 'chat', title: 'Matches', focusedIcon: 'chat', unfocusedIcon: 'chat-outline', component: ChatScreen },
  ]);

  const renderScene = BottomNavigation.SceneMap(
    routes.reduce((acc, route) => {
      acc[route.key] = route.component;
      return acc;
    }, {} as { [key: string]: React.ComponentType<any> })
  );

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      barStyle={{ backgroundColor: theme.colors.surface }}
      sceneAnimationEnabled={true}
      sceneAnimationType="opacity"
    />
  );
}