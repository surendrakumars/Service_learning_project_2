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
  const [loadError, setLoadError] = useState<string | null>(null);
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
    setLoadError(null);
    try {
      const response = await api.getUsers();
      if (response.success) {
        const list = (response.data ?? [])
          .filter(item => item.email.toLowerCase() !== hiddenEmail)
          .map(item => ({
            id: item.id,
            name: item.name || item.email,
            email: item.email,
          }));
        setUsers(list);
      } else {
        const err = response.error || 'Could not load users.';
        setLoadError(err);
        Alert.alert('Load Failed', err);
      }
    } catch {
      const err = 'Could not connect to the server. Please try again.';
      setLoadError(err);
      Alert.alert('Network Error', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (id: string, emailValue: string) => {
    Alert.alert('Delete User', `Delete ${emailValue}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            const response = await api.deleteUser(id);
            if (response.success) {
              Alert.alert('Deleted', 'User deleted successfully.');
              fetchUsers();
            } else {
              Alert.alert('Delete Failed', response.error || 'Could not delete user.');
            }
          } catch {
            Alert.alert('Network Error', 'Could not connect to the server. Please try again.');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
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
      <Text style={styles.helperText}>
        {loadingUsers ? 'Loading users...' : `Users loaded: ${users.length}`}
        {loadError ? ` • Error: ${loadError}` : ''}
      </Text>
      {users.length > 0 && (
        <Text style={styles.helperText}>
          Preview: {users.slice(0, 2).map(item => item.name || item.email).join(', ')}
        </Text>
      )}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        style={styles.userList}
        contentContainerStyle={users.length === 0 ? styles.emptyContainer : styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name || 'Unknown User'}</Text>
              <Text style={styles.userEmail}>{item.email || 'Unknown Email'}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteUser(item.id, item.email)}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {loadingUsers
              ? 'Loading users...'
              : loadError
                ? `Failed to load users: ${loadError}`
                : 'No users available.'}
          </Text>
        }
        refreshing={loadingUsers}
        onRefresh={fetchUsers}
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
    maxHeight: verticalScale(260),
    minHeight: verticalScale(120),
    marginBottom: verticalScale(10),
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: horizontalScale(8),
    paddingTop: verticalScale(8),
  },
  listContent: {
    paddingBottom: verticalScale(8),
  },
  emptyContainer: {
    paddingVertical: verticalScale(20),
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(8),
  },
  userInfo: {
    flex: 1,
    marginRight: horizontalScale(10),
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
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: '700',
  },
  emptyText: {
    fontSize: normalize(12),
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: verticalScale(10),
  },
  helperText: {
    fontSize: normalize(12),
    color: '#6B7280',
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
