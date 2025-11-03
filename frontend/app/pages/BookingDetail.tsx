import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeftRight,
  User,
  Calendar,
  Briefcase,
  MapPin,
  Clock,
} from "lucide-react-native";
import axios from "axios";

export default function BookingDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { bookingId, bookingData } = params;
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:3000"; // ⚠️ Đổi sang IP LAN nếu test iOS

  useEffect(() => {
    const loadBooking = async () => {
      try {
        if (bookingData) {
          const parsed = JSON.parse(decodeURIComponent(bookingData as string));
          setBooking(parsed);
          setLoading(false);
          return;
        }

        if (bookingId) {
          const res = await axios.get(`${BASE_URL}/api/flights/booking/${bookingId}`);
          if (res.data?.booking || res.data?.order) {
            setBooking(res.data.booking || res.data.order);
          } else {
            Alert.alert("Error", "Không tìm thấy thông tin đặt vé.");
          }
        } else {
          Alert.alert("Error", "Thiếu bookingId hoặc bookingData.");
        }
      } catch (error: any) {
        console.error("❌ Fetch booking error:", error.message);
        Alert.alert("Error", error.message || "Không thể tải thông tin đặt vé.");
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, bookingData]);

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </SafeAreaView>
    );

  if (!booking)
    return (
      <SafeAreaView style={styles.center}>
        <Text>Không tìm thấy thông tin đặt vé</Text>
      </SafeAreaView>
    );

  const totalTicket =
    booking.flights?.reduce((sum: number, f: any) => sum + (f.ticket_price || 0), 0) || 0;
  const baggagePrice =
    booking.baggage?.checkedBagPrice || booking.baggage_option?.price || 0;
  const totalPrice = totalTicket + baggagePrice;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
     
        <View style={styles.statusCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
  
        </View>

      
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Information</Text>

          {booking.flights?.map((f: any, idx: number) => (
            <View key={idx} style={styles.flightCard}>
              <View style={styles.flightHeader}>
                <Text style={styles.flightLabel}>
                  {idx === 0 ? "Outbound Flight" : "Return Flight"}
                </Text>
                <Text style={styles.flightDate}>
                  {new Date(f.departure_time).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.flightRoute}>
                <View style={styles.airportInfo}>
                  <Text style={styles.airportCode}>{f.departure_airport_code}</Text>
                  <Text style={styles.cityName}>{f.from}</Text>
                  <View style={styles.timeRow}>
                    <Clock color="#6B7280" size={14} />
                    <Text style={styles.time}>
                      {new Date(f.departure_time).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.flightDuration}>
                  <ArrowLeftRight color="#00BCD4" size={24} />
                </View>

                <View style={styles.airportInfo}>
                  <Text style={styles.airportCode}>{f.arrival_airport_code}</Text>
                  <Text style={styles.cityName}>{f.to}</Text>
                  <View style={styles.timeRow}>
                    <Clock color="#6B7280" size={14} />
                    <Text style={styles.time}>
                      {new Date(f.arrival_time).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.flightDetails}>
                <View style={styles.detailItem}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.detailText}>Flight {f.flight_number || ""}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Briefcase color="#6B7280" size={16} />
                  <Text style={styles.detailText}>
                    {f.class_type || "Economy"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ✅ Passenger Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <User color="#6B7280" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Passenger</Text>
                <Text style={styles.infoValue}>
                  {booking.traveller
                    ? `${booking.traveller.firstName} ${booking.traveller.lastName}`
                    : booking.contact_name || "Không rõ"}
                </Text>
              </View>
            </View>
            {booking.traveller?.email && (
              <View style={styles.infoRow}>
                <Calendar color="#6B7280" size={20} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{booking.traveller.email}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ✅ Seat Selection */}
        {booking.flights?.some((f: any) => f.seats?.length) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Seat Selection</Text>
            <View style={styles.infoCard}>
              {booking.flights.map((f: any, idx: number) => (
                <View key={idx} style={styles.seatRow}>
                  <Text style={styles.seatLabel}>
                    {f.from} → {f.to}
                  </Text>
                  <Text style={styles.seatValue}>
                    {Array.isArray(f.seats) ? f.seats.join(", ") : f.seats || "N/A"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ✅ Baggage */}
        {booking.baggage_option && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Baggage</Text>
            <View style={styles.infoCard}>
              <View style={styles.baggageRow}>
                <Briefcase color="#6B7280" size={20} />
                <Text style={styles.baggageText}>
                  {booking.baggage_option.type} (${booking.baggage_option.price})
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ✅ Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.infoCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Fare</Text>
              <Text style={styles.priceValue}>${totalTicket.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Checked Bag</Text>
              <Text style={styles.priceValue}>${baggagePrice.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* ✅ Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.contactText}>
              {booking.traveller?.email || "Không có email"}
            </Text>
            <Text style={styles.contactText}>
              {booking.traveller?.phone || "Không có số điện thoại"}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ✅ Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ===================== STYLES =====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    position: "relative",
  },
  backButtonWrapper: { position: "absolute", left: 20, top: 10, zIndex: 10 },
  backButton: { fontSize: 24, color: "#000" },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  statusBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  bookingId: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  section: { backgroundColor: "#fff", padding: 20, marginBottom: 12 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  flightCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  flightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  flightLabel: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  flightDate: { fontSize: 14, color: "#6B7280" },
  flightRoute: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  airportInfo: { alignItems: "center", flex: 1 },
  airportCode: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cityName: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  time: { fontSize: 14, fontWeight: "500", color: "#1F2937" },
  flightDuration: { alignItems: "center", marginHorizontal: 16 },
  flightDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 13, color: "#6B7280" },
  infoCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  infoContent: { marginLeft: 12 },
  infoLabel: { fontSize: 12, color: "#6B7280", marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: "500", color: "#1F2937" },
  seatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  seatLabel: { fontSize: 14, color: "#6B7280" },
  seatValue: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  baggageRow: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  baggageText: { fontSize: 14, color: "#1F2937", marginLeft: 12 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  priceLabel: { fontSize: 14, color: "#6B7280" },
  priceValue: { fontSize: 14, fontWeight: "500", color: "#1F2937" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  totalValue: { fontSize: 18, fontWeight: "700", color: "#00BCD4" },
  contactText: { fontSize: 14, color: "#1F2937", paddingVertical: 4 },
  footer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  homeButton: {
    backgroundColor: "#00BCD4",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  homeButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
