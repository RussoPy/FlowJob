// src/screens/WorkerRegisterScreen.tsx

import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Easing, ScrollView, StyleSheet, I18nManager } from 'react-native';
import { useRoute } from '@react-navigation/native';
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
import { auth, db } from '../api/firebase'; //
import { createUserWithEmailAndPassword } from 'firebase/auth'; //
import { doc, setDoc, getDocs, query, collection, where, serverTimestamp } from 'firebase/firestore'; //

import { AuthStackParamList } from '../navigation/AuthNavigator';
import { AppTheme, useAppTheme } from '../styles/theme'; //
import { Worker } from '../models/workerModel'; // Import Worker interface

type WorkerRegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'WorkerRegister'>;

export default function WorkerRegisterScreen({ navigation }: WorkerRegisterScreenProps) {
  const theme = useAppTheme();
  const route = useRoute<WorkerRegisterScreenProps['route']>();

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // Removed username state: const [username, setUsername] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false); // Keep for now if logic is tied to it
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const validateField = async (field: string, value: string): Promise<string | null> => {
    if (field === 'email' && (!value || !/\S+@\S+\.\S+/.test(value))) return 'אנא הזן אימייל תקין';
    if (field === 'confirmEmail' && value.toLowerCase() !== email.toLowerCase()) return 'כתובות האימייל אינן תואמות';
    // Removed username validation
    // if (field === 'username') { ... }
    if (field === 'firstName' && !value) return 'שם פרטי הוא שדה חובה';
    if (field === 'lastName' && !value) return 'שם משפחה הוא שדה חובה';
    if (field === 'password' && (!value || value.length < 6)) return 'סיסמה חייבת להכיל לפחות 6 תווים';
    if (field === 'confirmPassword' && value !== password) return 'הסיסמאות אינן תואמות';
    return null;
  };

  const validateForm = async (): Promise<boolean> => {
    let isValid = true;
    const currentErrors: { [key: string]: string | null } = {};
    const fields = {
        email, confirmEmail, password, confirmPassword,
        firstName, lastName
    };
    for (const [key, value] of Object.entries(fields)) {
        const error = await validateField(key, value as string);
        if (error) {
            currentErrors[key] = error;
            isValid = false;
        } else {
            currentErrors[key] = null;
        }
    }
    setErrors(currentErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!(await validateForm())) {
      Toast.show({ type: 'error', text1: 'שגיאות באימות', text2: 'אנא תקן את השגיאות המודגשות.' });
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password); //
      const user = cred.user;

      // Initialize all Worker fields with default values
      const workerData: Worker = {
        id: user.uid,
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: '', // Initial empty as not collected in form
        phone: '', // Initial empty
        birth_date: null, // Initial null
        profilePictureUrl: '', // Initial empty
        headline: '', // Initial empty
        summary: '', // Initial empty
        experience_level: '', // Initial empty (assuming this is filled later)
        skills: [], // Initial empty array
        preferred_tags: [], // Initial empty array
        industry_preference: '', // Initial empty
        resumeUrl: '', // Initial empty
        portfolioUrl: '', // Initial empty
        education: '', // Initial empty
        location_lat: null, // Changed to null from undefined
        location_lng: null, // Changed to null from undefined
        job_search_radius: 0, // Initial 0
        salary_min: 0, // Initial 0
        salary_max: 0, // Initial 0
        salary_unit: '', // Initial empty
        availability: '', // Initial empty
        willing_to_relocate: false, // Initial false
        liked_jobs: [], // Initial empty array
        matched_jobs: [], // Initial empty array
        disliked_jobs: {}, // Initial empty object
        profileComplete: false, // Will be set to true after profile creation steps
        created_at: serverTimestamp(), //
        last_updated_at: serverTimestamp(), //
      };

      await setDoc(doc(db, 'users', user.uid), { //
        ...workerData,
        role: 'worker', // Explicitly set role
        username_lowercase: '', // Initial empty as not collected in form
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      Toast.show({ type: 'success', text1: 'החשבון נוצר! 🎉', text2: 'אנא התחבר כדי להמשיך.' });
      navigation.replace('Login');
    } catch (err: any) {
      console.error("Registration Error:", err.code, err.message);
      let message = 'אירעה שגיאה ביצירת החשבון.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'כתובת אימייל זו כבר רשומה.';
        setErrors(prev => ({ ...prev, email: message }));
      } else if (err.code === 'auth/weak-password') {
        message = 'הסיסמה חלשה מדי.';
        setErrors(prev => ({ ...prev, password: message }));
      } else {
        message = `ההרשמה נכשלה: ${err.message || err.code}`;
      }
      Toast.show({ type: 'error', text1: 'ההרשמה נכשלה', text2: message });
    } finally {
      setLoading(false);
    }
  };

  const styles = makeStyles(theme);

  const renderInput = (
    label: string, value: string, setter: (text: string) => void, fieldKey: keyof typeof errors,
    options: { secure?: boolean; keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
               autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
               isConfirmPassword?: boolean; maxLength?: number; multiline?: boolean; } = {}
  ) => {
    const { secure = false, keyboardType = 'default', autoCapitalize = 'words', isConfirmPassword = false, maxLength, multiline = false } = options;
    // Correctly uses the state variables for toggling password visibility
    const currentShowPasswordState = isConfirmPassword ? showConfirmPassword : showPassword;
    const currentSetShowPasswordState = isConfirmPassword ? setShowConfirmPassword : setShowPassword;

    return (
      <View style={styles.inputContainer}>
        <PaperTextInput
          label={label} value={value} onChangeText={setter}
          onBlur={async () => { const error = await validateField(fieldKey as string, value); setErrors(prev => ({ ...prev, [fieldKey]: error })); }}
          mode="outlined" style={styles.input}
          secureTextEntry={secure && !currentShowPasswordState} // Use currentShowPasswordState
          keyboardType={keyboardType} autoCapitalize={autoCapitalize} error={!!errors[fieldKey]}
          maxLength={maxLength} theme={{ roundness: theme.roundness }} multiline={multiline}
          right={
            secure ? (<PaperTextInput.Icon icon={currentShowPasswordState ? "eye-off" : "eye"} onPress={() => currentSetShowPasswordState(!currentShowPasswordState)} color={theme.colors.onSurfaceVariant} />)
            : fieldKey === 'username' && usernameLoading ? (<PaperActivityIndicator animating={true} color={theme.colors.primary} style={styles.usernameLoader}/>) // usernameLoading can be removed if username is completely gone
            : undefined
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
          צור חשבון עובד
        </PaperText>
        <PaperText variant="bodyMedium" style={styles.subHeaderText}>
          התחל את המסע שלך למצוא עבודה חלומית.
        </PaperText>
      </View>

      <View style={styles.form}>
        {renderInput('שם פרטי', firstName, setFirstName, 'firstName', { autoCapitalize: 'words', maxLength: 50 })}
        {renderInput('שם משפחה', lastName, setLastName, 'lastName', { autoCapitalize: 'words', maxLength: 50 })}
        {/* Removed username input: {renderInput('שם משתמש', username, (text) => setUsername(text.replace(/\s/g, '')), 'username', { autoCapitalize: 'none', maxLength: 20 })} */}
        {renderInput('אימייל', email, (text) => setEmail(text.replace(/\s/g, '')), 'email', { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {renderInput('אימייל שוב', confirmEmail, (text) => setConfirmEmail(text.replace(/\s/g, '')), 'confirmEmail', { keyboardType: 'email-address', autoCapitalize: 'none' })}
        {renderInput('סיסמה', password, setPassword, 'password', { secure: true, autoCapitalize: 'none' })}
        {renderInput('סיסמה שוב', confirmPassword, setConfirmPassword, 'confirmPassword', { secure: true, autoCapitalize: 'none', isConfirmPassword: true })}
      
        <View style={styles.optionsRow}>
          <View style={styles.switchContainer}>
            <PaperSwitch value={rememberMe} onValueChange={setRememberMe} color={theme.colors.primary} />
            <PaperText variant='bodyMedium' style={styles.rememberMeText}>זכור אותי</PaperText>
          </View>
        </View>

        <PaperButton
          mode="contained" onPress={handleRegister} loading={loading || usernameLoading}
          disabled={loading || usernameLoading} style={styles.button} contentStyle={styles.buttonContent}
        >
          הרשמה כעובד
        </PaperButton>
      </View>

      <View style={styles.footer}>
        <PaperText variant='bodyMedium' style={[styles.footerTextBase, { writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr' }]}>
          יש לך כבר חשבון?{' '}
          <PaperText
            onPress={() => !loading && navigation.navigate('Login')}
            style={styles.loginLink}
          >
            כניסה
          </PaperText>
        </PaperText>
      </View>
    </Animated.ScrollView>
  );
}

const makeStyles = (theme: AppTheme) => StyleSheet.create({
  animatedScroll: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, paddingHorizontal: theme.spacing.l, paddingVertical: theme.spacing.xl, justifyContent: 'center' },
  header: { marginBottom: theme.spacing.l, alignItems: 'center' },
  headerText: { color: theme.colors.primary, textAlign: 'center' },
  subHeaderText: { color: theme.colors.onSurface, textAlign: 'center', marginTop: theme.spacing.s },
  form: { width: '100%' },
  inputContainer: { marginBottom: theme.spacing.m },
  input: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  helperText: {},
  usernameLoader: { marginRight: theme.spacing.m },
  optionsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.m, minHeight: 40, justifyContent: 'flex-start' },
  switchContainer: { flexDirection: 'row', alignItems: 'center' },
  rememberMeText: {
    marginRight: I18nManager.isRTL ? theme.spacing.s : 0,
    marginLeft: !I18nManager.isRTL ? theme.spacing.s : 0,
    color: theme.colors.onSurface,
  },
  button: { marginTop: theme.spacing.m },
  buttonContent: { paddingVertical: theme.spacing.s },
  footer: { marginTop: theme.spacing.l, alignItems: 'center' },
  footerTextBase: {
    color: theme.colors.onSurface,
  },
  loginLink: { color: theme.colors.secondary, fontWeight: 'bold' }
});