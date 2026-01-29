import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import DashboardStatsContent from './DashboardStatsContent';
import StudentInfoContent from './StudentInfoContent';
import StudentManagementContent from './StudentManagementContent';
import FeeManagementContent from './FeeManagementContent';
import { horizontalScale, verticalScale, normalize } from './ResponsiveUtils';

interface DashboardProps {
  onLogout: () => void;
}

const DashboardScreenContainer: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('Students'); 

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
          <Text style={styles.adminLabel}>Admin</Text>
        </TouchableOpacity>

        {/* NAVIGATION ITEMS */}
        <View style={styles.navGroup}>
          <SidebarItem icon="📊" label="Dashboard" isActive={activeTab === 'Dashboard'} onPress={() => setActiveTab('Dashboard')} />
          <SidebarItem icon="👥" label="Students" isActive={activeTab === 'Students'} onPress={() => setActiveTab('Students')} />
          <SidebarItem icon="🏛️" label="Fees" isActive={activeTab === 'Fees'} onPress={() => setActiveTab('Fees')} />
          <SidebarItem icon="👤" label="Profile" isActive={activeTab === 'Profile'} onPress={() => setActiveTab('Profile')} />
        </View>
      </View>

      {/* MAIN CONTENT AREA */}
      <View style={styles.contentArea}>
        {activeTab === 'Dashboard' && <DashboardStatsContent />}
        {activeTab === 'Students' && <StudentManagementContent />}
        {activeTab === 'Fees' && <FeeManagementContent />}
        {activeTab === 'Profile' && <StudentInfoContent />}
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