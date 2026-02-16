import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import StudentCard, { Student } from '../components/StudentCard';
import { api, isAuthErrorMessage } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

interface StudentManagementContentProps {
  onSelectStudent: (studentId: string) => void;
  userRole: 'admin' | 'staff';
}

type Mode = 'LIST' | 'ADD' | 'UPDATE' | 'DELETE';

const StudentManagementContent: React.FC<StudentManagementContentProps> = ({ onSelectStudent, userRole }) => {
  const [currentMode, setCurrentMode] = useState<Mode>('LIST');
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const lastTapRef = useRef<{ id: string | null; time: number }>({ id: null, time: 0 });
  const singleTapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State for Add Student form
  const [addName, setAddName] = useState<string>('');
  const [addGrade, setAddGrade] = useState<string>('');
  const [addFatherName, setAddFatherName] = useState<string>('');
  const [addMotherName, setAddMotherName] = useState<string>('');
  const [addMobileNo, setAddMobileNo] = useState<string>('');
  const [addingStudent, setAddingStudent] = useState<boolean>(false);

  // State for Update Student form
  const [updateName, setUpdateName] = useState<string>('');
  const [updateGrade, setUpdateGrade] = useState<string>('');
  const [updateFatherName, setUpdateFatherName] = useState<string>('');
  const [updateMotherName, setUpdateMotherName] = useState<string>('');
  const [updateMobileNo, setUpdateMobileNo] = useState<string>('');
  const [updatingStudent, setUpdatingStudent] = useState<boolean>(false);

  // State for Delete Student
  const [deletingStudent, setDeletingStudent] = useState<boolean>(false);
  const canModify = userRole === 'admin';

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getStudents();
      if (response.success) {
        const fetchedStudents = response.data ?? [];
        setStudents(fetchedStudents);
        setFilteredStudents(fetchedStudents);
      } else {
        const errMsg = response.error || 'Failed to fetch students.';
        if (isAuthErrorMessage(errMsg)) {
          return;
        }
        setError(errMsg);
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      console.error('Student API error:', err);
      setError('Network error: Could not connect to the backend.');
      Alert.alert('Network Error', 'Could not connect to the backend. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents, currentMode]);

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

  // Prefill update form when selectedStudent exists and mode is UPDATE
  useEffect(() => {
    if (selectedStudent && currentMode === 'UPDATE') {
      setUpdateName(selectedStudent.name);
      setUpdateGrade(selectedStudent.grade || '');
      setUpdateFatherName(selectedStudent.father_name);
      setUpdateMotherName(selectedStudent.mother_name);
      setUpdateMobileNo(selectedStudent.mobile_no);
    } else if (currentMode === 'UPDATE' && !selectedStudent) {
      // Clear form when in UPDATE mode but no student selected
      setUpdateName('');
      setUpdateGrade('');
      setUpdateFatherName('');
      setUpdateMotherName('');
      setUpdateMobileNo('');
    }
  }, [selectedStudent, currentMode]);

  const handleAddStudent = async () => {
    if (!canModify) {
      Alert.alert('Forbidden', 'Only admins can add students.');
      return;
    }
    if (!addName || !addFatherName || !addMotherName || !addMobileNo) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setAddingStudent(true);
    try {
      const response = await api.addStudent({
        name: addName,
        grade: addGrade || undefined,
        father_name: addFatherName,
        mother_name: addMotherName,
        mobile_no: addMobileNo,
      });
      if (response.success) {
        Alert.alert('Success', `${addName} added successfully.`);
        setAddName('');
        setAddGrade('');
        setAddFatherName('');
        setAddMotherName('');
        setAddMobileNo('');
        setCurrentMode('LIST');
        fetchStudents();
      } else {
        Alert.alert('Error', response.error || 'Failed to add student.');
      }
    } catch (err) {
      console.error('Add Student API error:', err);
      Alert.alert('Network Error', 'Could not connect to the backend. Please check your internet connection.');
    } finally {
      setAddingStudent(false);
    }
  };

  const handleUpdateStudent = async () => {
    if (!canModify) {
      Alert.alert('Forbidden', 'Only admins can update students.');
      return;
    }
    if (!selectedStudent || !selectedStudent._id) {
      Alert.alert('Error', 'No student selected for update.');
      return;
    }

    if (!updateName || !updateFatherName || !updateMotherName || !updateMobileNo) {
      Alert.alert('Error', 'Please fill all required fields (Name, Father, Mother, Mobile).');
      return;
    }
    setUpdatingStudent(true);
    try {
      const response = await api.updateStudent(selectedStudent._id, {
        name: updateName,
        grade: updateGrade.trim() || undefined,
        father_name: updateFatherName,
        mother_name: updateMotherName,
        mobile_no: updateMobileNo,
      });
      if (response.success) {
        Alert.alert('Success', `${updateName} updated successfully.`);
        // Clear form
        setUpdateName('');
        setUpdateGrade('');
        setUpdateFatherName('');
        setUpdateMotherName('');
        setUpdateMobileNo('');
        // Clear selection and switch mode
        setSelectedStudent(null);
        setCurrentMode('ADD');
        // Refresh data
        fetchStudents();
      } else {
        Alert.alert('Error', response.error || 'Failed to update student.');
      }
    } catch (err) {
      console.error('Update Student API error:', err);
      Alert.alert('Network Error', 'Could not connect to the backend. Please check your internet connection.');
    } finally {
      setUpdatingStudent(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!canModify) {
      Alert.alert('Forbidden', 'Only admins can delete students.');
      return;
    }
    if (!selectedStudent) {
      Alert.alert('Error', 'Please select a student to delete.');
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Delete ${selectedStudent.name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingStudent(true);
            try {
              const response = await api.deleteStudent(selectedStudent._id);
              if (response.success) {
                Alert.alert('Success', `${selectedStudent.name} deleted successfully.`);
                setSelectedStudent(null);
                fetchStudents();
              } else {
                Alert.alert('Error', response.error || 'Failed to delete student.');
              }
            } catch (err) {
              console.error('Delete Student API error:', err);
              Alert.alert('Network Error', 'Could not connect to the backend. Please check your internet connection.');
            } finally {
              setDeletingStudent(false);
            }
          }
        }
      ]
    );
  };


  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.schoolName}>Cambridge Little Kids</Text>
        <Text style={styles.title}>Student Management</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.btnList, currentMode === 'LIST' && styles.activeBtn]} onPress={() => setCurrentMode('LIST')}>
          <Text style={styles.btnText}>List</Text>
        </TouchableOpacity>
        {canModify && (
          <>
            <TouchableOpacity style={[styles.actionBtn, styles.btnAdd, currentMode === 'ADD' && styles.activeBtn]} onPress={() => setCurrentMode('ADD')}>
              <Text style={styles.btnText}>Add +</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.btnUpdate, currentMode === 'UPDATE' && styles.activeBtn]} onPress={() => {
              if (!selectedStudent) {
                Alert.alert('Select Student', 'Please select a student to update first.');
                return;
              }
              setCurrentMode('UPDATE');
            }}>
              <Text style={styles.btnText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.btnDel, currentMode === 'DELETE' && styles.activeBtn]} onPress={() => setCurrentMode('DELETE')}>
              <Text style={styles.btnText}>Del -</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.modeIndicator}>Currently in: <Text style={{fontWeight: 'bold'}}>{currentMode} Mode</Text></Text>

      {currentMode === 'LIST' && (
        <>
          <View style={styles.searchBar}>
            <Text style={{marginRight: 10, fontSize: normalize(18)}}>🔍</Text>
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

          {!loading && !error && filteredStudents.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No students found.</Text>
              <Text style={styles.emptyStateSubText}>Try adjusting your search or add a new student.</Text>
            </View>
          )}
        </>
      )}

      {renderFormContent()}
    </>
  );

  const renderFormContent = () => {
    switch (currentMode) {
      case 'LIST':
        return null;
      case 'ADD':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Student</Text>
            <InputGroup label="Name" placeholder="Enter Student Name" value={addName} onChangeText={setAddName} />
            <InputGroup label="Grade (Optional)" placeholder="Enter Grade" value={addGrade} onChangeText={setAddGrade} />
            <InputGroup label="Father's Name" placeholder="Enter Father's Name" value={addFatherName} onChangeText={setAddFatherName} />
            <InputGroup label="Mother Name" placeholder="Enter Mother Name" value={addMotherName} onChangeText={setAddMotherName} />
            <InputGroup label="Mobile No" placeholder="Enter 10 digit number" keyboardType="phone-pad" value={addMobileNo} onChangeText={setAddMobileNo} />
            <TouchableOpacity style={styles.confirmBtn} onPress={handleAddStudent} disabled={addingStudent}>
              {addingStudent ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Add ➤</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      case 'UPDATE':
        return (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Update Student</Text>

            {!selectedStudent ? (
              <View style={styles.selectionPrompt}>
                <Text style={styles.selectionPromptText}>
                  👆 Click on a student above to update their details
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.selectedStudentInfo}>
                  <Text style={styles.selectedStudentText}>
                    Updating: {selectedStudent.name}
                  </Text>
                </View>
                <InputGroup label="Name" placeholder="Enter Student Name" value={updateName} onChangeText={setUpdateName} />
                <InputGroup label="Grade (Optional)" placeholder="Enter Grade" value={updateGrade} onChangeText={setUpdateGrade} />
                <InputGroup label="Father's Name" placeholder="Enter Father's Name" value={updateFatherName} onChangeText={setUpdateFatherName} />
                <InputGroup label="Mother Name" placeholder="Enter Mother Name" value={updateMotherName} onChangeText={setUpdateMotherName} />
                <InputGroup label="Mobile No" placeholder="Enter 10 digit number" keyboardType="phone-pad" value={updateMobileNo} onChangeText={setUpdateMobileNo} />
                <TouchableOpacity style={styles.confirmBtn} onPress={handleUpdateStudent} disabled={updatingStudent}>
                  {updatingStudent ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmBtnText}>Confirm Update ➤</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        );
      case 'DELETE':
        return (
          <View style={styles.formContainer}>
             <Text style={styles.formTitle}>Delete Student</Text>
            <View style={{ marginBottom: verticalScale(20) }}>
              <Text style={{ textAlign: 'center', color: '#EF4444', fontSize: normalize(14) }}>
                Tap on a student below to remove them permanently.
              </Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const getListData = () => {
    switch (currentMode) {
      case 'DELETE':
        return students; // DELETE mode shows all students unfiltered
      default:
        return filteredStudents; // Other modes use filtered results
    }
  };

  const renderFooter = () => {
    if (currentMode === 'DELETE') {
      return (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[styles.footerDeleteButton, !selectedStudent && styles.disabledButton]}
            onPress={handleDeleteStudent}
            disabled={!selectedStudent || deletingStudent}
          >
            {deletingStudent ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.footerDeleteButtonText}>
                {selectedStudent ? `Delete ${selectedStudent.name}` : 'Select a student to delete'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const handleStudentTap = (student: Student) => {
    if (currentMode === 'DELETE' || currentMode === 'UPDATE') {
      setSelectedStudent(student);
      return;
    }

    const now = Date.now();
    const isSame = lastTapRef.current.id === student._id;
    const isDouble = isSame && now - lastTapRef.current.time < 350;
    lastTapRef.current = { id: student._id, time: now };

    if (isDouble) {
      if (!canModify) {
        return;
      }
      if (singleTapTimerRef.current) {
        clearTimeout(singleTapTimerRef.current);
        singleTapTimerRef.current = null;
      }
      setSelectedStudent(student);
      setCurrentMode('UPDATE');
      return;
    }

    if (singleTapTimerRef.current) {
      clearTimeout(singleTapTimerRef.current);
    }
    singleTapTimerRef.current = setTimeout(() => {
      onSelectStudent(student._id);
      singleTapTimerRef.current = null;
    }, 350);
  };

  return (
    <ImageBackground source={require('./assets/student_bg.png')} style={styles.bg} resizeMode="cover">
      <FlatList
        data={getListData()}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.studentCardWrapper}>
            <StudentCard
              student={item}
              onPress={() => {
                handleStudentTap(item);
              }}
              isSelected={selectedStudent?._id === item._id}
            />
          </View>
        )}
        ListHeaderComponent={(
          <View>
            {renderHeader()}
          </View>
        )}
        ListFooterComponent={renderFooter()}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={10}
        windowSize={7}
        removeClippedSubviews
      />
    </ImageBackground>
  );
};

const InputGroup = ({ label, placeholder, keyboardType, value, onChangeText }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#9CA3AF"
      keyboardType={keyboardType || 'default'}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  scrollContent: { paddingHorizontal: horizontalScale(20), paddingTop: verticalScale(40), paddingBottom: verticalScale(50) },
  header: { alignItems: 'center', marginBottom: verticalScale(25) },
  schoolName: { fontSize: normalize(16), color: '#2563EB', fontWeight: 'bold', marginBottom: 5 },
  title: { fontSize: normalize(28), color: '#34D399', fontWeight: '400', textAlign: 'center' },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: verticalScale(15) },
  actionBtn: { paddingVertical: verticalScale(10), paddingHorizontal: horizontalScale(10), borderRadius: 8, flex: 1, marginHorizontal: 2, alignItems: 'center', justifyContent: 'center' },
  btnList: { backgroundColor: '#2DD4BF' },
  btnAdd: { backgroundColor: '#34D399' },
  btnUpdate: { backgroundColor: '#F59E0B' },
  btnDel: { backgroundColor: '#EF4444' },
  activeBtn: { opacity: 1, elevation: 5, borderWidth: 2, borderColor: '#fff' },
  btnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: normalize(10) },

  modeIndicator: { textAlign: 'center', color: '#6B7280', marginBottom: verticalScale(15), fontStyle: 'italic', fontSize: normalize(12) },

  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#111827', paddingHorizontal: horizontalScale(15), paddingVertical: verticalScale(10), marginBottom: verticalScale(20), backgroundColor: '#FFFFFF', borderRadius: 8 },
  searchInput: { flex: 1, fontSize: normalize(16), color: '#111827' },

  studentList: { paddingHorizontal: horizontalScale(0) },
  studentCardWrapper: {
    marginBottom: verticalScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  confirmBtn: { backgroundColor: '#2563EB', paddingVertical: verticalScale(15), borderRadius: 8, alignItems: 'center', borderColor: '#FBBF24', borderWidth: 2, marginTop: verticalScale(20) },
  confirmBtnText: { color: '#FFFFFF', fontSize: normalize(18), fontWeight: 'bold' },
  deleteButtonContainer: { paddingHorizontal: horizontalScale(10), alignSelf: 'stretch', alignItems: 'center' },
  deleteButton: { backgroundColor: '#EF4444', paddingVertical: verticalScale(8), paddingHorizontal: horizontalScale(15), borderRadius: 8 },
  deleteButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: normalize(14) },
  footerContainer: { paddingHorizontal: horizontalScale(20), paddingVertical: verticalScale(20), alignItems: 'center' },
  footerDeleteButton: { backgroundColor: '#EF4444', paddingVertical: verticalScale(15), paddingHorizontal: horizontalScale(30), borderRadius: 8, width: '100%', alignItems: 'center' },
  footerDeleteButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: normalize(16) },
  disabledButton: { opacity: 0.4 },

  formContainer: { paddingBottom: verticalScale(20) },
  formTitle: { fontSize: normalize(24), fontWeight: 'bold', color: '#111827', marginBottom: verticalScale(25), textAlign: 'center' },
  selectionPrompt: { alignItems: 'center', paddingVertical: verticalScale(40) },
  selectionPromptText: { fontSize: normalize(16), color: '#6B7280', textAlign: 'center', fontStyle: 'italic' },
  selectedStudentInfo: { backgroundColor: '#E0F2FE', padding: horizontalScale(15), borderRadius: 8, marginBottom: verticalScale(20), borderWidth: 1, borderColor: '#2563EB' },
  selectedStudentText: { fontSize: normalize(16), fontWeight: 'bold', color: '#2563EB', textAlign: 'center' },
  inputGroup: { marginBottom: verticalScale(15) },
  label: { fontSize: normalize(15), color: '#111827', fontWeight: '600', marginBottom: verticalScale(8) },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: horizontalScale(15), paddingVertical: verticalScale(10), fontSize: normalize(15), color: '#111827' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(50) },
  loadingText: { marginTop: verticalScale(10), fontSize: normalize(16), color: '#111827' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: horizontalScale(20), marginTop: verticalScale(50) },
  errorText: { fontSize: normalize(16), color: 'red', textAlign: 'center', marginBottom: verticalScale(10) },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: verticalScale(50) },
  emptyStateText: { fontSize: normalize(18), color: '#6B7280', textAlign: 'center', fontWeight: 'bold', marginBottom: verticalScale(5) },
  emptyStateSubText: { fontSize: normalize(14), color: '#9CA3AF', textAlign: 'center' },
});

export default StudentManagementContent;

