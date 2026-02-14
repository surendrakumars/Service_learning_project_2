import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { api, isAuthErrorMessage } from '../lib/api';

interface Student {
  _id: string;
  name: string;
  grade: string | null;
  father_name: string;
  mother_name: string;
  mobile_no: string;
  fees_paid: number;
  createdAt: string;
  updatedAt: string;
}

interface StudentInfoContentProps {
  studentId: string | null;
}

const StudentInfoContent: React.FC<StudentInfoContentProps> = ({ studentId }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getStudent(id);
      if (response.success && response.data) {
        setStudent(response.data);
      } else {
        const errMsg = response.error || 'Failed to fetch student details.';
        if (isAuthErrorMessage(errMsg)) {
          return;
        }
        setError(errMsg);
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      console.error('Student Info API error:', err);
      setError('Network error: Could not connect to the backend.');
      Alert.alert('Network Error', 'Could not connect to the backend. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (studentId) {
      fetchStudent(studentId);
    } else {
      setLoading(false);
      setError('No student selected.');
    }
  }, [studentId, fetchStudent]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading Student Info...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        {studentId && <Text style={styles.errorText}>Please ensure the backend server is running and accessible.</Text>}
        {!studentId && <Text style={styles.errorText}>Please navigate from the student list to view a profile.</Text>}
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>No student selected or found.</Text>
        <Text style={styles.emptyStateSubText}>Please select a student from the list.</Text>
      </View>
    );
  }

  const handleDial = async () => {
    const phone = student.mobile_no?.trim();
    if (!phone) {
      Alert.alert('Error', 'No mobile number available for selected student.');
      return;
    }
    const url = `tel:${phone}`;
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Error', 'Unable to open dialer.');
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <ImageBackground
      source={require('./assets/student_bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>Cambridge Little Kids</Text>
          <Text style={styles.title}>Student Info</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileCircle}>
            <View style={styles.profileInner} />
          </View>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.grade}>{student.grade || 'N/A'}</Text>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow label="Father :" value={student.father_name} />
          <DetailRow label="Mother :" value={student.mother_name} />
          <DetailRow label="Parent's No:" value={student.mobile_no} />
          <DetailRow label="Fees Paid:" value={`₹ ${student.fees_paid.toLocaleString('en-IN')}`} />
        </View>

        <TouchableOpacity style={styles.dialBtn} onPress={handleDial}>
          <Text style={styles.dialBtnText}>Dial to Parent</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}> {value}</Text>
  </View>
);

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  scrollContent: { paddingBottom: 50, flexGrow: 1, paddingHorizontal: 15, paddingTop: 40 },
  header: { alignItems: 'center', marginBottom: 25 },
  schoolName: { fontSize: 16, color: '#2563EB', fontWeight: 'bold', marginBottom: 5 },
  title: { fontSize: 32, color: '#34D399', fontWeight: '400' },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#111827', paddingHorizontal: 10, paddingVertical: 8, marginBottom: 30, backgroundColor: '#fff', borderRadius: 5 },
  searchInput: { flex: 1, fontSize: 16, color: '#111827' },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  profileCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', borderWidth: 6, borderColor: '#FBBF24', marginBottom: 15 },
  profileInner: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#2563EB' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  grade: { fontSize: 16, color: '#4B5563' },
  detailsCard: { backgroundColor: '#4ADE80', borderWidth: 3, borderColor: '#2563EB', padding: 20, marginBottom: 40 },
  detailRow: { flexDirection: 'row', marginBottom: 8 },
  detailLabel: { fontWeight: 'bold', fontSize: 16, color: '#111827' },
  detailValue: { fontSize: 16, color: '#111827' },
  dialBtn: { backgroundColor: '#2563EB', paddingVertical: 15, borderRadius: 50, alignItems: 'center', borderColor: '#FBBF24', borderWidth: 3, elevation: 5 },
  dialBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 10, fontSize: 16, color: '#111827' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 50 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginBottom: 10 },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyStateText: { fontSize: 18, color: '#6B7280', textAlign: 'center', fontWeight: 'bold', marginBottom: 5 },
  emptyStateSubText: { fontSize: 14, color: '#9CA3AF', textAlign: 'center' },
});

export default StudentInfoContent;

