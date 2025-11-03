import { View, Text, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput, FlatList } from 'react-native';
import { X, Plane, PlaneLanding } from 'lucide-react-native';
import SwapButton from './SwapButton';
import { useState } from 'react';
import FetchAPI from '../services/fetchAPI';
import AirportItem from './AirportItem';
import { Airport } from '../types/types';

type Flight = {
  from: string;
  to: string;
  date: string;
};


interface LocationModalProps {
  visible: boolean;
  onClose?: () => void;
  title: string;
  currentFrom: string;
  currentTo: string;
  setCurrentFrom?: (value: string) => void;
  setCurrentTo?: (value: string) => void;
  setFlights?: (flights: Flight[]) => void;
  index ?: number;
  flights ?: Flight[]; 

}




export default function FindAirportModal({ visible, onClose, title, currentFrom, currentTo, setCurrentFrom, setCurrentTo,setFlights,index, flights }: LocationModalProps) {

  const [airports, setAirports] = useState<Airport[]>([]);
  const [searchKeyFrom, setKeyFrom] = useState(currentFrom !== 'FROM' ? currentFrom : '');
  const [searchKeyTo, setKeyTo] = useState(currentTo !== 'TO' ? currentTo : '');
  const [selectedAirportFrom, setSelectedAirportFrom] = useState(false);

  const searchAirports = async (value: string) => {
    try {
      const res = await FetchAPI.get('airports/search', { key: value });
      setAirports(res.data);
    } catch (err) {
      console.log("API Error:", err);
    }
  };


  const handleSelectAirport = (airport: Airport) => {
    if (!selectedAirportFrom) {
      setKeyFrom(airport.airport_code + "-" + airport.airport_name);
      setAirports([]);
      setSelectedAirportFrom(true);
    }
    else {
      setKeyTo(airport.airport_code + "-" + airport.airport_name);
      setAirports([]);
    }
  }


  const onFinish = () => {
    if (setCurrentFrom && setCurrentTo) {
      setCurrentFrom(searchKeyFrom);
      setCurrentTo(searchKeyTo);
    }
    if(setFlights){
      const newFlights = [...(flights || [])];
      if(index !== undefined){
        newFlights[index] = {
          from: searchKeyFrom,
          to: searchKeyTo,
          date: newFlights[index]?.date || new Date().toISOString(),
        };
        setFlights(newFlights);
      }
    }
    if (onClose) onClose();
  }






  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#00BDD6" />
          </TouchableOpacity>
        </View>

        <View style={styles.containerSearch}>
          <View style={styles.inputWrapper}>
            <Plane size={20} color="#00BDD6" style={styles.inputIcon} />
            <TextInput
              onFocus={() => { setSelectedAirportFrom(false) }}
              onChangeText={(value) => { setKeyFrom(value); searchAirports(value) }}
              underlineColorAndroid="transparent"
              placeholderTextColor="#9CA3AF"
              placeholder='Search Airport From...'
              value={searchKeyFrom}
              style={styles.input}
            />
          </View>
          <SwapButton />
          <View style={styles.inputWrapper}>
            <PlaneLanding style={styles.inputIcon} size={20} color="#00BDD6" />
            <TextInput
              onFocus={() => { setSelectedAirportFrom(true) }}
              onChangeText={(value) => { setKeyTo(value); searchAirports(value) }}
              underlineColorAndroid="transparent"
              placeholderTextColor="#9CA3AF"
              placeholder='Search Airport To...'
              value={searchKeyTo}
              style={styles.input}
            />
          </View>
        </View>


        <FlatList
          data={airports}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <AirportItem airport={item} onPress={() => handleSelectAirport(item)} />}
        />
      </KeyboardAvoidingView>

      <TouchableOpacity style={styles.searchButton} onPress={onFinish}>
        <Text style={styles.searchButtonText}>Finish</Text>
      </TouchableOpacity>

    </Modal>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fcfd',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    position: 'relative',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6f7fa',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00BDD6',
    letterSpacing: 0.3,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#f0f9fb',
  },
  containerSearch: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: '#00BDD6',
    marginVertical: 5,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: '#1F2937',
    paddingVertical: 5,
  },
  searchButton: {
    backgroundColor: '#00bcd4',
    borderRadius: 12,
    padding: 10,
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
