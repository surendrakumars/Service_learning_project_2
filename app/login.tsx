import { router } from 'expo-router';
import LoginScreen from './LoginScreen';

export default function Login() {
  const handleLoginSuccess = () => {
    router.replace('/(tabs)');
  };

  return <LoginScreen onLogin={handleLoginSuccess} />;
}