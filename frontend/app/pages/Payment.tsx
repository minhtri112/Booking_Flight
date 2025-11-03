import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { User, Briefcase, Armchair, CreditCard, Mail, Phone } from 'lucide-react-native';
import axios from 'axios';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Payment() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('mastercard');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Modal state

  // Parse bookingData từ params
  useEffect(() => {
    if (params.bookingData) {
      try {
        const decoded = decodeURIComponent(params.bookingData as string);
        const parsed = JSON.parse(decoded);
        setBookingData(parsed);
      } catch (err) {
        console.error('Error parsing booking data', err);
        setBookingData(null);
      }
    }
  }, [params.bookingData]);

  const toggleNewCardForm = () => {
    LayoutAnimation.easeInEaseOut();
    setShowNewCardForm(!showNewCardForm);
  };

  const saveNewCard = () => {
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
      return Alert.alert('Incomplete info', 'Please fill all card fields.');
    }
    setSelectedMethod('newcard');
    toggleNewCardForm();
  };

  const handleCheckout = async () => {
    if (!bookingData) return Alert.alert('Error', 'Booking data not found!');

    const allSeatsChosen = bookingData.flights.every(
      (f: any) => bookingData.seats[f.flight_id] && bookingData.seats[f.flight_id].length > 0
    );
    if (!allSeatsChosen) {
      Alert.alert('Missing seats', 'Please select seats for all flights.');
      return;
    }

    const flightsPayload = bookingData.flights.map((f: any) => ({
      flight_id: f.flight_id,
      seat_numbers: bookingData.seats[f.flight_id],
      passenger_details: [{ passenger_type: 'adult', quantity: 1 }],
    }));

    const baggage = bookingData.baggage || {};
    const traveller = bookingData.traveller || {};

    let paymentInfo: any = selectedMethod;
    if (selectedMethod === 'newcard') {
      paymentInfo = {
        type: 'card',
        card_number: newCard.number,
        cardholder_name: newCard.name,
        expiry: newCard.expiry,
        cvv: newCard.cvv,
      };
    }

    const payload = {
      account_id: traveller.email || 'unknown',
      payment_method: paymentInfo,
      contact_name: `${traveller.firstName} ${traveller.lastName}`,
      baggage_option: {
        type: baggage.type || 'none',
        price: (baggage.checkedBagPrice || 0) + (baggage.insurancePrice || 0),
      },
      flights: flightsPayload,
    };

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/flights/booking', payload);

      if (res.data.status) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.push({
            pathname: '/pages/BookingSuccess',
            params: {
              bookingId: res.data.order_id || '',
              bookingData: encodeURIComponent(JSON.stringify(bookingData)),
            },
          });
        }, 1500); // 1.5 giây
      } else {
        Alert.alert('Booking failed', res.data.message || 'Unknown error');
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert('Booking error', err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData || !bookingData.flights) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text>Booking data not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalTicket = bookingData.flights.reduce((sum: number, f: any) => sum + (f.ticket_price || 0), 0);
  const baggagePrice = bookingData.baggage
    ? (bookingData.baggage.checkedBagPrice || 0) + (bookingData.baggage.insurancePrice || 0)
    : 0;
  const totalPrice = totalTicket + baggagePrice;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
              <View style={[styles.stepIcon, styles.stepComplete]}>
                <Armchair color="#fff" size={18} />
              </View>
              <View style={[styles.stepLine, styles.stepLineActive]} />
              <View style={[styles.stepIcon, styles.stepActive]}>
                <CreditCard color="#fff" size={18} />
              </View>
            </View>
          </View>

          {/* Payment Options */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.title}>Payment</Text>
            <Text style={styles.subTitle}>Select a payment method</Text>

            {/* MasterCard */}
            <TouchableOpacity style={styles.option} onPress={() => setSelectedMethod('mastercard')}>
              <View style={styles.optionLeft}>
                <View style={styles.radioOuter}>{selectedMethod === 'mastercard' && <View style={styles.radioInner} />}</View>
                <View style={styles.mastercardLogo}>
                  <View style={[styles.circle, styles.circleRed]} />
                  <View style={[styles.circle, styles.circleYellow]} />
                </View>
                <Text style={styles.optionTitle}>MasterCard **** 1234</Text>
              </View>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>

            {/* Visa */}
            <TouchableOpacity style={styles.option} onPress={() => setSelectedMethod('visa')}>
              <View style={styles.optionLeft}>
                <View style={styles.radioOuter}>{selectedMethod === 'visa' && <View style={styles.radioInner} />}</View>
                <View style={styles.visaLogo}>
                  <Text style={styles.visaText}>VISA</Text>
                </View>
                <Text style={styles.optionTitle}>Visa **** 5678</Text>
              </View>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>

            {/* New Card Form */}
            <TouchableOpacity style={styles.newCardButton} onPress={toggleNewCardForm}>
              <Text style={styles.newCardText}>{showNewCardForm ? '− Hide form' : '+ New card'}</Text>
            </TouchableOpacity>

            {showNewCardForm && (
              <View style={styles.cardForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Cardholder Name"
                  value={newCard.name}
                  onChangeText={(text) => setNewCard({ ...newCard, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Card Number"
                  keyboardType="numeric"
                  value={newCard.number}
                  onChangeText={(text) => setNewCard({ ...newCard, number: text })}
                />
                <View style={styles.inputRow}>
                  <TextInput
                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                    placeholder="Expiry Date (MM/YY)"
                    value={newCard.expiry}
                    onChangeText={(text) => setNewCard({ ...newCard, expiry: text })}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="CVV"
                    secureTextEntry
                    keyboardType="numeric"
                    value={newCard.cvv}
                    onChangeText={(text) => setNewCard({ ...newCard, cvv: text })}
                  />
                </View>
                <TouchableOpacity style={styles.saveCardBtn} onPress={saveNewCard}>
                  <Text style={styles.saveCardText}>Save card</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Traveller Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Traveller details</Text>
              <View style={styles.detailRow}>
                <User color="#6B7280" size={20} />
                <Text style={styles.detailName}>{bookingData.traveller.firstName} {bookingData.traveller.lastName}</Text>
                <Text style={styles.detailInfo}>Adult</Text>
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact details</Text>
              <View style={styles.detailRow}>
                <Mail color="#6B7280" size={20} />
                <Text style={styles.detailText}>{bookingData.traveller.email}</Text>
              </View>
              <View style={styles.detailRow}>
                <Phone color="#6B7280" size={20} />
                <Text style={styles.detailText}>{bookingData.traveller.phone}</Text>
              </View>
            </View>

            {/* Flights & Seats */}
            {bookingData.flights.map((f: any) => (
              <View key={f.flight_id} style={styles.section}>
                <Text style={styles.sectionTitle}>Flight {f.departure_airport_code} → {f.arrival_airport_code}</Text>
                <Text>Seats: {bookingData.seats[f.flight_id].join(', ')}</Text>
                <Text>Ticket: ${f.ticket_price.toFixed(2)}</Text>
              </View>
            ))}

            {/* Baggage */}
            {bookingData.baggage && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Baggage</Text>
                <Text>Price: ${baggagePrice.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${totalPrice.toFixed(2)}</Text>
            <Text style={styles.priceNote}>{Object.values(bookingData.seats).flat().length} seat(s)</Text>
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleCheckout}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.nextText}>Checkout</Text>}
          </TouchableOpacity>
        </View>

        
        <Modal transparent visible={showSuccessModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Thanh toán thành công!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  wrapper: { flex: 1, justifyContent: 'space-between' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 10 },
  option: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  optionTitle: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  editLink: { fontSize: 14, fontWeight: '600', color: '#8B5CF6' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00BCD4' },
  mastercardLogo: { flexDirection: 'row', marginRight: 8 },
  circle: { width: 18, height: 18, borderRadius: 9 },
  circleRed: { backgroundColor: '#EB001B', marginRight: -6 },
  circleYellow: { backgroundColor: '#F79E1B' },
  visaLogo: { backgroundColor: '#F3F4F6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginRight: 8 },
  visaText: { fontSize: 14, fontWeight: '800', color: '#1A1F71', letterSpacing: 0.5 },
  newCardButton: { paddingVertical: 16, alignItems: 'center' },
  newCardText: { fontSize: 14, fontWeight: '600', color: '#00BCD4' },
  cardForm: { marginTop: 10, backgroundColor: '#F9FAFB', padding: 15, borderRadius: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 6, padding: 10, marginBottom: 10, fontSize: 14 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  saveCardBtn: { backgroundColor: '#00BCD4', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  saveCardText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  detailName: { fontSize: 15, fontWeight: '500', color: '#1F2937', marginLeft: 10, flex: 1 },
  detailInfo: { fontSize: 13, color: '#6B7280' },
  detailText: { fontSize: 15, color: '#1F2937', marginLeft: 10 },
  footer: { borderTopWidth: 1, borderTopColor: '#E5E7EB', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 24, fontWeight: '700', color: '#111827' },
  priceNote: { fontSize: 14, color: '#6B7280' },
  nextBtn: { backgroundColor: '#00BCD4', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 8 },
  nextText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 18, fontWeight: '700', color: '#00BCD4' },
});
