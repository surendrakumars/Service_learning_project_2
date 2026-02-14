import { router } from 'expo-router';
import React, { useRef } from 'react';
import DashboardScreenContainer from '../DashboardScreenContainer';
import { clearAuthToken, getSessionRole } from '../../lib/api';

export default function DashboardIndex() {
  const role = getSessionRole() ?? 'staff';
  const isLoggingOutRef = useRef(false);

  const handleLogout = async () => {
    if (isLoggingOutRef.current) {
      return;
    }
    isLoggingOutRef.current = true;
    await clearAuthToken();
    router.replace('/login');
  };

  return <DashboardScreenContainer onLogout={handleLogout} userRole={role} />;
}
