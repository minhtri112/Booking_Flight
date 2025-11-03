import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Briefcase, Armchair, CreditCard } from 'lucide-react-native';
import { SafeAreaView  } from 'react-native-safe-area-context';

export default function Seat() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        {/* Nội dung cuộn */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

          {/* Body */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.title}>Seat</Text>
            <Text style={styles.subTitle}>Select your preferred seat for each flight</Text>

            {/* Flight Section 1 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Flight to New York</Text>
              <TouchableOpacity style={styles.flightCard} onPress={() => router.push('/pages/SeatSelection')}>
                <View style={styles.flightInfo}>
                  <Armchair color="#6B7280" size={22} />
                  <View style={styles.flightDetails}>
                    <Text style={styles.flightRoute}>LCY - JFK</Text>
                    <Text style={styles.flightPrice}>Seats from $5.00</Text>
                  </View>
                </View>
                <Text style={styles.selectLink}>Select</Text>
              </TouchableOpacity>
            </View>

            {/* Flight Section 2 */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Flight to London</Text>
              <TouchableOpacity style={styles.flightCard} onPress={() => router.push('/pages/SeatSelection')}>
                <View style={styles.flightInfo}>
                  <Armchair color="#6B7280" size={22} />
                  <View style={styles.flightDetails}>
                    <Text style={styles.flightRoute}>LCY - LHR</Text>
                    <Text style={styles.flightPrice}>Seats from $4.59</Text>
                  </View>
                </View>
                <Text style={styles.selectLink}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer cố định */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>$806</Text>
            <Text style={styles.priceNote}>1 adult</Text>
          </View>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={() => router.push('/pages/SeatSelection')}
          >
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: { backgroundColor: '#00BCD4' },
  stepComplete: { backgroundColor: '#00BCD4' },
  stepLine: { width: 28, height: 2, backgroundColor: '#E5E7EB' },
  stepLineActive: { backgroundColor: '#00BCD4' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 10 },
  subTitle: { fontSize: 15, color: '#4B5563', fontWeight: '500', marginVertical: 15 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 10 },
  flightCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  flightInfo: { flexDirection: 'row', alignItems: 'center' },
  flightDetails: { marginLeft: 12 },
  flightRoute: { fontSize: 15, fontWeight: '500', color: '#1F2937', marginBottom: 3 },
  flightPrice: { fontSize: 13, color: '#6B7280' },
  selectLink: { fontSize: 14, fontWeight: '600', color: '#8B5CF6' },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: { fontSize: 24, fontWeight: '700', color: '#111827' },
  priceNote: { fontSize: 14, color: '#6B7280' },
  nextBtn: {
    backgroundColor: '#00BCD4',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  nextText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
