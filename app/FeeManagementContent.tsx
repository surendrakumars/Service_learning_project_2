import React from 'react';
import { 
  StyleSheet, Text, View, TextInput, ScrollView, ImageBackground, TouchableOpacity, Linking, Alert
} from 'react-native';
import { horizontalScale, verticalScale, normalize } from './ResponsiveUtils';

const FeeManagementContent: React.FC = () => {
  const handleDial = () => {
    Linking.openURL(`tel:+911234567891`).catch(err => Alert.alert('Error', 'Unable to open dialer'));
  };

  return (
    <ImageBackground source={require('./assets/student_bg.png')} style={styles.bg} resizeMode="cover">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.schoolName}>Cambridge Kids Pre School</Text>
          <Text style={styles.title}>Fee management</Text>
        </View>

        <View style={styles.searchBar}>
          <Text style={{marginRight: 10, fontSize: normalize(18)}}>🔍</Text>
          <TextInput style={styles.searchInput} placeholder="Student Name" placeholderTextColor="#6B7280" />
        </View>

        <View style={styles.feeCard}>
          <DetailRow label="Student:" value="Student Name" />
          <DetailRow label="Father :" value="Father Name" />
          <DetailRow label="Mother :" value="Mother Name" />
          <View style={styles.divider} />
          <DetailRow label="Total Fees :" value="₹ 10,000" isBold />
          <DetailRow label="Fees Paid:" value="₹ 4,000" isBold />
          <DetailRow label="Balance Fees:" value="₹ 6,000" isBold />
        </View>

        <TouchableOpacity style={styles.dialBtn} onPress={handleDial}>
          <Text style={styles.dialBtnText}>Dial to Parent 📞</Text>
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
};

const DetailRow = ({ label, value, isBold }: any) => (
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
  
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#111827', paddingHorizontal: horizontalScale(15), paddingVertical: verticalScale(10), marginBottom: verticalScale(30), backgroundColor: '#FFFFFF' },
  searchInput: { flex: 1, fontSize: normalize(16), color: '#111827' },
  
  feeCard: { backgroundColor: '#4ADE80', borderWidth: 4, borderColor: '#2563EB', padding: horizontalScale(20), marginBottom: verticalScale(40) },
  detailRow: { flexDirection: 'row', marginBottom: verticalScale(12), alignItems: 'flex-start' },
  
  // Responsive Fonts
  detailLabel: { fontSize: normalize(15), color: '#111827', width: '40%', fontWeight: '600' },
  detailValue: { fontSize: normalize(15), color: '#111827', flex: 1, flexWrap: 'wrap' },
  
  boldText: { fontWeight: 'bold' },
  divider: { height: 2, backgroundColor: '#2563EB', marginVertical: verticalScale(10), opacity: 0.3 },
  dialBtn: { backgroundColor: '#2563EB', paddingVertical: verticalScale(15), borderRadius: 50, alignItems: 'center', borderColor: '#FBBF24', borderWidth: 3, elevation: 5 },
  dialBtnText: { color: '#FFFFFF', fontSize: normalize(18), fontWeight: 'bold' },
});

export default FeeManagementContent;