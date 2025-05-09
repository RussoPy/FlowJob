// src/screens/RoleScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Button as PaperButton, Text as PaperText } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '../navigation/AuthNavigator';
import { AppTheme, useAppTheme } from '../styles/theme';

type RoleScreenProps = NativeStackScreenProps<AuthStackParamList, 'RoleScreen'>;

const RoleScreen = ({ navigation }: RoleScreenProps) => {
    const theme = useAppTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleRoleSelection = (role: 'worker' | 'business') => {
        navigation.navigate('Register', { role }); // Pass role as a parameter
    };

    const styles = makeStyles(theme);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.header}>
                <PaperText variant="headlineLarge" style={styles.headerText}>
                    ברוכים הבאים!
                </PaperText>
                <PaperText variant="bodyMedium" style={styles.subHeaderText}>
                    בחר את סוג המשתמש שלך כדי להמשיך.
                </PaperText>
            </View>

            <View style={styles.buttonsContainer}>
                <PaperButton
                    mode="contained"
                    onPress={() => handleRoleSelection('worker')}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    אני מחפש עבודה
                </PaperButton>
                <PaperButton
                    mode="contained"
                    onPress={() => handleRoleSelection('business')}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                >
                    אני עסק / מחפש עובדים
                </PaperButton>
            </View>
        </Animated.View>
    );
};

const makeStyles = (theme: AppTheme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: theme.spacing.l,
            backgroundColor: theme.colors.background,
        },
        header: {
            marginBottom: theme.spacing.xl,
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
        buttonsContainer: {
            width: '100%',
            maxWidth: 400,
        },
        button: {
            marginTop: theme.spacing.m,
        },
        buttonContent: {
            paddingVertical: theme.spacing.s,
        },
    });

export default RoleScreen;