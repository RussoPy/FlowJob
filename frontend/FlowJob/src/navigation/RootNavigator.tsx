// src/navigation/RootNavigator.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper'; // Import useTheme and ActivityIndicator from Paper
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { AppTheme } from '../styles/theme'; // Import your theme type

// Import your actual authentication logic here
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { firebaseApp } from '../api/firebase';

const RootNavigator = () => {
  const theme = useTheme<AppTheme>(); // Use the theme hook with your type
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Explicit loading state

  useEffect(() => {
    setIsLoadingAuth(true); // Start loading
    // Simulate checking auth status (REPLACE with real logic)
    const timer = setTimeout(() => {
      const userIsLoggedIn = false; // <-- Replace with your actual check
      setIsAuthenticated(userIsLoggedIn);
      setIsLoadingAuth(false); // Finish loading
    }, 1500);

    return () => clearTimeout(timer);

    /*
    // Example with Firebase Auth:
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoadingAuth(false); // Finish loading once auth state is known
    });
    return unsubscribe;
    */
  }, []);

  // Show loading indicator while checking auth *or* if fonts are loading (handled in App.tsx)
  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        {/* Use Paper's ActivityIndicator and theme colors */}
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;