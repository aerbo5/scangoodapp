import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Animated, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import { sendVerificationCode, verifyPhoneCode } from '../services/authService';
import { createUserProfile, getUserProfile } from '../services/firestoreService';

const PhoneLoginScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [phoneCode, setPhoneCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...phoneCode];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setPhoneCode(newCode);
      // Focus on last filled input
      const lastFilledIndex = Math.min(index + pastedCode.length - 1, 5);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }
      return;
    }

    const newCode = [...phoneCode];
    newCode[index] = value;
    setPhoneCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && !phoneCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const [confirmation, setConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async (phoneNumber) => {
    try {
      setIsLoading(true);
      const conf = await sendVerificationCode(phoneNumber);
      setConfirmation(conf);
    } catch (error) {
      Alert.alert(t('login.error'), error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Note: In a real app, phone number should come from previous screen
  // For now, we'll send code when user enters it manually
  // React.useEffect(() => {
  //   const phoneNumber = '+1234567890';
  //   handleSendCode(phoneNumber);
  // }, []);

  const handleVerify = async () => {
    const code = phoneCode.join('');
    if (code.length !== 6) {
      Alert.alert(t('login.error'), t('login.invalidCode'));
      return;
    }

    try {
      setIsLoading(true);
      
      // If Firebase is configured and confirmation exists, verify with Firebase
      if (confirmation) {
        try {
          const user = await verifyPhoneCode(confirmation, code);
          
          // Check if user profile exists, if not create one
          let userProfile = await getUserProfile(user.uid);
          if (!userProfile) {
            userProfile = await createUserProfile(user.uid, {
              phoneNumber: user.phoneNumber,
              displayName: user.displayName || 'User',
              email: user.email || '',
            });
          }
          
          Alert.alert(t('login.success'), t('login.codeVerified'), [
            { text: t('common.continue'), onPress: () => onNavigate('home') }
          ]);
        } catch (error) {
          Alert.alert(t('login.error'), error.message || t('login.invalidCode'));
        }
      } else {
        // Mock verification for testing (Firebase not configured)
        // In production, this should not happen
        console.log('Mock verification - Firebase not configured');
        Alert.alert(t('login.success'), t('login.codeVerified'), [
          { text: t('common.continue'), onPress: () => onNavigate('home') }
        ]);
      }
    } catch (error) {
      console.error('Verify error:', error);
      Alert.alert(t('login.error'), error.message || t('login.invalidCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      // In a real app, get phone number from previous screen or state
      // For now, show a message
      Alert.alert(
        t('login.codeSent'),
        'A new verification code has been sent to your phone.',
        [{ text: 'OK' }]
      );
      
      // If you have phone number, uncomment this:
      // const phoneNumber = '+1234567890'; // Get from props or state
      // const conf = await sendVerificationCode(phoneNumber);
      // setConfirmation(conf);
    } catch (error) {
      Alert.alert(t('login.error'), error.message || 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => onNavigate('login')}
        >
          <Text style={styles.backButtonText}>← {t('common.back')}</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{t('login.enterCode')}</Text>
          <Text style={styles.subtitle}>{t('login.codeSent')}</Text>

          <View style={styles.codeContainer}>
            {phoneCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit && styles.codeInputFilled
                ]}
                value={digit}
                onChangeText={(value) => handleCodeChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.verifyButton,
              phoneCode.join('').length === 6 && styles.verifyButtonActive,
              isLoading && styles.verifyButtonDisabled
            ]}
            onPress={handleVerify}
            disabled={phoneCode.join('').length !== 6 || isLoading}
          >
            <Text style={[
              styles.verifyButtonText,
              phoneCode.join('').length === 6 && styles.verifyButtonTextActive
            ]}>
              {t('login.verify')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={handleResendCode}
            disabled={isLoading}
          >
            <Text style={styles.resendText}>{t('login.resendCode')}</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    padding: Spacing.xl,
  },
  backButton: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  backButtonText: {
    ...Typography.bodyBold,
    fontSize: 16,
    color: Colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.titleMedium,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl * 2,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl * 2,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    ...Typography.titleMedium,
    fontSize: 24,
    color: Colors.text,
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundGreen,
  },
  verifyButton: {
    width: '100%',
    maxWidth: 378,
    height: 61,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  verifyButtonActive: {
    backgroundColor: Colors.primary,
  },
  verifyButtonText: {
    ...Typography.bodyBold,
    fontSize: 18,
    color: Colors.textSecondary,
  },
  verifyButtonTextActive: {
    color: Colors.white,
  },
  verifyButtonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  resendButton: {
    padding: Spacing.md,
  },
  resendText: {
    ...Typography.body,
    color: Colors.primary,
    textAlign: 'center',
  },
});

export default PhoneLoginScreen;

