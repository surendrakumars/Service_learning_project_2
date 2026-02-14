import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import StudentCard, { Student } from '../components/StudentCard';
import { api, isAuthErrorMessage } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

const FeeManagementContent: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState<boolean>(false);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getStudents();
      if (response.success && response.data) {
        setStudents(response.data);
        setFilteredStudents(response.data);
      } else {
        const errMsg = response.error || 'Failed to fetch students.';
        if (isAuthErrorMessage(errMsg)) {
          return;
        }
        setError(errMsg);
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      console.error('Fee Management API error:', err);
      setError('Network error: Could not connect to the backend.');
      Alert.alert('Network Error', 'Could not connect to the backend. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchQuery, students]);

  const handlePayFees = async () => {
    if (!selectedStudent) {
      Alert.alert('Error', 'Please select a student first.');
      return;
    }
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setPaying(true);
    try {
      const response = await api.payFee(selectedStudent._id, amount);
      if (response.success) {
        Alert.alert('Success', `₹${amount} paid for ${selectedStudent.name}.`);
        setPaymentAmount('');
        fetchStudents();
      } else {
        const errMsg = response.error || 'Failed to record fee payment.';
        if (isAuthErrorMessage(errMsg)) {
          return;
        }
        setError(errMsg);
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      console.error('Pay Fee API error:', err);
      setError('Network error: Could not connect to the backend.');
      Alert.alert('Network Error', 'Could not connect to the backend. Please check your internet connection.');
    } finally {
      setPaying(false);
    }
  };

  const renderStudentItem = ({ item }: { item: Student }) => (
    <StudentCard
      student={item}
      onPress={() => setSelectedStudent(item)}
      showFees={true}
      isSelected={selectedStudent?._id === item._id}
    />
  );

  const handleDial = () => {
    if (selectedStudent?.mobile_no) {
      Linking.openURL(`tel:${selectedStudent.mobile_no}`)
        .catch(() => Alert.alert('Error', 'Unable to open dialer'));
    } else {
      Alert.alert('Error', 'No mobile number available for selected student.');
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.schoolName}>Cambridge Little Kids</Text>
        <Text style={styles.title}>Fee Management</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Student Name"
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading Students...</Text>
        </View>
      )}

      {!loading && error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorText}>Please ensure the backend server is running and accessible.</Text>
        </View>
      )}

      {!loading && !error && students.length === 0 && (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No students available for fee management.</Text>
          <Text style={styles.emptyStateSubText}>Add students in Student Management to see them here.</Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View>
      {selectedStudent && (
        <View style={styles.feeDetailsContainer}>
          <Text style={styles.sectionTitle}>Fee Details for {selectedStudent.name}</Text>
          <DetailRow label="Father :" value={selectedStudent.father_name} />
          <DetailRow label="Mother :" value={selectedStudent.mother_name} />
          <DetailRow label="Mobile No :" value={selectedStudent.mobile_no} />
          <View style={styles.divider} />
          <DetailRow label="Fees Paid:" value={`₹ ${selectedStudent.fees_paid.toLocaleString('en-IN')}`} isBold />

          <View style={styles.paymentInputContainer}>
            <TextInput
              style={styles.paymentInput}
              placeholder="Enter amount to pay"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
            />
            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayFees}
              disabled={paying}
            >
              {paying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.payButtonText}>Pay Fees</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.dialBtn} onPress={handleDial}>
        <Text style={styles.dialBtnText}>Dial to Parent</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={require('./assets/student_bg.png')} style={styles.bg} resizeMode="cover">
      <FlatList
        data={loading || error ? [] : filteredStudents}
        keyExtractor={(item) => item._id}
        renderItem={renderStudentItem}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={renderFooter()}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      />
    </ImageBackground>
  );
};

const DetailRow = ({ label, value, isBold = false }: { label: string; value: string; isBold?: boolean }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, isBold && styles.boldText]}>{label}</Text>
    <Text style={[styles.detailValue, isBold && styles.boldText]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  scrollContent: { paddingBottom: verticalScale(50), flexGrow: 1, paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(40) },
  header: { alignItems: 'center', marginBottom: verticalScale(25) },
  schoolName: { fontSize: normalize(16), color: '#2563EB', fontWeight: 'bold', marginBottom: 5 },
  title: { fontSize: normalize(28), color: '#34D399', fontWeight: '400', textAlign: 'center' },

  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#111827', paddingHorizontal: horizontalScale(15), paddingVertical: verticalScale(10), marginBottom: verticalScale(30), backgroundColor: '#FFFFFF', borderRadius: 8 },
  searchIcon: { marginRight: 10, fontSize: normalize(14), color: '#111827' },
  searchInput: { flex: 1, fontSize: normalize(16), color: '#111827' },

  feeDetailsContainer: { backgroundColor: '#4ADE80', padding: horizontalScale(20), borderRadius: 10, borderWidth: 3, borderColor: '#2563EB', marginTop: verticalScale(20) },
  sectionTitle: { fontSize: normalize(20), fontWeight: 'bold', color: '#2563EB', marginBottom: verticalScale(15), textAlign: 'center' },

  paymentInputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: verticalScale(20), gap: 10 },
  paymentInput: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: horizontalScale(15), paddingVertical: verticalScale(10), fontSize: normalize(15), color: '#111827' },
  payButton: { backgroundColor: '#2563EB', paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(15), borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  payButtonText: { color: '#FFFFFF', fontSize: normalize(15), fontWeight: 'bold' },

  detailRow: { flexDirection: 'row', marginBottom: verticalScale(12), alignItems: 'flex-start' },
  detailLabel: { fontSize: normalize(15), color: '#111827', width: '40%', fontWeight: '600' },
  detailValue: { fontSize: normalize(15), color: '#111827', flex: 1, flexWrap: 'wrap' },
  boldText: { fontWeight: 'bold' },
  divider: { height: 2, backgroundColor: '#2563EB', marginVertical: verticalScale(10), opacity: 0.3 },
  dialBtn: { backgroundColor: '#2563EB', paddingVertical: verticalScale(15), borderRadius: 50, alignItems: 'center', borderColor: '#FBBF24', borderWidth: 3, elevation: 5, marginTop: verticalScale(20) },
  dialBtnText: { color: '#FFFFFF', fontSize: normalize(18), fontWeight: 'bold' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(50) },
  loadingText: { marginTop: verticalScale(10), fontSize: normalize(16), color: '#111827' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: horizontalScale(20), marginTop: verticalScale(50) },
  errorText: { fontSize: normalize(16), color: 'red', textAlign: 'center', marginBottom: verticalScale(10) },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(50) },
  emptyStateText: { fontSize: normalize(18), color: '#6B7280', textAlign: 'center', fontWeight: 'bold', marginBottom: verticalScale(5) },
  emptyStateSubText: { fontSize: normalize(14), color: '#9CA3AF', textAlign: 'center' },
});

export default FeeManagementContent;

