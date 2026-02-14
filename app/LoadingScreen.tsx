import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, StatusBar } from 'react-native';

interface LoadingScreenProps {
  onFinish: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 5000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.title}>Cambridge Little Kids</Text>
      <View style={styles.logoCircle} />
      <ActivityIndicator size="large" color="#000000" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563EB', marginBottom: 30, textAlign: 'center' },
  logoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#2563EB', borderWidth: 8, borderColor: '#FBBF24', marginBottom: 40 },
  loader: { transform: [{ scale: 1.2 }] },
});

export default LoadingScreen;
