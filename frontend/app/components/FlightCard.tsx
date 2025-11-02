import { View, Text, StyleSheet } from 'react-native';
import {  FlightItem } from '../types/types';
import { Plane} from 'lucide-react-native';

interface FlightCardProps {
  item: FlightItem;
}

export  function FlightCard({ item }: FlightCardProps) {
  const departureTime = new Date(item.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const arrivalTime = new Date(item.arrival_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const departureCode = item.departure_airport_code;
  const arrivalCode = item.arrival_airport_code;
  const airline = item.airplane_id.airline_name;
  const duration = item.duration_minutes + "h";
  return (
    <View style={styles.card}>
      <View style={styles.flightRow}>
        <View style={styles.airlineIcon}>
          <Plane size={24} color="#00BDD6" />
        </View>

        <View style={styles.flightInfo}>
          <View style={styles.timeRow}>
            <Text style={styles.time}>{departureTime}</Text>
            <View style={styles.divider} />
            <Text style={styles.time}>{arrivalTime}</Text>
          </View>

          <View style={styles.routeRow}>
            <Text style={styles.code}>{departureCode}</Text>
            <View style={styles.separator} />
            <Text style={styles.code}>{arrivalCode}</Text>
            <Text style={styles.airline}>, {airline}</Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.duration}>{duration}</Text>
          <Text style={styles.price}>${item.ticket_price}</Text>
        </View>
      </View>
    </View>
  );
}





const styles = StyleSheet.create({
  card: { paddingVertical: 16 },
  
  flightRow: { flexDirection: 'row', alignItems: 'center' },

  airlineIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#caeff3ff',
  },
  iconCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#D1D5DB' },
  flightInfo: { flex: 1 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  time: { fontSize: 14, fontWeight: '600', color: '#111827' },
  divider: { width: 24, height: 1, backgroundColor: '#D1D5DB', marginHorizontal: 8 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  code: { fontSize: 12, color: '#6B7280' },
  separator: { width: 24, height: 1, backgroundColor: '#D1D5DB', marginHorizontal: 8 },
  airline: { fontSize: 12, color: '#6B7280' },
  details: { alignItems: 'flex-end', marginLeft: 12 },
  duration: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  price: { fontSize: 12, color: '#6B7280' },

});
