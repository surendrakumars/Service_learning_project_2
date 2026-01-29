import React, { useState } from 'react';
import LoadingScreen from './LoadingScreen';
import LoginScreen from './LoginScreen';
import DashboardScreenContainer from './DashboardScreenContainer';
import SignOutScreen from './SignOutScreen'; // Import the new screen

export default function App() {
  // 1. Add 'signout' to the allowed screens
  const [currentScreen, setCurrentScreen] = useState<'loading' | 'login' | 'dashboard' | 'signout'>('loading');

  if (currentScreen === 'loading') {
    return <LoadingScreen onFinish={() => setCurrentScreen('login')} />;
  }
  
  if (currentScreen === 'login') {
    return <LoginScreen onLogin={() => setCurrentScreen('dashboard')} />;
  }

  // 2. Handle the Dashboard screen logic (passing the logout handler)
  if (currentScreen === 'dashboard') {
    return <DashboardScreenContainer onLogout={() => setCurrentScreen('signout')} />;
  }

  // 3. Handle the SignOut screen logic (redirecting back to loading)
  if (currentScreen === 'signout') {
    return <SignOutScreen onSignOut={() => setCurrentScreen('loading')} />;
  }

  return null;
}