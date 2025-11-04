import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, User, Plane, Briefcase, Luggage, Armchair } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlightCardDetail from '../components/FlightCardDetail';

import { useNavigation } from 'expo-router';
import { useSelector } from 'react-redux';
import {TypeNavigationProp} from "../types/types";

export default function FlightDetailsScreen() {
  const navigation = useNavigation<TypeNavigationProp>();
  const orders = useSelector((state: any) => state.orders);

  console.log("Orders in FlightDetailsScreen:", orders);

  const dateFrom = new Date(orders.flights[0]?.date);
  const dateTo = new Date(orders.flights[orders.flights.length - 1]?.date);
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const formattedFrom = dateFrom.toLocaleDateString("en-US", options);
  const formattedTo = dateTo.toLocaleDateString("en-US", options);

  const totalPassengers = (Object.values(orders.passenger_details) as number[])
    .reduce((sum, value) => sum + value, 0);
  const typeTrip = orders.type_trip;
  const cabin_class = orders.cabin_class;
  const totalPrice = orders.total_price;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Flight details</Text>

        </View>

        {/* Trip Title */}
        <View style={styles.tripTitle}>
          <Text style={styles.tripTitleText}>Your trip to world</Text>
          <Text style={styles.tripSubtitle}>from world</Text>
        </View>

        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateBadgeText}>{formattedFrom} - {formattedTo}</Text>
        </View>

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <View style={styles.tripInfoItem}>
            <User size={16} color="#323337ff" />
            <Text style={styles.tripInfoText}>{totalPassengers} traveller{totalPassengers > 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.tripInfoDot} />
          <View style={styles.tripInfoItem}>
            <Armchair size={16} color="#323337ff" />
            <Text style={styles.tripInfoText}>{cabin_class}</Text>
          </View>
          <View style={styles.tripInfoDot} />
          <View style={styles.tripInfoItem}>
            <Plane size={16} color="#323337ff" />
            <Text style={styles.tripInfoText}>{typeTrip}</Text>
          </View>
        </View>

        {/* Outbound Flight Card */}
        {orders.flights.map((flight: any, i: number) => (
          flight.path.map((item: any) => (
            <FlightCardDetail key={item._id || `${i}-${item.flight_number}`} item={item} />
          ))
        ))}

        {/* Included Baggage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Included baggage</Text>
          <Text style={styles.sectionSubtitle}>The total baggage included in the price</Text>

          <View style={styles.baggageItem}>
            <Briefcase size={24} color="#1a1a1a" />
            <View style={styles.baggageInfo}>
              <Text style={styles.baggageTitle}>1 personal item</Text>
              <Text style={styles.baggageDescription}>Must go under the seat in front of you</Text>
              <Text style={styles.includedText}>Included</Text>
            </View>
          </View>

          <View style={styles.policyLinks}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Baggage policies</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.linkText}>SkyHaven</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Extra Baggage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extra baggage</Text>

          <View style={styles.extraBaggageItem}>
            <Briefcase size={24} color="#1a1a1a" />
            <View style={styles.baggageInfo}>
              <Text style={styles.baggageTitle}>Carry-on</Text>
              <Text style={styles.baggagePrice}>From $11.99</Text>
              <Text style={styles.availableText}>Available in the next steps</Text>
            </View>
          </View>

          <View style={styles.extraBaggageItem}>
            <Luggage size={24} color="#1a1a1a" />
            <View style={styles.baggageInfo}>
              <Text style={styles.baggageTitle}>Checked bag</Text>
              <Text style={styles.baggagePrice}>From $19.99</Text>
              <Text style={styles.availableText}>Available in the next steps</Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${totalPrice}</Text>
          <Text style={styles.priceLabel}>Total price</Text>
        </View>
        <TouchableOpacity style={styles.selectButton} onPress={() => navigation.navigate('TravellerInformation')}>
          <Text style={styles.selectButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  iconButton: {
    padding: 4,
  },
  tripTitle: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  tripTitleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tripSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  dateBadge: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#2d3748',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  dateBadgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'space-between',
  },
  tripInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tripInfoText: {
    fontSize: 12,
    color: '#323337ff',
  },
  tripInfoDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#323337ff',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 20,
  },
  baggageItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baggageInfo: {
    flex: 1,
  },
  baggageTitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  baggageDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
  },
  includedText: {
    fontSize: 12,
    color: '#f97316',
    fontWeight: '500',
  },
  policyLinks: {
    flexDirection: 'row',
    gap: 24,
  },
  linkText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  extraBaggageItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baggagePrice: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '400',
    marginBottom: 4,
  },
  availableText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  bottomSpacing: {
    height: 100,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  priceContainer: {
    gap: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  priceLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  selectButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 48,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
