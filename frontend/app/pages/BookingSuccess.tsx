import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground , ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter,useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import { CheckCircle2, ArrowLeftRight } from 'lucide-react-native';
import FetchAPI from '../services/fetchAPI';

export default function BookingSuccess() {
  const [orders, setOrders] = useState<any>(null);
  const router = useRouter();
  const navigator = useNavigation<any>();
  const route = useRoute<any>();
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);

  console.log("Order Details:", orders);


  useEffect(() => {
    const fetchOrderDetails = async () => {
      try{
        const response = await FetchAPI.get(`orders/${orderId}`);
        setOrders(response.data);
      }
      catch (error) {
        console.error('Error fetching order details:', error);
    }
  };
  fetchOrderDetails();
  setLoading(false);
  }, [orderId]);

  if (loading || !orders) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color="#D97706" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg' }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <CheckCircle2 color="#D97706" size={48} strokeWidth={2} />
            </View>

            <Text style={styles.title}>Booking successful</Text>

            <View style={styles.flightInfo}>
              <View style={styles.airport}>
                <Text style={styles.airportCode}>{orders?.order_details[0].flight_id.departure_airport_code}</Text>
                <Text style={styles.date}>Tue, Jul 14</Text>
              </View>

              <View style={styles.arrowContainer}>
                <ArrowLeftRight color="#6B7280" size={24} />
              </View>

              <View style={styles.airport}>
                <Text style={styles.airportCode}>{orders?.order_details[0].flight_id.arrival_airport_code}</Text>
                <Text style={styles.date}>Fri, Jul 17</Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Traveller</Text>
                <Text style={styles.detailLabel}>Class</Text>
                <Text style={styles.detailLabel}>Flight</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailValue}>Pedro Moreno</Text>
                <Text style={styles.detailValue}>Economy</Text>
                <Text style={styles.detailValue}>{ orders.type_trip ? 'Round-trip' : orders.type_trip }</Text>
              </View>
            </View>

            <Text style={styles.price}>${orders?.total_price}</Text>

            <TouchableOpacity style={styles.detailButton} onPress={() => navigator.navigate('BookingDetail', { orders : orders}) }>
              <Text style={styles.detailButtonText}>Booking detail</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.homeLink}>Home</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 30,
  },
  flightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 30,
  },
  airport: {
    alignItems: 'center',
    flex: 1,
  },
  airportCode: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  arrowContainer: {
    marginHorizontal: 20,
  },
  details: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  detailButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  homeLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00BCD4',
  },
});
