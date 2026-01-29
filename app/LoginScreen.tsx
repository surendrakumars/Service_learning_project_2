import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView, Platform,
  SafeAreaView,
  StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { api } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await api.login(email.trim(), password);
      if (result.ok) {
        onLogin();
      } else {
        Alert.alert('Login Failed', result.error);
      }
    } catch {
      Alert.alert('Login Failed', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1, width: '100%' }}>
        <View style={styles.contentWrapper}>
          <Text style={styles.headerTitle}>Cambridge Kids Pre School</Text>
          <View style={styles.formContainer}>
            <Text style={styles.heading}>Log in</Text>
            <Text style={styles.subtext}>Hi! Welcome</Text>
            
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput style={styles.inputField} placeholder="Enter Your Email" placeholderTextColor="#9CA3AF" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} editable={!loading} />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput style={styles.passwordInput} placeholder="Enter Your Password" placeholderTextColor="#9CA3AF" secureTextEntry={!passwordVisible} value={password} onChangeText={setPassword} editable={!loading} />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                   <Text style={{fontSize: normalize(20)}}>{passwordVisible ? "👁️" : "👁️‍🗨️"}</Text> 
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgotten your password ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  contentWrapper: { flex: 1, paddingHorizontal: horizontalScale(30), paddingTop: verticalScale(20), alignItems: 'center' },
  headerTitle: { fontSize: normalize(18), fontWeight: '700', color: '#2563EB', marginTop: verticalScale(20), marginBottom: verticalScale(60) },
  formContainer: { width: '100%', alignItems: 'center' },
  heading: { fontSize: normalize(28), fontWeight: 'bold', color: '#111827', marginBottom: verticalScale(10) },
  subtext: { fontSize: normalize(18), color: '#6B7280', marginBottom: verticalScale(40) },
  inputWrapper: { width: '100%', marginBottom: verticalScale(25) },
  label: { fontSize: normalize(14), fontWeight: '700', color: '#1F2937', marginBottom: verticalScale(8) },
  inputField: { width: '100%', borderBottomWidth: 1.5, borderBottomColor: '#D1D5DB', fontSize: normalize(16), paddingVertical: verticalScale(8), color: '#374151' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: '#D1D5DB' },
  passwordInput: { flex: 1, fontSize: normalize(16), paddingVertical: verticalScale(8), color: '#374151' },
  button: { width: '100%', backgroundColor: '#2563EB', paddingVertical: verticalScale(15), borderRadius: 50, borderWidth: 2, borderColor: '#2DD4BF', alignItems: 'center', marginTop: verticalScale(20), marginBottom: verticalScale(25), elevation: 8 },
  buttonText: { color: '#FFFFFF', fontSize: normalize(18), fontWeight: 'bold' },
  forgotText: { color: '#F59E0B', fontSize: normalize(14), fontWeight: '600', textDecorationLine: 'underline' },
});

export default LoginScreen;