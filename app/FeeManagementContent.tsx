import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    Linking,
    ScrollView,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { api, formatNumber } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

type FeeStudent = {
  id: number;
  name: string;
  father_name: string | null;
  mother_name: string | null;
  mobile_no: string | null;
  total_fees: number;
  fees_paid: number;
  balance_fees: number;
};

const FeeManagementContent: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [students, setStudents] = useState<FeeStudent[] | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<FeeStudent | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) {
      Alert.alert('Error', 'Enter student name to search');
      return;
    }
    setLoading(true);
    setSelectedStudent(null);
    const result = await api.searchFees(searchName.trim());
    setLoading(false);
    if (result.ok) {
      setStudents(result.data);
      if (result.data.length === 1) {
        setSelectedStudent(result.data[0]);
      } else if (result.data.length === 0) {
        Alert.alert('Not Found', 'No student found with that name');
      }
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSelectStudent = (s: FeeStudent) => {
    setSelectedStudent(s);
  };

  const handleDial = () => {
    const mobile = selectedStudent?.mobile_no?.replace(/\D/g, '') || '';
    if (!mobile) {
      Alert.alert('Error', 'No phone number available');
      return;
    }
    const tel = mobile.startsWith('+') ? mobile : `+91${mobile}`;
    Linking.openURL(`tel:${tel}`).catch(() => Alert.alert('Error', 'Unable to open dialer'));
  };

  const displayStudent = selectedStudent || (students && students.length === 1 ? students[0] : null);

  return (
    <ImageBackground source={require('./assets/student_bg.png')} style={styles.bg} resizeMode="cover">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.schoolName}>Cambridge Kids Pre School</Text>
          <Text style={styles.title}>Fee management</Text>
        </View>

        <View style={styles.searchBar}>
          <Text style={{marginRight: 10, fontSize: normalize(18)}}>🔍</Text>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Student Name" 
            placeholderTextColor="#6B7280" 
            value={searchName}
            onChangeText={setSearchName}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}

        {!loading && displayStudent && (
          <>
            {students && students.length > 1 && (
              <>
                <Text style={styles.pickHint}>Select a student:</Text>
                {students.map((s) => (
                  <TouchableOpacity 
                    key={s.id} 
                    style={[styles.studentChip, selectedStudent?.id === s.id && styles.studentChipActive]}
                    onPress={() => handleSelectStudent(s)}
                  >
                    <Text style={[styles.studentChipText, selectedStudent?.id === s.id && styles.studentChipTextActive]}>{s.name}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
            <View style={styles.feeCard}>
              <DetailRow label="Student:" value={displayStudent.name} />
              <DetailRow label="Father :" value={displayStudent.father_name || '-'} />
              <DetailRow label="Mother :" value={displayStudent.mother_name || '-'} />
              <View style={styles.divider} />
              <DetailRow label="Total Fees :" value={`₹ ${formatNumber(displayStudent.total_fees)}`} isBold />
              <DetailRow label="Fees Paid:" value={`₹ ${formatNumber(displayStudent.fees_paid)}`} isBold />
              <DetailRow label="Balance Fees:" value={`₹ ${formatNumber(displayStudent.balance_fees)}`} isBold />
            </View>

            <TouchableOpacity style={styles.dialBtn} onPress={handleDial}>
              <Text style={styles.dialBtnText}>Dial to Parent 📞</Text>
            </TouchableOpacity>
          </>
        )}

        {!loading && !displayStudent && students === null && (
          <Text style={styles.hint}>Search by student name to view fee details</Text>
        )}

      </ScrollView>
    </ImageBackground>
  );
};

const DetailRow = ({ label, value, isBold }: { label: string; value: string; isBold?: boolean }) => (
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
  
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#111827', paddingHorizontal: horizontalScale(15), paddingVertical: verticalScale(10), marginBottom: verticalScale(20), backgroundColor: '#FFFFFF' },
  searchInput: { flex: 1, fontSize: normalize(16), color: '#111827' },
  searchBtn: { marginLeft: 10, backgroundColor: '#2563EB', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  
  loadingWrap: { alignItems: 'center', paddingVertical: 30 },
  hint: { textAlign: 'center', color: '#6B7280', fontSize: normalize(14), marginTop: 20 },
  pickHint: { fontSize: normalize(14), color: '#374151', marginBottom: 10 },
  studentChip: { backgroundColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginBottom: 8 },
  studentChipActive: { backgroundColor: '#2563EB' },
  studentChipText: { fontSize: normalize(15), color: '#111827' },
  studentChipTextActive: { color: '#fff' },
  
  feeCard: { backgroundColor: '#4ADE80', borderWidth: 4, borderColor: '#2563EB', padding: horizontalScale(20), marginBottom: verticalScale(40) },
  detailRow: { flexDirection: 'row', marginBottom: verticalScale(12), alignItems: 'flex-start' },
  detailLabel: { fontSize: normalize(15), color: '#111827', width: '40%', fontWeight: '600' },
  detailValue: { fontSize: normalize(15), color: '#111827', flex: 1, flexWrap: 'wrap' },
  boldText: { fontWeight: 'bold' },
  divider: { height: 2, backgroundColor: '#2563EB', marginVertical: verticalScale(10), opacity: 0.3 },
  dialBtn: { backgroundColor: '#2563EB', paddingVertical: verticalScale(15), borderRadius: 50, alignItems: 'center', borderColor: '#FBBF24', borderWidth: 3, elevation: 5 },
  dialBtnText: { color: '#FFFFFF', fontSize: normalize(18), fontWeight: 'bold' },
});

export default FeeManagementContent;
