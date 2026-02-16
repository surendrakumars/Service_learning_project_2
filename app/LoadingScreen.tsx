import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, StatusBar, Image } from 'react-native';

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
      <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
      <Text style={styles.title}>Cambridge Little Kids</Text>
      <ActivityIndicator size="large" color="#000000" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  logoImage: { width: 180, height: 180, marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2563EB', marginBottom: 30, textAlign: 'center' },
  loader: { transform: [{ scale: 1.2 }] },
});

export default LoadingScreen;
