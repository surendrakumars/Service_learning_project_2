import React, { useMemo, useState } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from '../utils/responsive';

const ResetPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialEmail = useMemo(() => {
    const emailParam = params?.email;
    return typeof emailParam === 'string' ? emailParam : '';
  }, [params]);

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendToken = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert('Enter Email', 'Please enter your email to request a reset token.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.forgotPassword(normalizedEmail);
      if (response.success) {
        const message = response.data?.message ?? 'If your account exists, a reset token has been generated.';
        const tokenFromServer = response.data?.token;
        if (tokenFromServer) {
          Alert.alert('Reset Token', `${message}\n\nToken: ${tokenFromServer}`);
          setToken(tokenFromServer);
        } else {
          Alert.alert('Reset Requested', message);
        }
      } else {
        Alert.alert('Request Failed', response.error || 'Could not process forgot password request.');
      }
    } catch {
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const cleanToken = token.trim();
    if (!cleanToken) {
      Alert.alert('Enter Token', 'Please enter the reset token.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Weak Password', 'Please enter a password with at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.resetPassword(cleanToken, newPassword);
      if (response.success) {
        Alert.alert('Password Updated', response.data?.message ?? 'Your password has been updated.');
        router.replace('/login');
      } else {
        Alert.alert('Reset Failed', response.error || 'Could not reset your password.');
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Request a token and set a new password.</Text>

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

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSendToken} disabled={loading}>
            <Text style={styles.secondaryButtonText}>
              {loading ? 'Please wait...' : 'Send Reset Token'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Reset Token</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Paste the token"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              value={token}
              onChangeText={setToken}
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Confirm new password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!loading}
            />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleResetPassword} disabled={loading}>
            <Text style={styles.primaryButtonText}>
              {loading ? 'Updating...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/login')} disabled={loading}>
            <Text style={styles.linkText}>Back to login</Text>
          </TouchableOpacity>
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
    paddingTop: verticalScale(30),
  },
  title: {
    fontSize: normalize(26),
    fontWeight: '700',
    color: '#111827',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: normalize(14),
    color: '#6B7280',
    marginBottom: verticalScale(24),
  },
  inputWrapper: { width: '100%', marginBottom: verticalScale(18) },
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
  primaryButton: {
    width: '100%',
    backgroundColor: '#2563EB',
    paddingVertical: verticalScale(15),
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#2DD4BF',
    alignItems: 'center',
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#FBBF24',
    paddingVertical: verticalScale(12),
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: verticalScale(18),
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: normalize(14),
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: verticalScale(18),
  },
  linkText: {
    color: '#2563EB',
    fontSize: normalize(14),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;
