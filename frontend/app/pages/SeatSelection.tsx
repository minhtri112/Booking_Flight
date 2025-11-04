import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Briefcase, Armchair, CreditCard } from 'lucide-react-native';
import {SafeAreaView} from "react-native-safe-area-context";

type SeatStatus = 'available' | 'unavailable' | 'selected';

export default function SeatSelection() {
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState<string | null>('3D');

  const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
  const rows = [1, 2, 3, 4, 5, 6, 7, 8];

  const getSeatStatus = (row: number, col: string): SeatStatus => {
    if (selectedSeat === `${row}${col}`) return 'selected';
    if (
      (row === 1 && (col === 'B' || col === 'D' || col === 'E')) ||
      (row === 2 && (col === 'B' || col === 'C' || col === 'E')) ||
      (row === 3 && (col === 'A' || col === 'B' || col === 'C' || col === 'E')) ||
      (row === 4 && (col === 'B' || col === 'C' || col === 'D' || col === 'E')) ||
      (row === 5 && (col === 'B' || col === 'E' || col === 'F')) ||
      (row === 6 && (col === 'B' || col === 'C' || col === 'E')) ||
      (row === 7 && (col === 'B' || col === 'C' || col === 'D' || col === 'E'))
    ) {
      return 'unavailable';
    }
    return 'available';
  };

  const renderSeat = (row: number, col: string) => {
    const status = getSeatStatus(row, col);
    const seatId = `${row}${col}`;
    const isSelected = selectedSeat === seatId;

    const seatStyle = [
      styles.seat,
      status === 'unavailable' && styles.seatUnavailable,
      isSelected && styles.seatSelected,
    ];

    return (
      <TouchableOpacity
        key={seatId}
        style={seatStyle}
        disabled={status === 'unavailable'}
        onPress={() => setSelectedSeat(seatId)}
      >
        {status === 'unavailable' && <Text style={styles.seatUnavailableText}>✕</Text>}
        {isSelected && <Text style={styles.seatSelectedText}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backButton}>←</Text>
            </TouchableOpacity>
            <View style={styles.stepIndicator}>
              <View style={[styles.stepIcon, styles.stepComplete]}>
                <User color="#fff" size={18} />
              </View>
              <View style={[styles.stepLine, styles.stepLineActive]} />
              <View style={[styles.stepIcon, styles.stepComplete]}>
                <Briefcase color="#fff" size={18} />
              </View>
              <View style={[styles.stepLine, styles.stepLineActive]} />
              <View style={[styles.stepIcon, styles.stepActive]}>
                <Armchair color="#fff" size={18} />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepIcon}>
                <CreditCard color="#9CA3AF" size={18} />
              </View>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendAvailable]} />
              <Text style={styles.legendText}>Available seat (from $5–$10)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendUnavailable]}>
                <Text style={styles.legendUnavailableText}>✕</Text>
              </View>
              <Text style={styles.legendText}>Unavailable seat</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.legendSelected]}>
                <Text style={styles.legendSelectedText}>✓</Text>
              </View>
              <Text style={styles.legendText}>Selected</Text>
            </View>
          </View>

          {/* Seat map */}
          <View style={styles.seatMapContainer}>
            {/* Column labels */}
            <View style={styles.columnLabels}>
              <Text style={styles.rowLabel}></Text>
              {columns.map((col, index) => (
                <View key={col} style={styles.columnWrapper}>
                  <Text style={styles.columnLabel}>{col}</Text>
                  {index === 2 && <View style={styles.aisle} />}
                </View>
              ))}
            </View>

            {rows.map((row) => (
              <View key={row} style={styles.row}>
                <Text style={styles.rowLabel}>{String(row).padStart(2, '0')}</Text>
                {columns.map((col, index) => (
                  <View key={col} style={styles.columnWrapper}>
                    {renderSeat(row, col)}
                    {index === 2 && <View style={styles.aisle} />}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.footerTitle}>Select seat 1 of 1</Text>
            <Text style={styles.footerSubtitle}>
              Seat {selectedSeat} - ${selectedSeat === '3D' ? '5.68' : '6.50'}
            </Text>
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={() => router.push('/pages/Payment')}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  wrapper: { flex: 1, justifyContent: 'space-between' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  backButton: { fontSize: 22, color: '#111827', marginBottom: 15 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  stepIcon: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#E5E7EB',
    justifyContent: 'center', alignItems: 'center',
  },
  stepActive: { backgroundColor: '#00BCD4' },
  stepComplete: { backgroundColor: '#00BCD4' },
  stepLine: { width: 28, height: 2, backgroundColor: '#E5E7EB' },
  stepLineActive: { backgroundColor: '#00BCD4' },

  legend: { paddingHorizontal: 20, paddingBottom: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  legendBox: {
    width: 24, height: 24, borderRadius: 4, marginRight: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  legendAvailable: { borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#fff' },
  legendUnavailable: { backgroundColor: '#F3F4F6' },
  legendUnavailableText: { fontSize: 12, color: '#9CA3AF' },
  legendSelected: { backgroundColor: '#00BCD4' },
  legendSelectedText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  legendText: { fontSize: 12, color: '#6B7280' },

  seatMapContainer: { alignItems: 'center', paddingHorizontal: 10 },
  columnLabels: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 ,   marginLeft: -10,},
  columnWrapper: { flexDirection: 'row', alignItems: 'center' },
  columnLabel: {
    width: 40, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#6B7280',
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  rowLabel: {
    width: 40, textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#6B7280',
  },
  seat: {
    width: 40, height: 40, borderRadius: 6, borderWidth: 1, borderColor: '#E5E7EB',
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginHorizontal: 2,
  },
  seatUnavailable: { backgroundColor: '#F3F4F6', borderColor: '#F3F4F6' },
  seatUnavailableText: { fontSize: 16, color: '#9CA3AF' },
  seatSelected: { backgroundColor: '#00BCD4', borderColor: '#00BCD4' },
  seatSelectedText: { fontSize: 16, color: '#fff', fontWeight: '700' },
  aisle: { width: 20 },

  footer: {
    borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff',
    paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  footerTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  footerSubtitle: { fontSize: 14, color: '#6B7280' },
  nextBtn: {
    backgroundColor: '#00BCD4', paddingVertical: 12,
    paddingHorizontal: 50, borderRadius: 8,
  },
  nextText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
