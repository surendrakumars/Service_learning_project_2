import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import DashboardStatsContent from './DashboardStatsContent';
import StudentInfoContent from './StudentInfoContent';
import StudentManagementContent from './StudentManagementContent';
import FeeManagementContent from './FeeManagementContent';
import UserManagementContent from './UserManagementContent';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

interface DashboardProps {
  onLogout: () => void;
  userRole: 'admin' | 'staff';
}

const DashboardScreenContainer: React.FC<DashboardProps> = ({ onLogout, userRole }) => {
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.logoContainer} onPress={onLogout}>
          <Image source={require('../assets/logo.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.adminLabel}>{userRole === 'admin' ? 'Admin' : 'Staff'}</Text>
        </TouchableOpacity>

        <View style={styles.navGroup}>
          <SidebarItem
            icon={String.fromCodePoint(0x1F4CA)}
            label="Dashboard"
            isActive={activeTab === 'Dashboard'}
            onPress={() => {
              setActiveTab('Dashboard');
              setRefreshTrigger(prev => prev + 1);
            }}
          />
          <SidebarItem
            icon={String.fromCodePoint(0x1F465)}
            label="Students"
            isActive={activeTab === 'Students'}
            onPress={() => setActiveTab('Students')}
          />
          <SidebarItem
            icon={String.fromCodePoint(0x1F3DB, 0xFE0F)}
            label="Fees"
            isActive={activeTab === 'Fees'}
            onPress={() => setActiveTab('Fees')}
          />
          <SidebarItem
            icon={String.fromCodePoint(0x1F464)}
            label="Profile"
            isActive={activeTab === 'Profile'}
            onPress={() => setActiveTab('Profile')}
          />
          {userRole === 'admin' && (
            <SidebarItem
              icon={String.fromCodePoint(0x1F465)}
              label="Users"
              isActive={activeTab === 'Users'}
              onPress={() => setActiveTab('Users')}
            />
          )}
        </View>
      </View>

      <View style={styles.contentArea}>
        {activeTab === 'Dashboard' && <DashboardStatsContent refreshTrigger={refreshTrigger} />}
        {activeTab === 'Students' && (
          <StudentManagementContent onSelectStudent={handleSelectStudent} userRole={userRole} />
        )}
        {activeTab === 'Fees' && <FeeManagementContent />}
        {activeTab === 'Profile' && <StudentInfoContent studentId={selectedStudentId} />}
        {activeTab === 'Users' && userRole === 'admin' && <UserManagementContent />}
      </View>
    </SafeAreaView>
  );
};

const SidebarItem = ({ icon, label, isActive, onPress }: any) => (
  <TouchableOpacity style={[styles.item, isActive && styles.itemActive]} onPress={onPress}>
    <Text style={[styles.icon, isActive ? styles.iconActive : styles.iconInactive]}>{icon}</Text>
    <Text style={[styles.label, isActive && styles.labelActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: '#FFFFFF' },
  contentArea: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 0, paddingTop: 0 },

  sidebar: {
    width: horizontalScale(90),
    backgroundColor: '#2563EB',
    alignItems: 'center',
    paddingVertical: verticalScale(40),
  },

  logoContainer: { marginBottom: verticalScale(40), alignItems: 'center' },
  logoImage: {
    width: horizontalScale(50),
    height: horizontalScale(50),
    borderRadius: horizontalScale(25),
    backgroundColor: '#FFFFFF',
  },

  adminLabel: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: 'bold',
    marginTop: verticalScale(5),
    opacity: 0.9,
  },

  navGroup: { gap: verticalScale(25), width: '100%', alignItems: 'center' },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: horizontalScale(70),
    paddingVertical: verticalScale(12),
    borderRadius: 18,
  },
  itemActive: { backgroundColor: '#FBBF24', elevation: 5 },

  icon: { fontSize: normalize(24), marginBottom: 5 },
  iconActive: { color: '#FFFFFF', opacity: 1 },
  iconInactive: { color: '#FFFFFF', opacity: 0.7 },

  label: { fontSize: normalize(11), color: '#FFFFFF', opacity: 0.8 },
  labelActive: { fontWeight: 'bold', opacity: 1 },
});

export default DashboardScreenContainer;
