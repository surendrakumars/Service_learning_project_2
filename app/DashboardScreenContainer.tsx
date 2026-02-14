import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DashboardStatsContent from './DashboardStatsContent';
import FeeManagementContent from './FeeManagementContent';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';
import StudentInfoContent from './StudentInfoContent';
import StudentManagementContent from './StudentManagementContent';

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
    setActiveTab('Profile'); // Switch to Profile tab when a student is selected
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      {/* SIDEBAR */}
      <View style={styles.sidebar}>
        
        {/* LOGO AREA (Click to Logout) */}
        <TouchableOpacity style={styles.logoContainer} onPress={onLogout}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner} />
          </View>
          {/* Added "Admin" Text Here */}
          <Text style={styles.adminLabel}>{userRole === 'admin' ? 'Admin' : 'Staff'}</Text>
        </TouchableOpacity>

        {/* NAVIGATION ITEMS */}
        <View style={styles.navGroup}>
          <SidebarItem icon="📊" label="Dashboard" isActive={activeTab === 'Dashboard'} onPress={() => { setActiveTab('Dashboard'); setRefreshTrigger(prev => prev + 1); }} />
          <SidebarItem icon="👥" label="Students" isActive={activeTab === 'Students'} onPress={() => setActiveTab('Students')} />
          <SidebarItem icon="🏛️" label="Fees" isActive={activeTab === 'Fees'} onPress={() => setActiveTab('Fees')} />
          <SidebarItem icon="👤" label="Profile" isActive={activeTab === 'Profile'} onPress={() => setActiveTab('Profile')} />
        </View>
      </View>

      {/* MAIN CONTENT AREA */}
      <View style={styles.contentArea}>
        <View style={styles.tabContent}>
          {activeTab === 'Dashboard' && <DashboardStatsContent refreshTrigger={refreshTrigger} />}
          {activeTab === 'Students' && <StudentManagementContent onSelectStudent={handleSelectStudent} userRole={userRole} />}
          {activeTab === 'Fees' && <FeeManagementContent />}
          {activeTab === 'Profile' && <StudentInfoContent studentId={selectedStudentId} />}
        </View>
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
  contentArea: { flex: 1, backgroundColor: '#FFFFFF' },
  tabContent: { flex: 1 }, 
  
  sidebar: { width: horizontalScale(90), backgroundColor: '#2563EB', alignItems: 'center', paddingVertical: verticalScale(40) },
  
  // Updated container to align text and circle
  logoContainer: { marginBottom: verticalScale(40), alignItems: 'center' },
  
  logoOuter: { width: horizontalScale(50), height: horizontalScale(50), borderRadius: horizontalScale(25), backgroundColor: '#2DD4BF', justifyContent: 'center', alignItems: 'center' },
  logoInner: { width: horizontalScale(28), height: horizontalScale(28), borderRadius: horizontalScale(14), backgroundColor: '#FBBF24' },
  
  // New Style for Admin Text
  adminLabel: {
    color: '#FFFFFF',
    fontSize: normalize(12),
    fontWeight: 'bold',
    marginTop: verticalScale(5), // Space between circle and text
    opacity: 0.9
  },

  navGroup: { gap: verticalScale(25), width: '100%', alignItems: 'center' },
  
  item: { alignItems: 'center', justifyContent: 'center', width: horizontalScale(70), paddingVertical: verticalScale(12), borderRadius: 18 },
  itemActive: { backgroundColor: '#FBBF24', elevation: 5 },
  
  icon: { fontSize: normalize(26), marginBottom: 5 },
  iconActive: { color: '#FFFFFF', opacity: 1 },
  iconInactive: { color: '#FFFFFF', opacity: 0.7 },
  
  label: { fontSize: normalize(11), color: '#FFFFFF', opacity: 0.8 },
  labelActive: { fontWeight: 'bold', opacity: 1 },
});

export default DashboardScreenContainer;
