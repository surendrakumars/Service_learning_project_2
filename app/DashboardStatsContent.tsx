import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { api, isAuthErrorMessage } from '../lib/api';
import { horizontalScale, normalize, verticalScale } from './ResponsiveUtils';

const formatNumber = (value: number) => {
  return value.toLocaleString('en-IN');
};

interface DashboardStatsContentProps {
  refreshTrigger?: number;
}

const DashboardStatsContent: React.FC<DashboardStatsContentProps> = ({ refreshTrigger }) => {
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [totalFeesCollected, setTotalFeesCollected] = useState<number | null>(null);
  const [monthFeesCollected, setMonthFeesCollected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getDashboardStats();
      if (response?.success && response.data) {
        setTotalStudents(response.data.totalStudents);
        setTotalFeesCollected(response.data.totalFeesCollected);
        setMonthFeesCollected(response.data.monthFeesCollected);
      } else {
        const errMsg = response?.error || 'Failed to fetch dashboard statistics.';
        if (isAuthErrorMessage(errMsg)) {
          return;
        }
        setError(errMsg);
        Alert.alert('Error', errMsg);
      }
    } catch (err) {
      setError('Network error: Could not connect to the backend.');
      Alert.alert(
        'Network Error',
        'Could not connect to the backend. Please check your internet connection.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  useEffect(() => {
    if (refreshTrigger !== undefined) {
      fetchDashboardStats();
    }
  }, [refreshTrigger, fetchDashboardStats]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading dashboard</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(50) }}>
      <View style={styles.header}>
        <Text style={styles.schoolName}>Cambridge Little Kids</Text>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <View style={styles.cardsLayout}>
        <View style={[styles.card, styles.alignLeft]}>
          <Text style={styles.bigNumber}>
            {totalStudents !== null ? formatNumber(totalStudents) : '--'}
          </Text>
          <Text style={styles.cardLabel}>Students enrolled</Text>
        </View>

        <View style={[styles.card, styles.alignRight]}>
          <Text style={styles.bigNumber}>
            {totalFeesCollected !== null ? formatNumber(totalFeesCollected) : '--'}
          </Text>
          <Text style={styles.cardLabel}>Fees collected</Text>
        </View>
      </View>

      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Fees Collected This Month</Text>
        <View style={styles.graphTrack}>
          <View
            style={[
              styles.graphBar,
              {
                width: `${Math.max(
                  8,
                  Math.min(
                    100,
                    totalFeesCollected && totalFeesCollected > 0
                      ? ((monthFeesCollected ?? 0) / totalFeesCollected) * 100
                      : 0
                  )
                )}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.graphValue}>
          Rs {monthFeesCollected !== null ? formatNumber(monthFeesCollected) : '--'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginVertical: verticalScale(30) },
  schoolName: { fontSize: normalize(15), color: '#2563EB', fontWeight: 'bold' },
  title: { fontSize: normalize(32), color: '#34D399' },

  cardsLayout: { paddingHorizontal: horizontalScale(15) },
  card: {
    backgroundColor: '#4ADE80',
    borderRadius: 15,
    padding: verticalScale(20),
    width: '70%',
    marginBottom: verticalScale(20),
  },
  alignLeft: { alignSelf: 'flex-start' },
  alignRight: { alignSelf: 'flex-end' },

  bigNumber: { fontSize: normalize(24), fontWeight: 'bold' },
  cardLabel: { fontSize: normalize(13), color: '#1F2937' },

  graphContainer: {
    marginTop: verticalScale(15),
    marginHorizontal: horizontalScale(15),
    backgroundColor: '#E0F2FE',
    borderRadius: 15,
    paddingVertical: verticalScale(18),
    paddingHorizontal: horizontalScale(16),
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  graphTitle: {
    fontSize: normalize(15),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: verticalScale(10),
  },
  graphTrack: {
    width: '100%',
    height: verticalScale(20),
    backgroundColor: '#BFDBFE',
    borderRadius: 99,
    overflow: 'hidden',
  },
  graphBar: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 99,
  },
  graphValue: {
    marginTop: verticalScale(10),
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#111827',
  },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: verticalScale(10), fontSize: normalize(16) },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: normalize(16), color: 'red' },
});

export default DashboardStatsContent;

