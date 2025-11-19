import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, TextInput, Alert } from 'react-native';
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
      <View style={styles.loginContainer}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/image1.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Scan Good</Text>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.xl,
  },
  appName: {
    ...Typography.titleLarge,
    fontSize: 36,
    color: Colors.primary,
    textTransform: 'capitalize',
  },
  loginOptions: {
    width: '100%',
    gap: Spacing.md,
  },
  phoneInputContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  phoneInput: {
    width: '100%',
    height: 61,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: Spacing.lg,
    ...Typography.body,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  loginButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  squareLoginButton: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  squareLoginButtonPressed: {
    backgroundColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  phoneIcon: {
    fontSize: 36,
    color: Colors.white,
  },
  googleButton: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  appleButton: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
});

export default LoginScreen;

