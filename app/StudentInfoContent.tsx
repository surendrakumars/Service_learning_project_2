import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, ImageBackground } from 'react-native';

const StudentInfoContent: React.FC = () => {
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
          <TextInput style={styles.searchInput} placeholder="Student Name" placeholderTextColor="#9CA3AF" />
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileCircle}>
            <View style={styles.profileInner} /> 
          </View>
          <Text style={styles.name}>Student Name</Text>
          <Text style={styles.grade}>Grade</Text>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow label="Teacher:" value="Teacher Name" />
          <DetailRow label="Father :" value="Father Name" />
          <DetailRow label="Mother :" value="Mother Name" />
          <DetailRow label="Parent's No:" value="+91 1234567891" />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
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
});

export default StudentInfoContent;