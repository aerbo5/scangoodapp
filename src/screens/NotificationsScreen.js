import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Switch } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../constants';
import { useLanguage } from '../context/LanguageContext';

const NotificationsScreen = ({ onNavigate, fadeAnim }) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    priceAlerts: true,
    newDeals: true,
    weeklySummary: false,
    storeUpdates: true,
    marketing: false,
  });

  const toggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const notificationItems = [
    { key: 'pushNotifications', label: t('notifications.pushNotifications'), description: t('notifications.pushNotificationsDesc') },
    { key: 'priceAlerts', label: t('notifications.priceAlerts'), description: t('notifications.priceAlertsDesc') },
    { key: 'newDeals', label: t('notifications.newDeals'), description: t('notifications.newDealsDesc') },
    { key: 'weeklySummary', label: t('notifications.weeklySummary'), description: t('notifications.weeklySummaryDesc') },
    { key: 'storeUpdates', label: t('notifications.storeUpdates'), description: t('notifications.storeUpdatesDesc') },
    { key: 'marketing', label: t('notifications.marketing'), description: t('notifications.marketingDesc') },
  ];

  return (
    <Animated.View style={[styles.screenContainer, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate('profile')}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{t('profile.notifications')}</Text>
          <Text style={styles.subtitle}>{t('notifications.subtitle')}</Text>

          <View style={styles.notificationsList}>
            {notificationItems.map((item) => (
              <View key={item.key} style={styles.notificationItem}>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationLabel}>{item.label}</Text>
                  <Text style={styles.notificationDescription}>{item.description}</Text>
                </View>
                <Switch
                  value={notifications[item.key]}
                  onValueChange={() => toggleNotification(item.key)}
                  trackColor={{ false: Colors.lightGray, true: Colors.primary }}
                  thumbColor={Colors.white}
                />
              </View>
            ))}
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
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  notificationsList: {
    gap: Spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  notificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  notificationDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default NotificationsScreen;




