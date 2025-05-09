// src/navigation/AppNavigator.tsx

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import WorkerProfileNavigator from './WorkerProfileNavigator'; // Import WorkerProfileNavigator
import BusinessProfileNavigator from './BusinessProfileNavigator'; // Import BusinessProfileNavigator
import { auth, db } from '../api/firebase'; // Import auth and db
import { doc, onSnapshot, DocumentSnapshot } from 'firebase/firestore'; // Import doc, onSnapshot, and DocumentSnapshot
import { useAppTheme, AppTheme } from '../styles/theme'; // Import theme for loading indicator
import { Text as PaperText } from 'react-native-paper'; // Import PaperText for the error message

// Define your params for the AppNavigator stack
export type AppStackParamList = {
  WorkerProfileSetupFlow: undefined; // Route for worker profile setup
  BusinessProfileSetupFlow: undefined; // Route for business profile setup
  Home: undefined;
  // ... any other main app screens
};

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const theme = useAppTheme();
  // State to hold profile completion status and user role
  // Initialize as null to clearly indicate data hasn't been fetched yet
  const [userData, setUserData] = useState<{ profileComplete: boolean; role: string } | null>(null);
  const [isLoadingProfileStatus, setIsLoadingProfileStatus] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      // If for some reason user is not authenticated when AppNavigator loads,
      // which should ideally not happen due to RootNavigator's logic.
      console.error("AppNavigator loaded without an authenticated user.");
      setIsLoadingProfileStatus(false);
      // Optionally redirect to AuthNavigator or show an error
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);

    // Listen for real-time updates to the user document
    const unsubscribe = onSnapshot(userDocRef, (docSnap: DocumentSnapshot) => {

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Check if role is present and is a non-empty string
        const role = data?.role;
        const profileComplete = data?.profileComplete === true;

        if (typeof role === 'string' && role !== '') {
           // We have the role and profile completion status
           setUserData({ profileComplete, role });
           setIsLoadingProfileStatus(false); // Stop loading once we have essential data
        } else {
           // Document exists, but role is missing or invalid in this snapshot.
           // Keep isLoading true until a snapshot with valid role arrives.
           console.warn("User document found, but role is missing or invalid. Waiting for update.");
           // setUserData(null); // Keep userData null to stay in loading state
           // setIsLoadingProfileStatus(true); // Explicitly keep loading
        }

      } else {
        // This case occurs immediately after registration before setDoc completes.
        // It also occurs if a user document is genuinely missing (shouldn't happen after register).
        console.warn("User document not found for authenticated user. Likely during initial write. Waiting for document.");
        // Keep isLoading true until the document appears
        // setUserData(null); // Keep userData null to stay in loading state
        // setIsLoadingProfileStatus(true); // Explicitly keep loading
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      // On error, assume profile incomplete and no role, and stop loading
      setUserData({ profileComplete: false, role: '' });
      setIsLoadingProfileStatus(false);
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []); // Empty dependency array means this runs once on mount

  // Show a loading indicator while fetching user data for the first time,
  // or until we have confirmed the role is present.
  if (isLoadingProfileStatus || userData === null) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
        {/* Optional: Add a message like "Loading user data..." */}
      </View>
    );
  }

  // Conditional rendering based on profile completion and role
  if (!userData.profileComplete) {
    // Profile is NOT complete, navigate to the appropriate setup flow
    if (userData.role === 'worker') {
      console.log("AppNavigator: Navigating to Worker Profile Setup Flow");
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="WorkerProfileSetupFlow" component={WorkerProfileNavigator} />
        </Stack.Navigator>
      );
    } else if (userData.role === 'business') {
       console.log("AppNavigator: Navigating to Business Profile Setup Flow");
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BusinessProfileSetupFlow" component={BusinessProfileNavigator} />
        </Stack.Navigator>
      );
    } else {
      // This block should ideally not be reached if the onSnapshot logic works,
      // but keep it as a fallback for unexpected states.
      console.error("AppNavigator: Authenticated user has no role or an invalid role after loading:", userData.role);
      return (
         <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
           <PaperText style={{ color: theme.colors.error, textAlign: 'center' }}>
             ישנה שגיאה בנתוני המשתמש. אנא נסה להתחבר שוב.
           </PaperText>
           {/* Optionally add a button to sign out */}
         </View>
      );
    }
  } else {
    // Profile IS complete, show the main app screens
     console.log("AppNavigator: Profile complete. Navigating to Home.");
    return (
      <Stack.Navigator screenOptions={{ headerShown: true, title: 'FlowJob' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* Add other main app screens here */}
      </Stack.Navigator>
    );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

export default AppNavigator;
