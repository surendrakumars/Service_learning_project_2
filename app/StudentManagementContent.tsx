import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, ScrollView, ImageBackground, TouchableOpacity, Alert
} from 'react-native';
import { horizontalScale, verticalScale, normalize } from './ResponsiveUtils';

type Mode = 'ADD' | 'UPDATE' | 'DELETE';

const StudentManagementContent: React.FC = () => {
  const [mode, setMode] = useState<Mode>('ADD');

  // Logic to handle different confirm actions
  const handleConfirm = () => {
    if (mode === 'ADD') {
      Alert.alert("Success", "Student Added Successfully");
    } 
    else if (mode === 'UPDATE') {
      Alert.alert("Success", "Student Details Updated");
    } 
    else if (mode === 'DELETE') {
      // Reconfirmation Dialog for Delete
      Alert.alert(
        "Confirm Delete",
        "The information will be permanently deleted",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive", 
            onPress: () => Alert.alert("Deleted", "Student removed from database") 
          }
        ]
      );
    }
  };

  const renderFormFields = () => {
    switch (mode) {
      case 'ADD':
        return (
          <>
            <InputGroup label="Name" placeholder="Enter Student Name" />
            <InputGroup label="Grade" placeholder="Enter Grade" />
            <InputGroup label="Father's Name" placeholder="Enter Father's Name" />
            <InputGroup label="Mother Name" placeholder="Enter Mother Name" />
            <InputGroup label="Mobile No" placeholder="Enter 10 digit number" keyboardType="phone-pad" />
            <InputGroup label="Fees Paid" placeholder="Enter amount" keyboardType="numeric" />
          </>
        );
      case 'UPDATE':
        return (
          <>
            <InputGroup label="Student Name" placeholder="Enter name of student to update" />
            <InputGroup label="Field to be updated" placeholder="e.g. Grade, Mobile No, Fees" />
            <InputGroup label="New Content" placeholder="Enter the new value" />
          </>
        );
      case 'DELETE':
        return (
          <>
            <View style={{ marginBottom: verticalScale(20) }}>
              <Text style={{ textAlign: 'center', color: '#EF4444', fontSize: normalize(14) }}>
                Enter the name of the student you wish to remove.
              </Text>
            </View>
            <InputGroup label="Student Name" placeholder="Enter Student Name to delete" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={require('./assets/student_bg.png')} style={styles.bg} resizeMode="cover">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.schoolName}>Cambridge Kids Pre School</Text>
          <Text style={styles.title}>Student Management</Text>
        </View>

        {/* Mode Selection Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.actionBtn, styles.btnAdd, mode === 'ADD' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => setMode('ADD')}>
            <Text style={styles.btnText}>Add +</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnUpdate, mode === 'UPDATE' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => setMode('UPDATE')}>
            <Text style={styles.btnText}>Update ⌄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnDel, mode === 'DELETE' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => setMode('DELETE')}>
            <Text style={styles.btnText}>Del -</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.modeIndicator}>Currently in: <Text style={{fontWeight: 'bold'}}>{mode} Mode</Text></Text>

        {/* Dynamic Form Container */}
        <View style={styles.formContainer}>
          {renderFormFields()}
        </View>

        {/* Dynamic Button */}
        <TouchableOpacity 
          style={[styles.confirmBtn, mode === 'DELETE' ? { backgroundColor: '#EF4444', borderColor: '#FECACA' } : {}]} 
          onPress={handleConfirm}
        >
          <Text style={styles.confirmBtnText}>
            {mode === 'ADD' ? 'Confirm Add ➤' : mode === 'UPDATE' ? 'Confirm Update ↻' : 'Confirm Delete 🗑'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
};

const InputGroup = ({ label, placeholder, keyboardType }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#9CA3AF" keyboardType={keyboardType || 'default'} />
  </View>
);

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  scrollContent: { paddingBottom: verticalScale(50), flexGrow: 1, paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(40) },
  header: { alignItems: 'center', marginBottom: verticalScale(25) },
  schoolName: { fontSize: normalize(16), color: '#2563EB', fontWeight: 'bold', marginBottom: 5 },
  title: { fontSize: normalize(28), color: '#34D399', fontWeight: '400', textAlign: 'center' },
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(15) },
  actionBtn: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(10), borderRadius: 8, flex: 1, marginHorizontal: 4, alignItems: 'center', justifyContent: 'center' },
  btnAdd: { backgroundColor: '#34D399' }, 
  btnUpdate: { backgroundColor: '#2563EB' }, 
  btnDel: { backgroundColor: '#EF4444' }, 
  activeBtn: { opacity: 1, elevation: 5, borderWidth: 2, borderColor: '#fff' },
  inactiveBtn: { opacity: 0.4 }, 
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: normalize(12) },
  
  modeIndicator: { textAlign: 'center', color: '#6B7280', marginBottom: verticalScale(15), fontStyle: 'italic', fontSize: normalize(12) },
  
  formContainer: { marginBottom: verticalScale(20) },
  inputGroup: { marginBottom: verticalScale(15) },
  label: { fontSize: normalize(15), color: '#111827', fontWeight: '600', marginBottom: verticalScale(8) },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: horizontalScale(15), paddingVertical: verticalScale(10), fontSize: normalize(15), color: '#111827' },
  
  confirmBtn: { backgroundColor: '#2563EB', paddingVertical: verticalScale(15), borderRadius: 8, alignItems: 'center', borderColor: '#FBBF24', borderWidth: 2 },
  confirmBtnText: { color: '#FFFFFF', fontSize: normalize(18), fontWeight: 'bold' },
});

export default StudentManagementContent;