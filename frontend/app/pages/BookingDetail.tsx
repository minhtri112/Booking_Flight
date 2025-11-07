import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeftRight,
  User,
  Briefcase,
  MapPin,
  Clock,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import Header from "../components/Header";

export default function BookingDetail() {
  const router = useRouter();
  const route = useRoute<any>();
  const { orders } = route.params;

  const order = orders?.data || orders; // hỗ trợ cả khi truyền trực tiếp hoặc bọc trong .data

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header text="Booking Details" Icon={ArrowLeftRight} />

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Booking status */}
        <View style={styles.statusCard}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
          <Text style={styles.bookingId}>Booking ID: {order._id}</Text>
        </View>

        {/* Flight Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Information</Text>

          {order.order_details?.map((flight: any, index: number) => (
            <View key={index} style={styles.flightCard}>
              <View style={styles.flightHeader}>
                <Text style={styles.flightLabel}>
                  {index === 0 ? "Outbound Flight" : "Return Flight"}
                </Text>
                <Text style={styles.flightDate}>
                  {new Date(
                    flight.flight_id.departure_time
                  ).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.flightRoute}>
                {/* Điểm khởi hành */}
                <View style={styles.airportInfo}>
                  <Text style={styles.airportCode}>
                    {flight.flight_id.departure_airport_code}
                  </Text>
                  <Text style={styles.cityName}>Departure</Text>
                  <View style={styles.timeRow}>
                    <Clock color="#6B7280" size={14} />
                    <Text style={styles.time}>
                      {new Date(
                        flight.flight_id.departure_time
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>

                <View style={styles.flightDuration}>
                  <ArrowLeftRight color="#00BCD4" size={22} />
                  <Text style={styles.duration}>
                    {Math.floor(flight.flight_id.duration_minutes / 60)}h{" "}
                    {flight.flight_id.duration_minutes % 60}m
                  </Text>
                </View>

                {/* Điểm đến */}
                <View style={styles.airportInfo}>
                  <Text style={styles.airportCode}>
                    {flight.flight_id.arrival_airport_code}
                  </Text>
                  <Text style={styles.cityName}>Arrival</Text>
                  <View style={styles.timeRow}>
                    <Clock color="#6B7280" size={14} />
                    <Text style={styles.time}>
                      {new Date(
                        flight.flight_id.arrival_time
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.flightDetails}>
                <View style={styles.detailItem}>
                  <MapPin color="#6B7280" size={16} />
                  <Text style={styles.detailText}>
                    Flight ID: 07294484949
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Briefcase color="#6B7280" size={16} />
                  <Text style={styles.detailText}>Ticket: ${flight.price}</Text>
                </View>
              </View>

              {/* Ghế ngồi */}
              <View style={{ marginTop: 10 }}>
                <Text style={styles.seatTitle}>Selected Seats:</Text>
                <Text style={styles.seatValue}>
                  {flight.seat_number.join(", ")}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Passenger Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          <View style={styles.infoCard}>
            {order.passenger_details?.map((p: any, idx: number) => (
              <View key={idx} style={styles.infoRow}>
                <User color="#6B7280" size={20} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{p.passenger_type}</Text>
                  <Text style={styles.infoValue}>{p.quantity} person</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Baggage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baggage</Text>
          <View style={styles.infoCard}>
            <View style={styles.baggageRow}>
              <Briefcase color="#6B7280" size={20} />
              <Text style={styles.baggageText}>
                Type: {order.baggage_option.type || "None"}
              </Text>
            </View>
            <View style={styles.baggageRow}>
              <Briefcase color="#6B7280" size={20} />
              <Text style={styles.baggageText}>
                Price: ${order.baggage_option.price}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.infoCard}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Price</Text>
              <Text style={styles.priceValue}>${order.total_price}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Payment Method</Text>
              <Text style={styles.priceValue}>{order.payment_method}</Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.contactText}>{order.contact_name}</Text>
            <Text style={styles.contactText}>{order.phone}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
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
    marginBottom: 12,
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
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cityName: { fontSize: 12, color: "#6B7280", marginBottom: 8 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  time: { fontSize: 14, fontWeight: "500", color: "#1F2937" },
  flightDuration: { alignItems: "center", marginHorizontal: 16 },
  duration: { fontSize: 12, color: "#6B7280", marginTop: 4 },
  flightDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailText: { fontSize: 13, color: "#6B7280" },
  seatTitle: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  seatValue: { fontSize: 13, color: "#374151" },
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
  baggageRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  baggageText: { fontSize: 14, color: "#1F2937", marginLeft: 10 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  priceLabel: { fontSize: 14, color: "#6B7280" },
  priceValue: { fontSize: 14, fontWeight: "500", color: "#1F2937" },
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
  homeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
