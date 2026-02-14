import { router } from 'expo-router';
import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    router.replace('/login');
  }, []);

  return null;
}
