import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

const UserManagementContent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPasswordEmail, setNewPasswordEmail] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const hiddenEmail = 'surendrakumars7401@gmail.com';

  const handleCreateUser = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing Fields', 'Name, email, and password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'admin',
      });

      if (response.success) {
        Alert.alert('User Created', `User ${email.trim().toLowerCase()} created successfully.`);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Create Failed', response.error || 'Could not create user.');
      }
    } catch {
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.getUsers();
      if (response.success) {
        const list = (response.data ?? [])
          .filter(item => item.email.toLowerCase() !== hiddenEmail)
          .map(item => ({ id: item.id, name: item.name, email: item.email }));
        setUsers(list);
      } else {
        Alert.alert('Load Failed', response.error || 'Could not load users.');
      }
    } catch {
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAdminReset = async () => {
    if (!newPasswordEmail.trim() || !newPasswordValue) {
      Alert.alert('Missing Fields', 'Email and new password are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.adminResetPassword(
        newPasswordEmail.trim().toLowerCase(),
        newPasswordValue
      );
      if (response.success) {
        Alert.alert('Password Reset', response.data?.message ?? 'Password reset successfully.');
        setNewPasswordEmail('');
        setNewPasswordValue('');
        fetchUsers();
      } else {
        Alert.alert('Reset Failed', response.error || 'Could not reset password.');
      }
    } catch {
      Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <Text style={styles.subtitle}>All existing accounts (hidden: {hiddenEmail}).</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        refreshing={loadingUsers}
        onRefresh={fetchUsers}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loadingUsers ? 'Loading users...' : 'No users available.'}
          </Text>
        }
        style={styles.userList}
      />

      <View style={styles.sectionDivider} />

      <Text style={styles.title}>Create User</Text>
      <Text style={styles.subtitle}>Admins can add other admin accounts.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Temporary password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleCreateUser} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Creating...' : 'Create User'}</Text>
      </TouchableOpacity>

      <View style={styles.sectionDivider} />

      <Text style={styles.title}>Reset User Password</Text>
      <Text style={styles.subtitle}>Admins can reset any user password.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>User Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={newPasswordEmail}
          onChangeText={setNewPasswordEmail}
          editable={!loading}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="New password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={newPasswordValue}
          onChangeText={setNewPasswordValue}
          editable={!loading}
        />
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAdminReset} disabled={loading}>
        <Text style={styles.submitButtonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(22),
    paddingTop: verticalScale(28),
  },
  title: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#111827',
    marginBottom: verticalScale(6),
  },
  subtitle: {
    fontSize: normalize(13),
    color: '#6B7280',
    marginBottom: verticalScale(20),
  },
  userList: {
    maxHeight: verticalScale(220),
    marginBottom: verticalScale(10),
  },
  userRow: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(8),
  },
  userName: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#111827',
  },
  userEmail: {
    fontSize: normalize(12),
    color: '#6B7280',
  },
  emptyText: {
    fontSize: normalize(12),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  inputGroup: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: verticalScale(8),
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: horizontalScale(14),
    paddingVertical: verticalScale(10),
    fontSize: normalize(14),
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: verticalScale(24),
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: verticalScale(14),
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(16),
    fontWeight: '700',
  },
});

export default UserManagementContent;
