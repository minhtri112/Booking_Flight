import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { User, Briefcase, ShieldCheck, CreditCard, Armchair } from 'lucide-react-native';

export default function BaggageInformation() {
  const router = useRouter();
  const { flightIds: flightIdsParam, travellerData } = useLocalSearchParams();

  // Parse flightIds mảng
  let flightIds: string[] = [];
  try {
    flightIds =
      typeof flightIdsParam === 'string'
        ? JSON.parse(flightIdsParam)
        : flightIdsParam || [];
  } catch (error) {
    console.warn('Failed to parse flightIds:', error);
  }

  // Parse travellerData
  let parsedTravellerData: any = null;
  try {
    parsedTravellerData =
      typeof travellerData === 'string' ? JSON.parse(travellerData) : travellerData;
  } catch (error) {
    console.warn('Failed to parse travellerData:', error);
  }

  const [checkedBag, setCheckedBag] = useState(false);
  const [insurance, setInsurance] = useState(false);

  const handleNext = () => {
    if (!parsedTravellerData) {
      Alert.alert('Error', 'Traveller data is missing');
      return;
    }

    const baggageData = {
      checkedBag,
      checkedBagPrice: checkedBag ? 19.99 : 0,
      insurance,
      insurancePrice: insurance ? 19.99 : 0,
    };

    router.push({
      pathname: '/pages/Seat',
      params: {
        flightIds: JSON.stringify(flightIds),
        travellerData: JSON.stringify(parsedTravellerData),
        baggageData: JSON.stringify(baggageData),
      },
    });
  };

  const basePrice = 320;
  const totalPrice =
    basePrice + (checkedBag ? 19.99 : 0) + (insurance ? 19.99 : 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
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
              <View style={[styles.stepIcon, styles.stepActive]}>
                <Briefcase color="#fff" size={18} />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepIcon}>
                <Armchair color="#9CA3AF" size={18} />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepIcon}>
                <CreditCard color="#9CA3AF" size={18} />
              </View>
            </View>
          </View>

          {/* Main content */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.title}>Baggage information</Text>
            <Text style={styles.subTitle}>Add baggage and protection</Text>

            {parsedTravellerData && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Traveller:</Text>
                <Text style={styles.infoText}>
                  {parsedTravellerData.firstName} {parsedTravellerData.lastName}
                </Text>
              </View>
            )}

            {flightIds.map((flightId, index) => (
              <View key={flightId} style={styles.flightSection}>
                <Text style={styles.flightTitle}>
                  {index === 0 ? 'Outbound flight' : 'Return flight'}
                </Text>

                {/* Cabin bag */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Cabin bag</Text>
                  <TouchableOpacity style={styles.option}>
                    <View style={styles.optionLeft}>
                      <Briefcase color="#6B7280" size={22} />
                      <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Personal item only</Text>
                        <Text style={styles.optionSubtitle}>Included per traveller</Text>
                      </View>
                    </View>
                    <View style={styles.radioOuter}>
                      <View style={styles.radioInner} />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Checked bag */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Checked bags</Text>

                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => setCheckedBag(true)}
                  >
                    <View style={styles.optionLeft}>
                      <Briefcase color="#6B7280" size={22} />
                      <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>
                          1 checked bag (Max 22.1 lbs)
                        </Text>
                        <Text style={styles.optionSubtitle}>from $19.99</Text>
                      </View>
                    </View>
                    <View style={styles.radioOuter}>
                      {checkedBag && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.option}
                    onPress={() => setCheckedBag(false)}
                  >
                    <View style={styles.optionLeft}>
                      <View style={styles.noBagIcon}>
                        <Text style={styles.noBagText}>✕</Text>
                      </View>
                      <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>No checked bag</Text>
                        <Text style={styles.optionSubtitle}>$00.00</Text>
                      </View>
                    </View>
                    <View style={styles.radioOuter}>
                      {!checkedBag && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Travel protection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Travel protection</Text>

              <TouchableOpacity
                style={styles.option}
                onPress={() => setInsurance(true)}
              >
                <View style={styles.optionLeft}>
                  <ShieldCheck color="#6B7280" size={22} />
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>Travel insurance</Text>
                    <Text style={styles.optionSubtitle}>from $19.99</Text>
                  </View>
                </View>
                <View style={styles.radioOuter}>
                  {insurance && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.option}
                onPress={() => setInsurance(false)}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.noBagIcon}>
                    <Text style={styles.noBagText}>✕</Text>
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>No insurance</Text>
                    <Text style={styles.optionSubtitle}>$00.00</Text>
                  </View>
                </View>
                <View style={styles.radioOuter}>
                  {!insurance && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${totalPrice.toFixed(2)}</Text>
            <Text style={styles.priceNote}>1 adult</Text>
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  wrapper: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  backButton: { fontSize: 22, color: '#111827', marginBottom: 15 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  stepIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' },
  stepActive: { backgroundColor: '#00BCD4' },
  stepComplete: { backgroundColor: '#00BCD4' },
  stepLine: { width: 28, height: 2, backgroundColor: '#E5E7EB' },
  stepLineActive: { backgroundColor: '#00BCD4' },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 10 },
  subTitle: { fontSize: 15, color: '#4B5563', fontWeight: '500', marginVertical: 15 },
  infoBox: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, marginBottom: 20 },
  infoLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  infoText: { fontSize: 14, fontWeight: '600', color: '#111827' },
  flightSection: { marginBottom: 25 },
  flightTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 10 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 10 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  optionText: { marginLeft: 12, flex: 1 },
  optionTitle: { fontSize: 14, fontWeight: '500', color: '#1F2937', marginBottom: 3 },
  optionSubtitle: { fontSize: 12, color: '#6B7280' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00BCD4' },
  noBagIcon: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  noBagText: { fontSize: 13, color: '#9CA3AF' },
  footer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 24, fontWeight: '700', color: '#111827' },
  priceNote: { fontSize: 14, color: '#6B7280' },
  nextBtn: { backgroundColor: '#00BCD4', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 8 },
  nextText: { fontSize: 16, color: '#fff', fontWeight: '600' },
});
