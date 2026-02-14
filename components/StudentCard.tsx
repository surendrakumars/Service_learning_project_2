import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { horizontalScale, normalize, verticalScale } from '../app/ResponsiveUtils';

export interface Student {
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

interface StudentCardProps {
  student: Student;
  onPress?: () => void;      // OPTIONAL
  showFees?: boolean;
  isSelected?: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onPress,
  showFees = false,
  isSelected = false,
}) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      {...(onPress ? { onPress } : {})}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
      ]}
    >
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.grade}>Grade: {student.grade ?? 'N/A'}</Text>
      <Text style={styles.mobile}>Mobile: {student.mobile_no}</Text>

      {showFees && (
        <Text style={styles.feesPaid}>
          Fees Paid: ₹{student.fees_paid.toLocaleString('en-IN')}
        </Text>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#4ADE80',
    padding: horizontalScale(20),
    marginBottom: verticalScale(15),
    marginHorizontal: 0,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#2563EB',
    elevation: 5,
    width: '100%',
  },
  selectedCard: {
    borderColor: '#2563EB',
    borderWidth: 4,
  },
  name: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#111827',
  },
  grade: {
    fontSize: normalize(14),
    color: '#111827',
    marginTop: verticalScale(4),
  },
  mobile: {
    fontSize: normalize(14),
    color: '#111827',
    marginTop: verticalScale(4),
  },
  feesPaid: {
    fontSize: normalize(14),
    color: '#111827',
    marginTop: verticalScale(6),
    fontWeight: 'bold',
  },
});

export default StudentCard;
