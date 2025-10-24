import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeftRight, User, Calendar, Briefcase, MapPin, Clock } from 'lucide-react-native';

export default function BookingDetail() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.statusCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
          <Text style={styles.bookingId}>Booking ID: BK-2024-789456</Text>
        </View>

        {/* Flight Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Information</Text>

          {/* Outbound Flight */}
          <View style={styles.flightCard}>
            <View style={styles.flightHeader}>
              <Text style={styles.flightLabel}>Outbound Flight</Text>
              <Text style={styles.flightDate}>Tue, Jul 14</Text>
            </View>

            <View style={styles.flightRoute}>
              <View style={styles.airportInfo}>
                <Text style={styles.airportCode}>LCY</Text>
                <Text style={styles.cityName}>London City</Text>
                <View style={styles.timeRow}>
                  <Clock color="#6B7280" size={14} />
                  <Text style={styles.time}>08:30 AM</Text>
                </View>
              </View>

              <View style={styles.flightDuration}>
                <ArrowLeftRight color="#00BCD4" size={24} />
                <Text style={styles.duration}>7h 30m</Text>
              </View>

              <View style={styles.airportInfo}>
                <Text style={styles.airportCode}>JFK</Text>
                <Text style={styles.cityName}>New York</Text>
                <View style={styles.timeRow}>
                  <Clock color="#6B7280" size={14} />
                  <Text style={styles.time}>11:00 AM</Text>
                </View>
              </View>
            </View>

            <View style={styles.flightDetails}>
              <View style={styles.detailItem}>
                <MapPin color="#6B7280" size={16} />
                <Text style={styles.detailText}>Flight AA 123</Text>
              </View>
              <View style={styles.detailItem}>
                <Briefcase color="#6B7280" size={16} />
                <Text style={styles.detailText}>Economy Class</Text>
              </View>
            </View>
          </View>

          {/* Return Flight */}
          <View style={styles.flightCard}>
            <View style={styles.flightHeader}>
              <Text style={styles.flightLabel}>Return Flight</Text>
              <Text style={styles.flightDate}>Fri, Jul 17</Text>
            </View>

            <View style={styles.flightRoute}>
              <View style={styles.airportInfo}>
                <Text style={styles.airportCode}>JFK</Text>
                <Text style={styles.cityName}>New York</Text>
                <View style={styles.timeRow}>
                  <Clock color="#6B7280" size={14} />
                  <Text style={styles.time}>02:00 PM</Text>
                </View>
              </View>

              <View style={styles.flightDuration}>
                <ArrowLeftRight color="#00BCD4" size={24} />
                <Text style={styles.duration}>6h 45m</Text>
              </View>

              <View style={styles.airportInfo}>
                <Text style={styles.airportCode}>LCY</Text>
                <Text style={styles.cityName}>London City</Text>
                <View style={styles.timeRow}>
                  <Clock color="#6B7280" size={14} />
                  <Text style={styles.time}>08:45 PM</Text>
                </View>
              </View>
            </View>

            <View style={styles.flightDetails}>
              <View style={styles.detailItem}>
                <MapPin color="#6B7280" size={16} />
                <Text style={styles.detailText}>Flight AA 456</Text>
              </View>
              <View style={styles.detailItem}>
                <Briefcase color="#6B7280" size={16} />
                <Text style={styles.detailText}>Economy Class</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Passenger Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <User color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Passenger</Text>
                <Text style={styles.infoValue}>Pedro Moreno</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Calendar color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>Adult • Male</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seat Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seat Selection</Text>
          <View style={styles.infoCard}>
            <View style={styles.seatRow}>
              <Text style={styles.seatLabel}>Outbound (LCY - JFK)</Text>
              <Text style={styles.seatValue}>Seat 3D</Text>
            </View>
            <View style={styles.seatRow}>
              <Text style={styles.seatLabel}>Return (JFK - LCY)</Text>
              <Text style={styles.seatValue}>Seat 5A</Text>
            </View>
          </View>
        </View>

        {/* Baggage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baggage</Text>
          <View style={styles.infoCard}>
            <View style={styles.baggageRow}>
              <Briefcase color="#6B7280" size={20} />
              <Text style={styles.baggageText}>1 Cabin bag (Personal item)</Text>
            </View>
            <View style={styles.baggageRow}>
              <Briefcase color="#6B7280" size={20} />
              <Text style={styles.baggageText}>1 Checked bag (22.1 lbs)</Text>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.infoCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Fare (1 Adult)</Text>
              <Text style={styles.priceValue}>$806.00</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Checked Bag</Text>
              <Text style={styles.priceValue}>$19.99</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Seat Selection</Text>
              <Text style={styles.priceValue}>$11.27</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Taxes & Fees</Text>
              <Text style={styles.priceValue}>$25.70</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>$811.56</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.contactText}>pedromoreno@gmail.com</Text>
            <Text style={styles.contactText}>(208) 567-8209</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    position: 'relative',
  },
  backButtonWrapper: {
    position: 'absolute',
    left: 20,
    top: 10,
    zIndex: 10,
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    // bỏ flex:1 để ScrollView cuộn được trên iOS
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bookingId: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  flightCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flightLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  flightDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airportInfo: {
    alignItems: 'center',
    flex: 1,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  cityName: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  flightDuration: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  duration: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  seatLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  seatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  baggageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  baggageText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00BCD4',
  },
  contactText: {
    fontSize: 14,
    color: '#1F2937',
    paddingVertical: 4,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  homeButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
