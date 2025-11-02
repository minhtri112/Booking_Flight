import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { ChevronLeft, Bell, SlidersHorizontal } from 'lucide-react-native';
import { FlightGroup } from '../components/FlightGroup';
import FilterFlightModel from '../components/FilterFlightModel';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import { Flight } from '../types/types';
import { apiService } from "../services/fetchAPI";
import { FlatList } from 'react-native-gesture-handler';



export default function FlightSearchScreen() {
  const [flightData, setFlightData] = useState<Flight[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>(null);

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
    const fetchFlights = async () => {
      try {
        const req = await apiService.post("flights/one-way", {
          from: "HAN",
          to: "DAD",
          date : "2025-11-23",
          filter : selectedFilters
        });
        setFlightData(req.data);
      } catch (err) {
        console.error("Fetch Flights Error:", err);
      }
    };
    fetchFlights();
  }, [selectedFilters]);


  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.route}>London - New York</Text>
          <Text style={styles.details}>Jul 14 - Jul 17, 1 traveller</Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
          <SlidersHorizontal size={18} color="#111827" />
          <Text style={styles.filterText}>Sort & Filters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.chipText}>Airlines</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.chipText}>Stops</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chipButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.chipText}>Time</Text>
        </TouchableOpacity>
      </View>
      

      <FlatList
        data={flightData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <FlightGroup flight={item} />
        )}
      />

      <FilterFlightModel visible={isModalVisible} onClose={() => setIsModalVisible(false)} setSelectedFilters={setSelectedFilters} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  iconButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  route: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  details: {
    fontSize: 13,
    color: '#6B7280',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#111827',
  },
});
