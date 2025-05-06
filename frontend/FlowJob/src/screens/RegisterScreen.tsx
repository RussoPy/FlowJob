// src/screens/RegisterScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Easing, ScrollView, StyleSheet } from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
  Text as PaperText,
  Switch as PaperSwitch,
  ActivityIndicator as PaperActivityIndicator,
  HelperText
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth, db } from '../api/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDocs, query, collection, where, serverTimestamp } from 'firebase/firestore';

import { AuthStackParamList } from '../navigation/AuthNavigator'; // Adjust path
import { AppTheme, useAppTheme } from '../styles/theme'; // Import useAppTheme

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const theme = useAppTheme(); // Use your custom typed theme hook
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const newErrorsLocal: { [key: string]: string | null } = {}; // Renamed to avoid conflict

  const validateField = async (field: string, value: string): Promise<string | null> => {
    // (Keep your existing validation logic from previous step)
    // For brevity, I'm not repeating the full validation logic here.
    // Ensure it uses newErrorsLocal to build up errors for a single validation pass.
    // Example for one field:
    if (field === 'email' && (!value || !/\S+@\S+\.\S+/.test(value))) return 'Please enter a valid email';
    if (field === 'username') {
        if (!value || value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username cannot exceed 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores.';
        
        setUsernameLoading(true);
        try {
            const snap = await getDocs(query(collection(db, 'users'), where('username_lowercase', '==', value.toLowerCase())));
            setUsernameLoading(false);
            return !snap.empty ? 'Username already taken' : null;
        } catch (e) {
            console.error("Username check failed:", e);
            setUsernameLoading(false);
            return 'Error checking username. Please try again.';
        }
    }
    // ... (rest of your validation cases)
    return null;
  };


  const validateForm = async (): Promise<boolean> => {
    let isValid = true;
    const fieldsToValidate = { firstName, lastName, username, email, confirmEmail, password, confirmPassword };
    const currentErrors: { [key: string]: string | null } = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) { currentErrors.email = 'Please enter a valid email'; isValid = false; }
    if (email.toLowerCase() !== confirmEmail.toLowerCase()) { currentErrors.confirmEmail = 'Emails do not match'; isValid = false; }
    
    // Username validation (including async check)
    if (!username || username.length < 3) {
        currentErrors.username = 'Username must be at least 3 characters'; isValid = false;
    } else if (username.length > 20) {
        currentErrors.username = 'Username cannot exceed 20 characters'; isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        currentErrors.username = 'Username can only contain letters, numbers, and underscores.'; isValid = false;
    } else {
        setUsernameLoading(true);
        try {
            const snap = await getDocs(query(collection(db, 'users'), where('username_lowercase', '==', username.toLowerCase())));
            if (!snap.empty) { currentErrors.username = 'Username already taken'; isValid = false; }
        } catch (e) {
            console.error("Username check failed:", e);
            currentErrors.username = 'Error checking username'; isValid = false;
        } finally {
            setUsernameLoading(false);
        }
    }

    if (!firstName) { currentErrors.firstName = 'First name is required'; isValid = false; }
    if (!lastName) { currentErrors.lastName = 'Last name is required'; isValid = false; }
    if (!password || password.length < 6) { currentErrors.password = 'Password must be at least 6 characters'; isValid = false; }
    if (password !== confirmPassword) { currentErrors.confirmPassword = 'Passwords do not match'; isValid = false; }
    
    setErrors(currentErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!(await validateForm())) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please fix the errors highlighted below.' });
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: email.toLowerCase().trim(),
        username: username.trim(), // Store as entered, query with lowercase
        username_lowercase: username.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: `${firstName.trim()} ${lastName.trim()}`,
        profileComplete: false,
        liked_jobs: [], matched_jobs: [], disliked_jobs: {},
        createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      Toast.show({ type: 'success', text1: 'Account Created! 🎉', text2: 'Please login to continue.' });
      navigation.replace('Login');
    } catch (err: any) {
      console.error("Registration Error:", err.code, err.message);
      let message = 'An unknown error occurred.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
        setErrors(prev => ({ ...prev, email: message }));
      } else if (err.code === 'auth/weak-password') {
        message = 'The password is too weak.';
        setErrors(prev => ({ ...prev, password: message }));
      } else {
        message = `Registration failed: ${err.message || err.code}`;
      }
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: message });
    } finally {
      setLoading(false);
    }
  };
  
  // Generate styles using the theme
  const styles = makeStyles(theme);

  const renderInput = (
    label: string,
    value: string,
    setter: (text: string) => void,
    fieldKey: keyof typeof errors,
    options: {
      secure?: boolean;
      keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
      autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
      isConfirmPassword?: boolean;
      maxLength?: number;
    } = {}
  ) => {
    const { secure = false, keyboardType = 'default', autoCapitalize = 'words', isConfirmPassword = false, maxLength } = options;
    const currentShowPassword = isConfirmPassword ? showConfirmPassword : showPassword;
    const currentSetShowPassword = isConfirmPassword ? setShowConfirmPassword : setShowPassword;

    return (
      <View style={styles.inputContainer}>
        <PaperTextInput
          label={label}
          value={value}
          onChangeText={setter}
          onBlur={async () => { // Validate on blur
             const error = await validateField(fieldKey as string, value); // Use the more granular validateField
             setErrors(prev => ({ ...prev, [fieldKey]: error }));
          }}
          mode="outlined"
          style={styles.input} // General input style (e.g. no margin if container handles it)
          secureTextEntry={secure && !currentShowPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          error={!!errors[fieldKey]}
          maxLength={maxLength}
          theme={{ roundness: theme.roundness }}
          right={
            secure ? (
              <PaperTextInput.Icon
                icon={currentShowPassword ? "eye-off" : "eye"}
                onPress={() => currentSetShowPassword(!currentShowPassword)}
                color={theme.colors.onSurfaceVariant}
              />
            ) : fieldKey === 'username' && usernameLoading ? (
                <PaperActivityIndicator animating={true} color={theme.colors.primary} style={styles.usernameLoader}/>
            ) : undefined
          }
        />
        {errors[fieldKey] && <HelperText type="error" visible={!!errors[fieldKey]} style={styles.helperText}>{errors[fieldKey]}</HelperText>}
      </View>
    );
  };

  return (
    <Animated.ScrollView
      style={[styles.animatedScroll, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <PaperText variant="headlineLarge" style={styles.headerText}>
          Create Account
        </PaperText>
        <PaperText variant="bodyMedium" style={styles.subHeaderText}>
          Join the fun, find your match 🎯
        </PaperText>
      </View>

      <View style={styles.form}>
        {renderInput('First Name', firstName, setFirstName, 'firstName', { autoCapitalize: 'words', maxLength: 50 })}
        {renderInput('Last Name', lastName, setLastName, 'lastName', { autoCapitalize: 'words', maxLength: 50 })}
        {renderInput('Username', username, (text) => setUsername(text.replace(/\s/g, '')), 'username', { autoCapitalize: 'none', maxLength: 20 })}
        {renderInput('Email', email, (text) => setEmail(text.replace(/\s/g, '')), 'email', { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {renderInput('Confirm Email', confirmEmail, (text) => setConfirmEmail(text.replace(/\s/g, '')), 'confirmEmail', { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {renderInput('Password', password, setPassword, 'password', { secure: true, autoCapitalize: 'none' })}
        {renderInput('Confirm Password', confirmPassword, setConfirmPassword, 'confirmPassword', { secure: true, autoCapitalize: 'none', isConfirmPassword: true })}

        <View style={styles.optionsRow}>
          <View style={styles.switchContainer}>
            <PaperSwitch value={rememberMe} onValueChange={setRememberMe} color={theme.colors.primary} />
            <PaperText variant='bodyMedium' style={styles.rememberMeText}>Remember Me</PaperText>
          </View>
        </View>

        <PaperButton
          mode="contained"
          onPress={handleRegister}
          loading={loading || usernameLoading} // Consider both loading states
          disabled={loading || usernameLoading}
          style={styles.button}
          contentStyle={styles.buttonContent} // For inner padding
          // labelStyle={styles.buttonLabel} // Should be handled by theme.fonts.labelLarge
        >
          Register
        </PaperButton>
      </View>

      <View style={styles.footer}>
        <PaperText variant='bodyMedium' style={{ color: theme.colors.onSurface }}>
          Already have an account?{' '}
          <PaperText
            onPress={() => !loading && navigation.navigate('Login')}
            style={styles.loginLink}
          >
            Login
          </PaperText>
        </PaperText>
      </View>
    </Animated.ScrollView>
  );
}

// Function to generate styles based on the theme
const makeStyles = (theme: AppTheme) => StyleSheet.create({
  animatedScroll: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.l, // Use theme spacing
    paddingVertical: theme.spacing.xl,   // Use theme spacing
    justifyContent: 'center',
  },
  header: {
    marginBottom: theme.spacing.l, // Use theme spacing
    alignItems: 'center',
  },
  headerText: {
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subHeaderText: {
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginTop: theme.spacing.s,
  },
  form: {
    width: '100%',
  },
  inputContainer: { // Groups TextInput and HelperText
    marginBottom: theme.spacing.m, // Spacing between each input group
  },
  input: {
    // backgroundColor: 'transparent', // Default for outlined
    // No margin here, inputContainer handles it
  },
  helperText: {
    // Default Paper styling is usually fine. Add custom if needed.
  },
  usernameLoader: {
    marginRight: theme.spacing.m, // Ensure loader inside TextInput isn't cramped
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.m, // Use theme spacing
    minHeight: 40,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMeText: {
    marginLeft: theme.spacing.s,
    color: theme.colors.onSurface,
  },
  button: {
    marginTop: theme.spacing.m, // Use theme spacing
  },
  buttonContent: {
    paddingVertical: theme.spacing.s, // Use theme spacing for inner padding
  },
  // buttonLabel: { // Should be handled by theme.fonts.labelLarge
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  footer: {
    marginTop: theme.spacing.l, // Use theme spacing
    alignItems: 'center',
  },
  loginLink: {
    color: theme.colors.secondary,
    fontWeight: 'bold',
  }
});
