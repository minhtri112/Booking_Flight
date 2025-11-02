import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import ButtonStop from './ButtonStop';
import ButtonSelectAirline from './ButtonSelectAirline';
import { apiService } from '../services/fetchAPI';




interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  setSelectedFilters: React.Dispatch<React.SetStateAction<any>>;
}


const stops = ["Any stops", "1 stop or nonstop", "Nonstop only"];
export default function FilterModal({ visible, onClose, setSelectedFilters }: FilterModalProps) {
  const [timeRange, setTimeRange] = useState(24);
  const [selectedStops, setSelectedStops] = useState('Any stops');
  const [airlines, setAirlines] = useState<string[]>([]);
  const [selectAirlines, setSelectAirlines] = useState<string[]>(['Select all']);

  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const req = await apiService.get("airplanes/airlines");
        console.log("Airlines Data:", req.data);
        setAirlines([...req.data, "Select all"]);
      }
      catch (err) {
        console.error("Fetch Airlines Error:", err);
      }
    };
    fetchAirlines();
  }, [])

  const handleClearAll = () => {
    setTimeRange(24);
    setSelectedStops('Any stops');
    setSelectAirlines(['Select all']);
  };

  const handleApply = () => {
    let stopsValue = 10;

    let finalAirlines = [...selectAirlines];
    if (finalAirlines.includes("Select all")) {
      finalAirlines = [...airlines];
    }

    if (selectedStops === "1 stop or nonstop") {
      stopsValue = 1;
    } else if (selectedStops === "Nonstop only") {
      stopsValue = 0;
    }

    setSelectedFilters({
      time: timeRange * 60,
      stops: stopsValue,
      airlines: finalAirlines,
    });

    onClose();
  };




  const toggleAirline = (airline: string) => {
    const check = selectAirlines.find(item => item === airline);
    if (check) {
      setSelectAirlines(selectAirlines.filter(item => item !== airline));
    } else {
      setSelectAirlines([...selectAirlines, airline]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >

      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Sorts & Filters</Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>

              <Text style={styles.sectionTitle}>Time Range</Text>
              <View style={styles.sliderContainer}>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={48}
                  step={1}
                  value={timeRange}
                  onValueChange={setTimeRange}
                  minimumTrackTintColor="#00B6D4"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#00B6D4"
                />
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1h</Text>
                  <Text style={styles.sliderValue}>{timeRange}h</Text>
                  <Text style={styles.sliderLabel}>48h</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>

              <Text style={styles.sectionTitle}>Stops</Text>
              {
                stops.map((item, index) => {
                  return (
                    <ButtonStop key={index} nameStops={item} nameSelect={selectedStops === item} onPress={() => setSelectedStops(item)} />
                  );
                })
              }
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Airlines</Text>
              <ButtonSelectAirline nameAirline={"Select all"} nameSelect={selectAirlines} onPress={() => toggleAirline("Select all")} />
              {

                airlines.map((item, index) => {
                  if (item !== "Select all")
                    return (
                      <ButtonSelectAirline key={index} nameAirline={item} nameSelect={selectAirlines} onPress={() => toggleAirline(item)} />
                    );
                })
              }
            </View>


          </ScrollView>


          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}>
              <Text style={styles.clearButtonText}>Clear all</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },

  sliderContainer: {
    paddingHorizontal: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00B6D4',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#06B6D4',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
