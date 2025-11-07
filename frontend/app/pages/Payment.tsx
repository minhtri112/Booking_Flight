import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter,useNavigation } from 'expo-router';
import { User, Briefcase, Armchair, CreditCard, Mail, Phone, ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TypeNavigationProp } from "../types/types";
import { showError, showSuccess } from "../components/Alter";
import { useSelector } from 'react-redux';
import FetchApi from '../services/fetchAPI';
import * as SecureStore from 'expo-secure-store';

// Kích hoạt animation mượt cho Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Payment() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('mastercard');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });
  const orders = useSelector((state: any) => state.orders);
  const [userId,setUserId] = useState("");
  const navigation = useNavigation<TypeNavigationProp>();

  const totalSelected: number = (Object.values(orders?.passenger_details || {}) as number[])
    .reduce((sum: number, v: number) => sum + (Number(v) || 0), 0);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = await SecureStore.getItemAsync('token');
      if(!token){
        showError("You must be logged in to proceed to payment.");
        navigation.navigate('Login');
        return;
      }
      const user = await FetchApi.get(`accounts/${token}`);
      if(user.data && user.data._id){
        setUserId(user.data._id);
      }
      else {
        showError("Failed to fetch user information. Please log in again.");
        navigation.navigate('Login');
      } 
    }
    fetchUserId();

  },[navigation]);


  const toggleNewCardForm = () => {
    LayoutAnimation.easeInEaseOut();
    setShowNewCardForm(!showNewCardForm);
  };

  const handleCheckout = () => {
    let orderDetails : any = [];
    let order = {
      account_id : userId,
      total_price : orders.total_price,
      passenger_count : totalSelected,
      passenger_details : orders.passenger_details,
      contact_name : orders.contact_name,
      baggage_option : orders.baggage_option,
      phone : orders.phone,
      type_trip : orders.type_trip,
      payment_method : selectedMethod,
    };
    orders.flights.forEach((flight: any) => {
      console.log("Flight ID:", flight._id);
      flight.path.forEach((item: any) => {
        orderDetails.push({id : item._id, seats : item.seats, price : item.ticket_price});
        console.log("Selected seats for item:", item);
      });
    });

    const handlePayment = async () => {
       try{
         const req = await FetchApi.post('flights/booking', {
           orderDetails,
           order
         });
         if(req.data){
            showSuccess("Payment successful!");
            navigation.navigate('BookingSuccess',{orderId: req.data._id});
         }
       }
       catch(err){
          console.error("Payment error:", err);
          showError("Payment failed. Please try again.");
          return;
       }
    }
    handlePayment();

  }

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
              <View style={[styles.stepIcon, styles.stepComplete]}>
                <Armchair color="#fff" size={18} />
              </View>
              <View style={[styles.stepLine, styles.stepLineActive]} />
              <View style={[styles.stepIcon, styles.stepActive]}>
                <CreditCard color="#fff" size={18} />
              </View>
            </View>
          </View>

          {/* Body */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.title}>Payment</Text>
            <Text style={styles.subTitle}>Select a payment method</Text>

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment method</Text>

              {/* MasterCard */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => setSelectedMethod('mastercard')}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.radioOuter}>
                    {selectedMethod === 'mastercard' && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.mastercardLogo}>
                    <View style={[styles.circle, styles.circleRed]} />
                    <View style={[styles.circle, styles.circleYellow]} />
                  </View>
                  <Text style={styles.optionTitle}>MasterCard **** 9876</Text>
                </View>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>

              {/* Visa */}
              <TouchableOpacity
                style={styles.option}
                onPress={() => setSelectedMethod('visa')}
              >
                <View style={styles.optionLeft}>
                  <View style={styles.radioOuter}>
                    {selectedMethod === 'visa' && <View style={styles.radioInner} />}
                  </View>

                  {/* Logo Visa */}
                  <View style={styles.visaLogo}>
                    <Text style={styles.visaText}>VISA</Text>
                  </View>

                  <Text style={styles.optionTitle}>Visa **** 5642</Text>
                </View>
                <Text style={styles.editLink}>Edit</Text>
              </TouchableOpacity>

              {/* Add new card */}
              <TouchableOpacity style={styles.newCardButton} onPress={toggleNewCardForm}>
                <Text style={styles.newCardText}>
                  {showNewCardForm ? '− Hide form' : '+ New card'}
                </Text>
              </TouchableOpacity>

              {/* Form nhập thông tin thẻ */}
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
                  <TouchableOpacity style={styles.saveCardBtn}>
                    <Text style={styles.saveCardText}>Save card</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Traveller Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Traveller details</Text>
              <View style={styles.detailRow}>
                <User color="#6B7280" size={20} />
                <Text style={styles.detailName}>Pedro Moreno</Text>
                <Text style={styles.detailInfo}>Adult • Male</Text>
              </View>
            </View>

            {/* Contact Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact details</Text>
              <View style={styles.detailRow}>
                <Mail color="#6B7280" size={20} />
                <Text style={styles.detailText}>pedromoreno@gmail.com</Text>
              </View>
              <View style={styles.detailRow}>
                <Phone color="#6B7280" size={20} />
                <Text style={styles.detailText}>(208) 567-8209</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${orders?.total_price || 0}</Text>
            <Text style={styles.priceNote}>{totalSelected} person</Text>
          </View>
          <TouchableOpacity
            style={styles.nextBtn}
            onPress={handleCheckout}
          >
            <Text style={styles.nextText}>Checkout</Text>
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
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 },
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
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  optionTitle: { fontSize: 14, fontWeight: '500', color: '#1F2937' },
  editLink: { fontSize: 14, fontWeight: '600', color: '#8B5CF6' },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00BCD4' },
  mastercardLogo: { flexDirection: 'row', marginRight: 8 },
  circle: { width: 18, height: 18, borderRadius: 9 },
  circleRed: { backgroundColor: '#EB001B', marginRight: -6 },
  circleYellow: { backgroundColor: '#F79E1B' },

  // Logo VISA
  visaLogo: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  visaText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1F71',
    letterSpacing: 0.5,
  },

  newCardButton: { paddingVertical: 16, alignItems: 'center' },
  newCardText: { fontSize: 14, fontWeight: '600', color: '#00BCD4' },
  cardForm: { marginTop: 10, backgroundColor: '#F9FAFB', padding: 15, borderRadius: 8 },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between' },
  saveCardBtn: {
    backgroundColor: '#00BCD4',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  saveCardText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  detailName: { fontSize: 15, fontWeight: '500', color: '#1F2937', marginLeft: 10, flex: 1 },
  detailInfo: { fontSize: 13, color: '#6B7280' },
  detailText: { fontSize: 15, color: '#1F2937', marginLeft: 10 },
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
