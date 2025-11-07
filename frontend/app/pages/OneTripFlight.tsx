import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plane, PlaneLanding } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { TypeNavigationProp } from '../types/types';
import { useDispatch } from 'react-redux';
import { useState } from 'react';

import ButtonSearchAirport from '../components/ButtonSearchAirport';
import SwapButton from '../components/SwapButton';
import ButtonCalendar from '../components/ButtonCalendar';
import ButtonTypeTrip from '../components/ButtonTypeTrip';
import FindAriportModel from '../components/FindAriportModel';
import { showError } from '../components/Alter';

import {addAirportOneTrip} from '../redux/ordersSlice';
import Header from "../components/Header";

export default function OneTripFlight() {
  const navigation = useNavigation<TypeNavigationProp>();
  const tripType = 'One-way';
  const dispatch = useDispatch();

  const [visibleAirport, setVisibleAirport] = useState(false);
  const [currentFrom, setCurrentFrom] = useState('FROM');
  const [currentTo, setCurrentTo] = useState('TO');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // ====== Handle logic when pressing Search button ======
  const handleNextPress = () => {
    if (!currentFrom || currentFrom === 'FROM' || !currentTo || currentTo === 'TO') {
      showError('Please fill in all required fields!');
      return;
    }

    dispatch(
      addAirportOneTrip({
        from: currentFrom.split('-')[0],
        to: currentTo.split('-')[0],
        date: selectedDate?.toISOString(),
        type_trip: tripType,
      })
    );

    navigation.navigate('TravellerOptions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}

        <Header text="Flight" Icon={X} />

        {/* Trip type buttons */}
        <View style={styles.tripTypeContainer}>
          <ButtonTypeTrip tripName="Round-trip" tripTypeActive={tripType} onPress={() => navigation.navigate('RoundTripFlight')} />
          <ButtonTypeTrip tripName="One-way" tripTypeActive={tripType} />
          <ButtonTypeTrip tripName="Multi-city" tripTypeActive={tripType} onPress={() => navigation.navigate('MultiCityTripFlight')} />
        </View>

        {/* Form container */}
        <View style={styles.formContainer}>
          {/* Airport selection */}
          <View style={styles.locationContainer}>
            <ButtonSearchAirport textName={currentFrom} Icon={Plane} onPress={() => setVisibleAirport(true)} />
            <SwapButton />
            <ButtonSearchAirport textName={currentTo} Icon={PlaneLanding} onPress={() => setVisibleAirport(true)} />
          </View>

          {/* Date selector */}
          <View style={styles.dateContainer}>
            <ButtonCalendar
              textCalendar={
                selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Depart'
              }
              date={selectedDate}
              setDate={setSelectedDate}
            />
          </View>
        </View>
      </ScrollView>

      {/* Button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleNextPress}>
        <Text style={styles.searchButtonText}>Next</Text>
      </TouchableOpacity>

      {/* Modal chọn sân bay */}
      <FindAriportModel
        visible={visibleAirport}
        onClose={() => setVisibleAirport(false)}
        title="Select Airport"
        currentFrom={currentFrom}
        currentTo={currentTo}
        setCurrentFrom={setCurrentFrom}
        setCurrentTo={setCurrentTo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent : 'space-between',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  locationContainer: {
    borderRadius: 12,
    padding: 5,
    position: 'relative',
  },
  dateContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#00bcd4',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
