import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, ScrollView, ImageBackground, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { horizontalScale, verticalScale, normalize } from './ResponsiveUtils';
import { api } from '../lib/api';

type Mode = 'ADD' | 'UPDATE' | 'DELETE';

const FIELD_MAP: Record<string, string> = {
  grade: 'grade',
  'mobile no': 'mobile_no',
  mobile_no: 'mobile_no',
  fees: 'fees_paid',
  fees_paid: 'fees_paid',
  father: 'father_name',
  father_name: 'father_name',
  mother: 'mother_name',
  mother_name: 'mother_name',
  name: 'name',
  teacher: 'teacher',
};

const StudentManagementContent: React.FC = () => {
  const [mode, setMode] = useState<Mode>('ADD');
  const [loading, setLoading] = useState(false);
  // ADD fields
  const [addName, setAddName] = useState('');
  const [addGrade, setAddGrade] = useState('');
  const [addFather, setAddFather] = useState('');
  const [addMother, setAddMother] = useState('');
  const [addMobile, setAddMobile] = useState('');
  const [addFeesPaid, setAddFeesPaid] = useState('');
  // UPDATE fields
  const [updateName, setUpdateName] = useState('');
  const [updateField, setUpdateField] = useState('');
  const [updateValue, setUpdateValue] = useState('');
  // DELETE field
  const [deleteName, setDeleteName] = useState('');

  const resetForm = () => {
    setAddName(''); setAddGrade(''); setAddFather(''); setAddMother(''); setAddMobile(''); setAddFeesPaid('');
    setUpdateName(''); setUpdateField(''); setUpdateValue('');
    setDeleteName('');
  };

  const handleConfirm = async () => {
    if (mode === 'ADD') {
      if (!addName.trim()) {
        Alert.alert('Error', 'Student name is required');
        return;
      }
      setLoading(true);
      const result = await api.addStudent({
        name: addName.trim(),
        grade: addGrade.trim() || undefined,
        father_name: addFather.trim() || undefined,
        mother_name: addMother.trim() || undefined,
        mobile_no: addMobile.trim() || undefined,
        fees_paid: addFeesPaid ? parseInt(addFeesPaid, 10) : 0,
      });
      setLoading(false);
      if (result.ok) {
        Alert.alert('Success', 'Student Added Successfully');
        resetForm();
      } else {
        Alert.alert('Error', result.error);
      }
    } else if (mode === 'UPDATE') {
      if (!updateName.trim() || !updateField.trim() || !updateValue.trim()) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      const apiField = FIELD_MAP[updateField.trim().toLowerCase().replace(/\s+/g, '_')] || FIELD_MAP[updateField.trim().toLowerCase()];
      if (!apiField) {
        Alert.alert('Error', 'Invalid field. Use: Grade, Mobile No, Fees, Father, Mother, Name, Teacher');
        return;
      }
      setLoading(true);
      const searchResult = await api.getStudents(updateName.trim());
      setLoading(false);
      if (!searchResult.ok || searchResult.data.length === 0) {
        Alert.alert('Error', 'Student not found');
        return;
      }
      const student = searchResult.data[0];
      const updateData: Record<string, string | number> = {};
      updateData[apiField] = apiField === 'fees_paid' ? parseInt(updateValue, 10) : updateValue;
      setLoading(true);
      const updateResult = await api.updateStudent(student.id, updateData as any);
      setLoading(false);
      if (updateResult.ok) {
        Alert.alert('Success', 'Student Details Updated');
        resetForm();
      } else {
        Alert.alert('Error', updateResult.error);
      }
    } else if (mode === 'DELETE') {
      if (!deleteName.trim()) {
        Alert.alert('Error', 'Student name is required');
        return;
      }
      Alert.alert(
        'Confirm Delete',
        'The information will be permanently deleted',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              setLoading(true);
              const result = await api.deleteStudentByName(deleteName.trim());
              setLoading(false);
              if (result.ok) {
                Alert.alert('Deleted', 'Student removed from database');
                resetForm();
              } else {
                Alert.alert('Error', result.error);
              }
            },
          },
        ]
      );
    }
  };

  const renderFormFields = () => {
    switch (mode) {
      case 'ADD':
        return (
          <>
            <InputGroup label="Name" placeholder="Enter Student Name" value={addName} onChangeText={setAddName} />
            <InputGroup label="Grade" placeholder="Enter Grade" value={addGrade} onChangeText={setAddGrade} />
            <InputGroup label="Father's Name" placeholder="Enter Father's Name" value={addFather} onChangeText={setAddFather} />
            <InputGroup label="Mother Name" placeholder="Enter Mother Name" value={addMother} onChangeText={setAddMother} />
            <InputGroup label="Mobile No" placeholder="Enter 10 digit number" keyboardType="phone-pad" value={addMobile} onChangeText={setAddMobile} />
            <InputGroup label="Fees Paid" placeholder="Enter amount" keyboardType="numeric" value={addFeesPaid} onChangeText={setAddFeesPaid} />
          </>
        );
      case 'UPDATE':
        return (
          <>
            <InputGroup label="Student Name" placeholder="Enter name of student to update" value={updateName} onChangeText={setUpdateName} />
            <InputGroup label="Field to be updated" placeholder="e.g. Grade, Mobile No, Fees" value={updateField} onChangeText={setUpdateField} />
            <InputGroup label="New Content" placeholder="Enter the new value" value={updateValue} onChangeText={setUpdateValue} />
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
            <InputGroup label="Student Name" placeholder="Enter Student Name to delete" value={deleteName} onChangeText={setDeleteName} />
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
          <TouchableOpacity style={[styles.actionBtn, styles.btnAdd, mode === 'ADD' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => { setMode('ADD'); resetForm(); }}>
            <Text style={styles.btnText}>Add +</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnUpdate, mode === 'UPDATE' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => { setMode('UPDATE'); resetForm(); }}>
            <Text style={styles.btnText}>Update ⌄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.btnDel, mode === 'DELETE' ? styles.activeBtn : styles.inactiveBtn]} onPress={() => { setMode('DELETE'); resetForm(); }}>
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
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (
            <Text style={styles.confirmBtnText}>
              {mode === 'ADD' ? 'Confirm Add ➤' : mode === 'UPDATE' ? 'Confirm Update ↻' : 'Confirm Delete 🗑'}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
};

const InputGroup = ({ label, placeholder, keyboardType, value, onChangeText }: { label: string; placeholder: string; keyboardType?: any; value: string; onChangeText: (t: string) => void }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholder={placeholder} placeholderTextColor="#9CA3AF" keyboardType={keyboardType || 'default'} value={value} onChangeText={onChangeText} />
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
