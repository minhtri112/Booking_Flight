import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { User, Briefcase, Armchair, CreditCard,ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { showError } from '../components/Alter';
import { addTraveller } from '../redux/ordersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from 'expo-router';

import {TypeNavigationProp} from "../types/types";

export default function TravellerInformation() {
  const navigation = useNavigation<TypeNavigationProp>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+84');

  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const genders = ['Male', 'Female', 'Other'];
  const countryCodes = ['+01', '+44', '+61', '+81', '+84'];
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.orders);

  const totalPassengers = (Object.values(orders.passenger_details) as number[])
    .reduce((sum, value) => sum + value, 0);


  const handleNext = () => {
    if (firstName.trim() === '' || lastName.trim() === '' || gender.trim() === '' || email.trim() === '' || phone.trim() === '') {
      showError("Please fill in all required fields.");
      return;
    }
    dispatch(addTraveller({ contact_name: `${firstName} ${lastName}`, phone : phone }));
    navigation.navigate('BaggageInformation');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft color="#111827" size={30} />
          </TouchableOpacity>

          <View style={styles.stepIndicator}>
            <View style={[styles.stepIcon, styles.stepActive]}>
              <User color="#fff" size={18} />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepIcon}>
              <Briefcase color="#9CA3AF" size={18} />
            </View>
            <View style={styles.stepLine} />
            {/* ✅ Đổi icon Car thành Armchair */}
            <View style={styles.stepIcon}>
              <Armchair color="#9CA3AF" size={18} />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepIcon}>
              <CreditCard color="#9CA3AF" size={18} />
            </View>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Traveller information</Text>
          <Text style={styles.subTitle}>Traveller: {totalPassengers}</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity style={styles.selectBox} onPress={() => setShowGenderModal(true)}>
              <Text style={[styles.selectText, gender ? { color: '#111827' } : {}]}>
                {gender || 'Select option'}
              </Text>
              <Text style={styles.selectArrow}>▼</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Contact details</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact email</Text>
            <TextInput
              style={styles.input}
              placeholder="Your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact phone</Text>
            <View style={styles.phoneRow}>
              <TouchableOpacity style={styles.countryCode} onPress={() => setShowCountryModal(true)}>
                <Text style={styles.countryText}>{countryCode}</Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="Phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${orders.total_price}</Text>
            <Text style={styles.priceNote}>{totalPassengers} adult</Text>
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>

        {/* Gender Modal */}
        <Modal visible={showGenderModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowGenderModal(false)}
            activeOpacity={1}
          >
            <View style={styles.modalBox}>
              {genders.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setGender(item);
                    setShowGenderModal(false);
                  }}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Country Code Modal */}
        <Modal visible={showCountryModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowCountryModal(false)}
            activeOpacity={1}
          >
            <View style={styles.modalBox}>
              {countryCodes.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalItem}
                  onPress={() => {
                    setCountryCode(item);
                    setShowCountryModal(false);
                  }}
                >
                  <Text style={styles.modalText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15, flexDirection: 'row', alignItems: 'center' },
  backButton: { fontSize: 22, color: '#111827', marginBottom: 15 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex : 1 },
  stepIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center',
  },
  stepActive: { backgroundColor: '#00BCD4' },
  stepLine: { width: 28, height: 2, backgroundColor: '#E5E7EB' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginTop: 10 },
  subTitle: { fontSize: 15, color: '#4B5563', fontWeight: '500', marginVertical: 15 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 12, fontSize: 16, color: '#111827',
  },
  selectBox: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    paddingVertical: 12, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  selectText: { fontSize: 16, color: '#9CA3AF' },
  selectArrow: { fontSize: 12, color: '#6B7280' },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#111827', marginBottom: 10 },
  phoneRow: { flexDirection: 'row', gap: 10 },
  countryCode: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8,
    paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center',
  },
  countryText: { fontSize: 16, color: '#111827', marginRight: 4 },
  phoneInput: { flex: 1 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    backgroundColor: '#fff', padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  price: { fontSize: 24, fontWeight: '700', color: '#111827' },
  priceNote: { fontSize: 14, color: '#6B7280' },
  nextBtn: { backgroundColor: '#00BCD4', paddingVertical: 12, paddingHorizontal: 50, borderRadius: 8 },
  nextText: { fontSize: 16, color: '#fff', fontWeight: '600' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 10, padding: 10, width: 200 },
  modalItem: { paddingVertical: 10 },
  modalText: { fontSize: 16, textAlign: 'center', color: '#111827' },
});
