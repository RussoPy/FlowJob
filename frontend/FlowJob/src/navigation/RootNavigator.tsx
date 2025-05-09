// src/navigation/RootNavigator.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { AppTheme } from '../styles/theme';
import { auth } from '../api/firebase'; // Make sure to import 'auth' from your firebase config
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged

const RootNavigator = () => {
  const theme = useTheme<AppTheme>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    setIsLoadingAuth(true); // Start loading
    
    // Use the actual Firebase Auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set to true if user exists, false otherwise
      setIsLoadingAuth(false); // Finish loading once auth state is known
    });

    // Clean up the subscription on component unmount
    return unsubscribe;

  }, []);

  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};

export default RootNavigator;