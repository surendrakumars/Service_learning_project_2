import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api, formatNumber } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

const DashboardStatsContent: React.FC = () => {
  const [stats, setStats] = useState<{ studentsEnrolled: number; feesCollected: number; feesPending: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await api.getDashboardStats();
        if (result.ok) {
          setStats(result.data);
        } else {
          setStats({ studentsEnrolled: 0, feesCollected: 0, feesPending: 0 });
        }
      } catch {
        setStats({ studentsEnrolled: 0, feesCollected: 0, feesPending: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  const studentsEnrolled = stats?.studentsEnrolled ?? 0;
  const feesCollected = stats?.feesCollected ?? 0;
  const feesPending = stats?.feesPending ?? 0;

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: verticalScale(50)}}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>Cambridge Kids Pre School</Text>
        <View style={styles.welcomeRow}>
          <Text style={styles.welcome}>Hello Admin</Text>
          <Text style={{fontSize: normalize(20)}}>👋</Text>
        </View>
        <Text style={styles.title}>DashBoard</Text>
      </View>

      <View style={styles.cardsLayout}>
        {/* Card 1: Students */}
        <View style={[styles.card, styles.alignLeft]}>
          <View style={[styles.cardHeader, { justifyContent: 'flex-start', gap: 15 }]}>
            <Text style={styles.bigNumber}>{studentsEnrolled}</Text>
            <Text style={styles.cardIcon}>👤</Text>
          </View>
          <Text style={styles.cardLabel}>Students enrolled</Text>
        </View>

        {/* Card 2: Fees Collected */}
        <View style={[styles.card, styles.alignRight]}>
          <View style={[styles.cardHeader, { justifyContent: 'flex-start', gap: 10 }]}>
             <Text style={styles.cardIcon}>₹↑</Text>
            <Text style={styles.bigNumber}>{formatNumber(feesCollected)}</Text>
          </View>
          <Text style={styles.cardLabel}>Fees Collected</Text>
        </View>

        {/* Card 3: Fee Pending */}
        <View style={[styles.card, styles.alignLeft]}>
          <View style={[styles.cardHeader, { justifyContent: 'flex-start', gap: 10 }]}>
             <Text style={styles.cardIcon}>₹↓</Text>
            <Text style={styles.bigNumber}>{formatNumber(feesPending)}</Text>
          </View>
          <Text style={styles.cardLabel}>Fee Pending</Text>
        </View>
      </View>

      <View style={styles.decorArea}>
          <View style={styles.bigGreenCircle}><View style={styles.centerBlueCircle} /></View>
          <View style={styles.floatingBlueDot} />
          <View style={styles.floatingGreenDot} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: verticalScale(20), marginTop: verticalScale(40) },
  schoolName: { fontSize: normalize(15), color: '#2563EB', fontWeight: 'bold', marginBottom: 5 },
  welcomeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 8 },
  welcome: { fontSize: normalize(18), fontWeight: 'bold', color: '#111827' },
  title: { fontSize: normalize(32), color: '#34D399', fontWeight: '400' },
  
  cardsLayout: { width: '100%', paddingHorizontal: horizontalScale(15) },
  card: { backgroundColor: '#4ADE80', borderRadius: 15, paddingVertical: verticalScale(15), paddingHorizontal: horizontalScale(20), width: '68%', marginBottom: verticalScale(20), elevation: 3 },
  alignLeft: { alignSelf: 'flex-start' },
  alignRight: { alignSelf: 'flex-end' },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  bigNumber: { fontSize: normalize(24), fontWeight: 'bold', color: '#111827' },
  cardIcon: { fontSize: normalize(22), color: '#111827' },
  cardLabel: { fontSize: normalize(13), color: '#1F2937', opacity: 0.8 },
  
  decorArea: { height: verticalScale(250), width: '100%', alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: 10 },
  bigGreenCircle: { width: horizontalScale(160), height: horizontalScale(160), borderRadius: horizontalScale(80), backgroundColor: '#4ADE80', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: verticalScale(20) },
  centerBlueCircle: { width: horizontalScale(90), height: horizontalScale(90), borderRadius: horizontalScale(45), backgroundColor: '#2563EB' },
  floatingBlueDot: { position: 'absolute', top: verticalScale(50), right: horizontalScale(30), width: horizontalScale(40), height: horizontalScale(40), borderRadius: horizontalScale(20), backgroundColor: '#2563EB' },
  floatingGreenDot: { position: 'absolute', bottom: verticalScale(20), right: horizontalScale(10), width: horizontalScale(50), height: horizontalScale(50), borderRadius: horizontalScale(25), backgroundColor: '#4ADE80' },
});

export default DashboardStatsContent;