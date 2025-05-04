// src/screens/RegisterScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Easing, ScrollView, StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  Text as PaperText,
  Switch as PaperSwitch,
  ActivityIndicator as PaperActivityIndicator,
  useTheme,
  HelperText // Import HelperText for validation messages
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// --- Firebase ---
import { auth, db } from '../api/firebase'; // Ensure db is exported from firebase.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
  serverTimestamp,
} from 'firebase/firestore';

// --- Navigation Types ---
import { AuthStackParamList } from '../navigation/AuthNavigator'; // Adjust path if needed
// If Register screen can receive params like 'phone', add them here:
// type RegisterScreenRouteProp = RouteProp<AuthStackParamList, 'Register'>;
type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;


export default function RegisterScreen({ navigation /*, route */ }: RegisterScreenProps) {
  // const { phone } = route.params; // Example: Get phone from route params if passed
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Add logic if needed
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null); // Track username availability check

  // --- Input Validation States ---
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // --- Animations ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Same animation logic as Login
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);


  // --- Validation Logic ---
  const validateForm = async (): Promise<boolean> => {
    let valid = true;
    const newErrors: { [key: string]: string | null } = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    if (email !== confirmEmail) {
      newErrors.confirmEmail = 'Emails do not match';
      valid = false;
    }
    if (!username || username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      valid = false;
    } else {
        // Check username availability only if format is okay
        setLoading(true); // Show loading indicator during check
        try {
            const snap = await getDocs(query(collection(db, 'users'), where('username', '==', username.toLowerCase())));
            if (!snap.empty) {
                newErrors.username = 'Username already taken';
                valid = false;
                setUsernameAvailable(false);
            } else {
                 setUsernameAvailable(true);
            }
        } catch (e) {
             console.error("Username check failed:", e);
             newErrors.username = 'Error checking username'; // Or a generic error
             valid = false;
             setUsernameAvailable(false);
        } finally {
             setLoading(false);
        }
    }
    if (!firstName) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
     if (!lastName) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };


  // --- Registration Handler ---
  const handleRegister = async () => {
    if (!(await validateForm())) {
       Toast.show({ type: 'error', text1: 'Please fix the errors above' });
       return;
    }

    setLoading(true);
    try {
      // Create auth user
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // Force token refresh (good practice before Firestore write with rules)
      await user.getIdToken(true);

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        firstName,
        lastName,
        phone: 'PHONE_NUMBER_PLACEHOLDER', // Replace with actual phone if available (e.g., from route.params)
        profileComplete: false, // Or set based on whether onboarding follows
        liked_jobs: [],
        matched_jobs: [],
        disliked_jobs: {}, // Consider if Map is better than Object here
        createdAt: serverTimestamp(), // Use serverTimestamp
        // Add any other default fields
      });

      Toast.show({ type: 'success', text1: 'Account created 🎉' });
   
       navigation.replace('Login'); // Keep original navigation for now
    } catch (err: any) {
      console.error("Registration Error:", err);
      let message = 'Error creating account.';
       if (err.code === 'auth/email-already-in-use') {
           message = 'This email is already registered.';
           setErrors(prev => ({ ...prev, email: message })); // Mark email field
       } else if (err.code) {
           message = `Registration failed: ${err.code}`; // Or map more codes
       }
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: message });
    } finally {
      setLoading(false);
    }
  };

  // Helper to render TextInput with error message
  const renderInput = (
      label: string,
      value: string,
      setter: (text: string) => void,
      key: string, // Key for the errors object
      secure: boolean = false,
      keyboardType: 'default' | 'email-address' | 'numeric' | 'phone-pad' = 'default',
      autoCapitalize: 'none' | 'sentences' | 'words' | 'characters' = 'words'
  ) => (
       <View>
           <PaperTextInput
               label={label}
               value={value}
               onChangeText={setter}
               mode="outlined"
               style={styles.input}
               secureTextEntry={secure && !showPassword}
               keyboardType={keyboardType}
               autoCapitalize={autoCapitalize}
               error={!!errors[key]} // Show error indicator if error exists
               theme={{ roundness: theme.roundness }}
                right={ (key === 'password' || key === 'confirmPassword') ?
                    <PaperTextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showPassword)}
                        color={theme.colors.onSurfaceVariant}
                    /> : undefined
                }
           />
           {errors[key] && <HelperText type="error" visible={!!errors[key]}>{errors[key]}</HelperText> }
       </View>
   );


  // --- Render ---
  return (
    <Animated.ScrollView
      style={[styles.scrollView, { backgroundColor: theme.colors.background, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <PaperText variant="headlineLarge" style={{ color: theme.colors.primary, textAlign: 'center' }}>
          Create Account
        </PaperText>
        <PaperText variant="bodyMedium" style={{ color: theme.colors.onSurface, textAlign: 'center', marginTop: 8 }}>
          Join the fun, find your match 🎯
        </PaperText>
      </View>

      {/* Form */}
      <View style={styles.form}>
         {renderInput('First Name', firstName, setFirstName, 'firstName')}
         {renderInput('Last Name', lastName, setLastName, 'lastName')}
         {renderInput('Username', username, setUsername, 'username', false, 'default', 'none')}
         {/* You could add an indicator for username check result here */}
         {renderInput('Email', email, setEmail, 'email', false, 'email-address', 'none')}
         {renderInput('Confirm Email', confirmEmail, setConfirmEmail, 'confirmEmail', false, 'email-address', 'none')}
         {renderInput('Password', password, setPassword, 'password', true, 'default', 'none')}
         {renderInput('Confirm Password', confirmPassword, setConfirmPassword, 'confirmPassword', true, 'default', 'none')}

         {/* Removed password toggle button as it's integrated into TextInput */}

        {/* Remember Me & Loading */}
        <View style={styles.optionsRow}>
           <View style={styles.switchContainer}>
               <PaperSwitch
                   value={rememberMe}
                   onValueChange={setRememberMe}
                   color={theme.colors.primary}
               />
               <PaperText variant='bodyMedium' style={{ marginLeft: 8, color: theme.colors.onSurface }}>Remember Me</PaperText>
           </View>
           {/* Show main loading indicator near button instead */}
       </View>

        {/* Register Button */}
        <PaperButton
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Register
        </PaperButton>
      </View>

      {/* Login Link */}
      <View style={styles.footer}>
        <PaperText variant='bodyMedium' style={{ color: theme.colors.onSurface }}>
          Already have an account?{' '}
          <PaperText
            onPress={() => !loading && navigation.navigate('Login')}
            style={{ color: theme.colors.secondary, fontWeight: 'bold' }}
          >
            Login
          </PaperText>
        </PaperText>
      </View>

    </Animated.ScrollView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
   scrollView: {
       flex: 1,
   },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24, // Consistent padding
    paddingVertical: 32, // More padding top/bottom
    justifyContent: 'center',
  },
  header: {
    marginBottom: 24, // Adjust spacing
    alignItems: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    // Remove marginBottom here, let HelperText handle spacing
    backgroundColor: 'transparent',
  },
   optionsRow: {
       flexDirection: 'row',
       alignItems: 'center',
       // Remove justifyContent, loading indicator moved
       marginVertical: 16, // Add vertical margin
       minHeight: 40,
   },
   switchContainer: {
       flexDirection: 'row',
       alignItems: 'center',
   },
  button: {
    marginTop: 16, // Adjust spacing
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  }
});