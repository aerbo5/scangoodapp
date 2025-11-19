import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, TextInput, Alert } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const AccountScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, Miami, FL 33101',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert(t('profile.success'), t('profile.accountUpdated'));
  };

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('profile')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t('profile.accountInfo')}</Text>

          {/* Profile Photo Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <View style={styles.profileIconInner}>
                  {/* Head */}
                  <View style={styles.profileHead} />
                  {/* Shoulders */}
                  <View style={styles.profileShoulders} />
                </View>
              </View>
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>{t('profile.changePhoto')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('profile.fullName')}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={userInfo.name}
                  onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
                  placeholder={t('profile.enterName')}
                />
              ) : (
                <View style={styles.inputDisplay}>
                  <Text style={styles.inputText}>{userInfo.name}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('profile.email')}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={userInfo.email}
                  onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
                  placeholder={t('profile.enterEmail')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <View style={styles.inputDisplay}>
                  <Text style={styles.inputText}>{userInfo.email}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('profile.phone')}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={userInfo.phone}
                  onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
                  placeholder={t('profile.enterPhone')}
                  keyboardType="phone-pad"
                />
              ) : (
                <View style={styles.inputDisplay}>
                  <Text style={styles.inputText}>{userInfo.phone}</Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('profile.address')}</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={userInfo.address}
                  onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
                  placeholder={t('profile.enterAddress')}
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <View style={styles.inputDisplay}>
                  <Text style={styles.inputText}>{userInfo.address}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>{t('profile.cancel')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Text style={styles.editButtonText}>{t('profile.edit')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  container: {
    padding: Spacing.lg,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backButtonText: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xl,
    letterSpacing: 0.5,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileIconInner: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileHead: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3.5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    marginBottom: 5,
  },
  profileShoulders: {
    width: 56,
    height: 28,
    borderLeftWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    borderColor: Colors.primary,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'transparent',
  },
  changePhotoButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  changePhotoText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputDisplay: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  inputText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  buttonSection: {
    gap: Spacing.md,
  },
  editButton: {
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  saveButton: {
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cancelButton: {
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccountScreen;

