import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CheckCircle2, ArrowLeftRight } from "lucide-react-native";
import axios from "axios";

export default function BookingSuccess() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookingId = params.bookingId as string | undefined;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Nếu chạy trên iOS thật hoặc simulator Xcode, đổi localhost thành IP LAN (VD: 192.168.x.x)
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const bookingParam = params.bookingData
      ? JSON.parse(decodeURIComponent(params.bookingData as string))
      : null;

    if (bookingParam) {
      setBooking(bookingParam);
      setLoading(false);
      return;
    }

    if (bookingId) {
      const fetchBooking = async () => {
        try {
          const res = await axios.get(`${BASE_URL}/api/flights/booking/${bookingId}`);
          if (res.data.status && res.data.booking) {
            setBooking(res.data.booking);
          } else {
            Alert.alert("Error", res.data.message || "Booking not found");
          }
        } catch (err: any) {
          console.error("Booking fetch error:", err.message);
          Alert.alert("Error", err.response?.data?.message || "Network error");
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    } else {
      setLoading(false);
      Alert.alert("Error", "Missing booking data");
    }
  }, [bookingId]);

  if (loading)
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00BCD4" />
        </View>
      </SafeAreaView>
    );

  if (!booking)
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text>Booking not found</Text>
        </View>
      </SafeAreaView>
    );

  const traveller =
    booking.traveller?.firstName && booking.traveller?.lastName
      ? `${booking.traveller.firstName} ${booking.traveller.lastName}`
      : booking.contact_name || booking.passenger_details?.[0]?.name || "Unknown traveller";

  const totalPrice =
    (booking.flights?.reduce((sum: number, f: any) => sum + (f.ticket_price || 0), 0) || 0) +
    (booking.baggage_option?.price || 0);

  // ✅ Khi nhấn "View Booking Detail" → gửi full object sang trang BookingDetail
  const handleViewDetail = () => {
    router.push({
      pathname: "/pages/BookingDetail",
      params: {
        bookingData: encodeURIComponent(JSON.stringify(booking)),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={{ uri: "https://images.pexels.com/photos/723240/pexels-photo-723240.jpeg" }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <CheckCircle2 color="#22C55E" size={48} strokeWidth={2} />
            <Text style={styles.title}>Booking Successful!</Text>

            {booking.flights?.map((f: any, idx: number) => (
              <View key={idx} style={styles.flightCard}>
                <View style={styles.flightRoute}>
                  <Text style={styles.airportCode}>{f.departure_airport_code}</Text>
                  <ArrowLeftRight color="#9CA3AF" size={22} />
                  <Text style={styles.airportCode}>{f.arrival_airport_code}</Text>
                </View>

                <View style={styles.detailsRow}>
                  <Text style={styles.detailValue}>{traveller}</Text>
                  <Text style={styles.detailValue}>{f.class || "Economy"}</Text>
                </View>

                <Text style={styles.price}>${f.ticket_price?.toFixed(2)}</Text>
              </View>
            ))}

            {booking.baggage_option && (
              <View style={styles.baggageCard}>
                <Text style={styles.detailValue}>
                  Baggage: ${booking.baggage_option.price?.toFixed(2)}
                </Text>
              </View>
            )}

            <Text style={styles.totalPrice}>Total: ${totalPrice?.toFixed(2)}</Text>

            <TouchableOpacity style={styles.detailButton} onPress={handleViewDetail}>
              <Text style={styles.detailButtonText}>View Booking Detail</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.homeLink}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  background: { ...StyleSheet.absoluteFillObject },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginVertical: 15 },
  flightCard: {
    width: "100%",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  flightRoute: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  airportCode: { fontSize: 20, fontWeight: "700", marginHorizontal: 10, color: "#1F2937" },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#111827", flex: 1, textAlign: "center" },
  price: { fontSize: 18, fontWeight: "700", color: "#111827", textAlign: "center", marginTop: 5 },
  baggageCard: {
    width: "100%",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  totalPrice: { fontSize: 20, fontWeight: "700", color: "#111827", marginVertical: 10 },
  detailButton: {
    backgroundColor: "#00BCD4",
    paddingVertical: 14,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  detailButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  homeLink: { fontSize: 14, fontWeight: "600", color: "#00BCD4", marginTop: 5 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F9FAFB" },
});
