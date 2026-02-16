import { router } from 'expo-router';
import React, { useRef } from 'react';
import DashboardScreenContainer from '../DashboardScreenContainer';
import { clearAuthToken, getSessionRole } from '../../lib/api';
import { Alert } from 'react-native';

export default function DashboardIndex() {
  const role = getSessionRole() ?? 'staff';
  const isLoggingOutRef = useRef(false);

  const handleLogout = async () => {
    if (isLoggingOutRef.current) {
      return;
    }
    Alert.alert('Confirm Logout', 'Do you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          isLoggingOutRef.current = true;
          await clearAuthToken();
          router.replace('/login');
          isLoggingOutRef.current = false;
        },
      },
    ]);
  };

  return <DashboardScreenContainer onLogout={handleLogout} userRole={role} />;
}
