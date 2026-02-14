import { Platform } from 'react-native';

const LOCAL_IP = process.env.EXPO_PUBLIC_API_HOST;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '3001';
const isAndroid = Platform.OS === 'android';
const resolvedHost = isAndroid
  ? LOCAL_IP || '10.0.2.2'
  : LOCAL_IP;

export const API_BASE_URL = resolvedHost
  ? `http://${resolvedHost}:${API_PORT}`
  : (() => {
      console.warn('[API Config] EXPO_PUBLIC_API_HOST is not set; using fallback http://10.0.2.2. Set EXPO_PUBLIC_API_HOST to your machine IP (e.g., 10.221.67.124) for physical devices/web.');
      return `http://10.0.2.2:${API_PORT}`;
    })();

// Console log ONCE at startup showing resolved API_BASE_URL
console.log(`[API Config] Resolved API_BASE_URL: ${API_BASE_URL}`);
