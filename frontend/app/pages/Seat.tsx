import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { User, Briefcase, Armchair, CreditCard, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TypeNavigationProp } from "../types/types";
import { useSelector } from 'react-redux';
import { showError } from "../components/Alter";

export default function Seat() {
  const navigation = useNavigation<TypeNavigationProp>();

  const orders = useSelector((state: any) => state.orders);
  const totalSelected: number = (Object.values(orders?.passenger_details || {}) as number[])
    .reduce((sum: number, v: number) => sum + (Number(v) || 0), 0);

  const handleSelectSeat = (item: any) => {
    navigation.navigate('SeatSelection', { flightId: item._id, departure: item.departure_airport_code, arrival: item.arrival_airport_code });
  }

  const onHandleNext = () => {
    const selectAll = orders.flights.every((flight: any) => {
      return flight?.path.every((item: any) => {
        console.log("Checking seats for item:", item);
        return item?.seats && item.seats.length > 0;
      });
    });

    if (selectAll) {
      navigation.navigate('Payment');
      return;
    }
    else {
      showError("Please select seats for all flights before proceeding.");
    }
  }



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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft color="#111827" size={30} />
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


            {orders?.flights?.map((flight: any, index: number) => (
              <View key={index}>
                {flight?.path?.map((item: any, idx: number) => (
                  <View style={styles.section} key={idx}>
                    <Text style={styles.sectionTitle}>Flight to {item.arrival_airport_code}</Text>

                    <TouchableOpacity
                      style={[
                        styles.flightCard,
                        item?.seats?.length > 0 && styles.flightCardSelected, // 🔥 Nếu có seats → tô viền xanh
                      ]}
                      onPress={() => handleSelectSeat(item)}
                    >
                      <View style={styles.flightInfo}>
                        <Armchair color="#6B7280" size={22} />
                        <View style={styles.flightDetails}>
                          <Text style={styles.flightRoute}>
                            {item.departure_airport_code} - {item.arrival_airport_code}
                          </Text>
                          <Text style={styles.flightPrice}>Seats from $5.00</Text>
                          {item?.seats && item.seats.length > 0 && (
                            <Text style={styles.selectedText}>
                              Seat selected: {item.seats.join(", ")}
                            </Text>
                          )}
                        </View>
                      </View>



                      <Text style={styles.selectLink}>Select</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}




          </View>
        </ScrollView>

        {/* Footer cố định */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${orders?.total_price || 0}</Text>
            <Text style={styles.priceNote}>{totalSelected} adult</Text>
          </View>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={onHandleNext}
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
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, flexDirection: 'row', alignItems: 'center' },
  backButton: { fontSize: 22, color: '#111827', marginBottom: 15 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex : 1 },
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
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  // 🔹 Khi flight đã chọn ghế
  flightCardSelected: {
    borderColor: '#00BCD4',        // Viền xanh
    backgroundColor: '#E0F7FA',    // Nền xanh nhạt
  },

  flightInfo: { flexDirection: 'row', alignItems: 'center' },
  flightDetails: { marginLeft: 12 },
  flightRoute: { fontSize: 15, fontWeight: '500', color: '#1F2937', marginBottom: 3 },
  flightPrice: { fontSize: 13, color: '#6B7280' },
  selectLink: { fontSize: 14, fontWeight: '600', color: '#8B5CF6' },
  selectedText: { fontSize: 13, color: '#0284C7', marginTop: 4, fontWeight: '500' },

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