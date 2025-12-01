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
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 249, 244, 0.85)', // Açık yeşil overlay - backgroundGreen ile uyumlu
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoImage: {
    width: 140,
    height: 140,
    marginBottom: Spacing.lg,
  },
  appName: {
    ...Typography.titleLarge,
    fontFamily: 'Sansita One', // Custom font for brand name
    fontSize: 42,
    color: Colors.primary,
    textTransform: 'capitalize',
    marginTop: Spacing.md,
  },
  loginOptions: {
    width: '100%',
    maxWidth: 400,
    gap: Spacing.md,
  },
  welcomeText: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  subtitleText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  phoneInputContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  phoneInput: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: Spacing.xl,
    ...Typography.body,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  squareLoginButton: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  squareLoginButtonPressed: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    transform: [{ scale: 0.95 }],
  },
  phoneIcon: {
    fontSize: 40,
  },
  googleButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  appleButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
});

export default LoginScreen;

