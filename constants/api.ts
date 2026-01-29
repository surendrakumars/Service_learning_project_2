import { Platform } from 'react-native';

/**
 * Set this to your computer's IP when testing on a PHYSICAL device.
 * Find it: ipconfig (Windows) or ifconfig (Mac) - look for IPv4 like 192.168.1.x
 * Leave empty for emulator/simulator.
 */
const PHYSICAL_DEVICE_IP = ''; // e.g. '192.168.1.5'

const API_PORT = '3001';

const getApiHost = () => {
  if (PHYSICAL_DEVICE_IP) return PHYSICAL_DEVICE_IP;
  if (Platform.OS === 'android') return '10.0.2.2'; // Android emulator
  return 'localhost'; // iOS simulator, web
};

export const API_BASE_URL = `http://${getApiHost()}:${API_PORT}/api`;
