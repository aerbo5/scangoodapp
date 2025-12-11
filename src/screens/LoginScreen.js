import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, TextInput, Alert, ImageBackground } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { onAuthStateChange } from '../services/authService';
import GoogleIcon from '../components/GoogleIcon';
import AppleIcon from '../components/AppleIcon';

const LoginScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pressedButton, setPressedButton] = useState(null);

  React.useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        onNavigate('home');
      }
    });
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handlePhoneLogin = () => {
    if (phoneNumber.trim()) {
      // Navigate to phone login screen with phone number
      // For now, just navigate - phone number will be handled in PhoneLoginScreen
      onNavigate('phoneLogin');
    } else {
      Alert.alert(t('login.error'), t('login.enterPhoneNumber'));
    }
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ImageBackground
        source={require('../assets/image1.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.loginContainer}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/image1.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Scan Good</Text>
            <Text style={styles.welcomeText}>{t('login.welcome') || 'Welcome back!'}</Text>
            <Text style={styles.subtitleText}>{t('login.subtitle') || 'Sign in to continue'}</Text>
          </View>

          {/* Login Options */}
          <View style={styles.loginOptions}>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                placeholder={t('login.phoneNumber')}
                placeholderTextColor={Colors.textSecondary}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.loginButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.squareLoginButton,
                  pressedButton === 'phone' && styles.squareLoginButtonPressed
                ]}
                onPress={handlePhoneLogin}
                onPressIn={() => setPressedButton('phone')}
                onPressOut={() => setPressedButton(null)}
              >
                <Text style={styles.phoneIcon}>📱</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.squareLoginButton,
                  styles.googleButton,
                  pressedButton === 'google' && styles.squareLoginButtonPressed
                ]}
                onPress={() => {
                  // Google login logic
                  onNavigate('home');
                }}
                onPressIn={() => setPressedButton('google')}
                onPressOut={() => setPressedButton(null)}
              >
                <GoogleIcon size={32} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.squareLoginButton,
                  styles.appleButton,
                  pressedButton === 'apple' && styles.squareLoginButtonPressed
                ]}
                onPress={() => {
                  // Apple login logic
                  onNavigate('home');
                }}
                onPressIn={() => setPressedButton('apple')}
                onPressOut={() => setPressedButton(null)}
              >
                <AppleIcon size={32} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Cleaner, brighter overlay
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.lg,
    borderRadius: 24, // Softer corners
  },
  appName: {
    ...Typography.h1,
    fontFamily: 'Sansita One',
    fontSize: 48,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  welcomeText: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  loginOptions: {
    width: '100%',
    maxWidth: 400,
    gap: Spacing.lg,
  },
  phoneInputContainer: {
    width: '100%',
  },
  phoneInput: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loginButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  squareLoginButton: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  squareLoginButtonPressed: {
    backgroundColor: Colors.primaryExtraLight,
    borderColor: Colors.primary,
    transform: [{ scale: 0.96 }],
  },
  phoneIcon: {
    fontSize: 32,
  },
  googleButton: {
    backgroundColor: Colors.white,
  },
  appleButton: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
});

export default LoginScreen;

