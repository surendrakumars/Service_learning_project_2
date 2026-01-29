import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, ImageBackground, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { horizontalScale, verticalScale, normalize } from './ResponsiveUtils';
import { api } from '../lib/api';

type Student = {
  id: number;
  name: string;
  grade: string | null;
  father_name: string | null;
  mother_name: string | null;
  mobile_no: string | null;
  teacher: string | null;
};

const StudentInfoContent: React.FC = () => {
  const [searchName, setSearchName] = useState('');
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) {
      Alert.alert('Error', 'Enter student name to search');
      return;
    }
    setLoading(true);
    setStudent(null);
    const result = await api.getStudents(searchName.trim());
    setLoading(false);
    if (result.ok && result.data.length > 0) {
      setStudent(result.data[0]);
      if (result.data.length > 1) {
        setStudent(result.data[0]);
      }
    } else if (result.ok && result.data.length === 0) {
      Alert.alert('Not Found', 'No student found with that name');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ImageBackground 
      source={require('./assets/student_bg.png')} 
      style={styles.bg} 
      resizeMode="cover"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>Cambridge Kids Pre School</Text>
          <Text style={styles.title}>Student Info</Text>
        </View>

        <View style={styles.searchBar}>
          <Text style={{marginRight: 10}}>🔍</Text>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Student Name" 
            placeholderTextColor="#9CA3AF"
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

        {!loading && student && (
          <>
            <View style={styles.profileSection}>
              <View style={styles.profileCircle}>
                <View style={styles.profileInner} /> 
              </View>
              <Text style={styles.name}>{student.name}</Text>
              <Text style={styles.grade}>{student.grade || '-'}</Text>
            </View>

            <View style={styles.detailsCard}>
              <DetailRow label="Teacher:" value={student.teacher || '-'} />
              <DetailRow label="Father :" value={student.father_name || '-'} />
              <DetailRow label="Mother :" value={student.mother_name || '-'} />
              <DetailRow label="Parent's No:" value={student.mobile_no ? `+91 ${student.mobile_no}` : '-'} />
            </View>
          </>
        )}

        {!loading && !student && (
          <Text style={styles.hint}>Search by student name to view details</Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
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
  searchBtn: { marginLeft: 10, backgroundColor: '#2563EB', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  searchBtnText: { color: '#fff', fontWeight: 'bold' },
  loadingWrap: { alignItems: 'center', paddingVertical: 30 },
  hint: { textAlign: 'center', color: '#6B7280', fontSize: 14, marginTop: 20 },
  profileSection: { alignItems: 'center', marginBottom: 30 },
  profileCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', borderWidth: 6, borderColor: '#FBBF24', marginBottom: 15 },
  profileInner: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#2563EB' },
  name: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  grade: { fontSize: 16, color: '#4B5563' },
  detailsCard: { backgroundColor: '#4ADE80', borderWidth: 3, borderColor: '#2563EB', padding: 20, marginBottom: 40 },
  detailRow: { flexDirection: 'row', marginBottom: 8 },
  detailLabel: { fontWeight: 'bold', fontSize: 16, color: '#111827' },
  detailValue: { fontSize: 16, color: '#111827' },
});

export default StudentInfoContent;
