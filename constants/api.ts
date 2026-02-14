import { Platform } from 'react-native';

const EXPLICIT_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
const LOCAL_IP = process.env.EXPO_PUBLIC_API_HOST;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT || '3001';
const isAndroid = Platform.OS === 'android';
const resolvedHost = isAndroid
  ? LOCAL_IP || '10.0.2.2'
  : LOCAL_IP;

export const API_BASE_URL = EXPLICIT_BASE_URL
  ? EXPLICIT_BASE_URL.replace(/\/+$/, '')
  : resolvedHost
    ? `http://${resolvedHost}:${API_PORT}`
    : (() => {
        console.warn('[API Config] EXPO_PUBLIC_API_BASE_URL and EXPO_PUBLIC_API_HOST are not set; using fallback http://10.0.2.2. Set EXPO_PUBLIC_API_BASE_URL for deployed backends.');
        return `http://10.0.2.2:${API_PORT}`;
      })();

// Console log ONCE at startup showing resolved API_BASE_URL
console.log(`[API Config] Resolved API_BASE_URL: ${API_BASE_URL}`);
