import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api, persistSession } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from '../utils/responsive';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      const token = response.data?.token;
      const role = response.data?.user.role;

      if (response.success && token && role) {
        await persistSession(token, role);
        onLogin();
      } else {
        Alert.alert(
          'Login Failed',
          response.error || 'Invalid email or password'
        );
      }
    } catch (err) {
      Alert.alert(
        'Login Error',
        'Could not connect to the server. Please check your network and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert('Enter Email', 'Please enter your email first, then tap Forgot password.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.forgotPassword(normalizedEmail);
      if (response.success) {
        Alert.alert(
          'Reset Requested',
          'If your account exists, a password reset request has been created.'
        );
      } else {
        Alert.alert('Request Failed', response.error || 'Could not process forgot password request.');
      }
    } catch {
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <View style={styles.contentWrapper}>
          <Text style={styles.headerTitle}>Cambridge Little Kids</Text>

          <View style={styles.formContainer}>
            <Text style={styles.heading}>Log in</Text>
            <Text style={styles.subtext}>Hi! Welcome</Text>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Enter Your Email"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter Your Password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />

                <TouchableOpacity
                  onPress={() => setPasswordVisible(v => !v)}
                  disabled={loading}
                >
                  <Text style={styles.eyeText}>
                    {passwordVisible ? 'SHOW' : 'HIDE'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Logging In...' : 'Log In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
              <Text style={styles.forgotText}>Forgotten your password?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: horizontalScale(30),
    paddingTop: verticalScale(20),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: '#2563EB',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(60),
  },
  formContainer: { width: '100%', alignItems: 'center' },
  heading: {
    fontSize: normalize(28),
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: verticalScale(10),
  },
  subtext: {
    fontSize: normalize(18),
    color: '#6B7280',
    marginBottom: verticalScale(40),
  },
  inputWrapper: { width: '100%', marginBottom: verticalScale(25) },
  label: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(8),
  },
  inputField: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: '#D1D5DB',
    fontSize: normalize(16),
    paddingVertical: verticalScale(8),
    color: '#374151',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#D1D5DB',
  },
  passwordInput: {
    flex: 1,
    fontSize: normalize(16),
    paddingVertical: verticalScale(8),
    color: '#374151',
  },
  eyeText: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#2563EB',
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: verticalScale(15),
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#2DD4BF',
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(25),
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#F59E0B',
    fontSize: normalize(14),
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

