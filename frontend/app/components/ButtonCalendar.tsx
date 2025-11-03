import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';

type Props = {
  textCalendar?: string;
  date : Date | null;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
};

export default function ButtonCalendar({ textCalendar, date, setDate }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowPicker(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <Calendar size={20} color="#666" style={styles.dateIcon} />
        <Text style={styles.dateText}>{textCalendar}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date || new Date()} // 👉 nếu chưa có, dùng ngày hiện tại
          mode="date"
          display="calendar"
          onChange={handleChange}
          minimumDate={new Date()} // 👉 không cho chọn ngày quá khứ
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
  },
  dateIcon: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 15,
    color: '#000',
  },
});
