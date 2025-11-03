import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { User, Briefcase, Armchair, CreditCard } from "lucide-react-native";

interface SeatLayout {
  seat_number: string;
  value: number;
  class: string;
  status: boolean;
}

interface FlightData {
  flight_id: string;
  airplane_id: string;
  departure_airport_code: string;
  arrival_airport_code: string;
  seat_layout: SeatLayout[];
  ticket_price: number;
}

export default function Seat() {
  const router = useRouter();
  const { flightIds, travellerData, baggageData, selectedSeatsData } =
    useLocalSearchParams();

  const BASE_URL = "http://localhost:3000";

  const [flights, setFlights] = useState<FlightData[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Record<string, string[]>>(() => {
  if (!selectedSeatsData) return {};
  const dataStr = Array.isArray(selectedSeatsData) ? selectedSeatsData[0] : selectedSeatsData;
  try {
    return JSON.parse(decodeURIComponent(dataStr));
  } catch {
    return {};
  }
});

  const [loading, setLoading] = useState(true);

  let parsedTravellerData = null;
  try {
    parsedTravellerData =
      travellerData && typeof travellerData === "string"
        ? JSON.parse(decodeURIComponent(travellerData))
        : travellerData;
  } catch (err) {
    console.warn("Failed to parse travellerData:", err);
  }

  let parsedBaggageData = null;
  try {
    parsedBaggageData =
      baggageData && typeof baggageData === "string"
        ? JSON.parse(decodeURIComponent(baggageData))
        : baggageData;
  } catch (err) {
    console.warn("Failed to parse baggageData:", err);
  }

  const flightIdArray: string[] = (() => {
  if (!flightIds) return [];
  if (Array.isArray(flightIds)) return flightIds;
  if (typeof flightIds === "string") {
    try {
      return flightIds.startsWith("[") ? JSON.parse(flightIds) : [flightIds];
    } catch {
      return [flightIds];
    }
  }
  return [];
})();


  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const responses = await Promise.all(
          flightIdArray.map(async (id) => {
            const res = await fetch(
              `${BASE_URL}/api/flights/seats?flight_id=${id}`
            );
            const json = await res.json();
            if (!json.status || !json.data) throw new Error("Flight not found");
            const f = json.data[0];
            return {
              flight_id: id,
              airplane_id: f.airplane_id || "",
              departure_airport_code: f.from || f.departure_airport_code || "",
              arrival_airport_code: f.to || f.arrival_airport_code || "",
              seat_layout: f.seat_layout || [],
              ticket_price: f.ticket_price || 320,
            } as FlightData;
          })
        );
        setFlights(responses);
      } catch (err) {
        console.error("Error fetching flights:", err);
        Alert.alert("Error", "Cannot load flight data");
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [flightIds]);

  const handleSelectSeat = (flight_id: string) => {
    router.push({
      pathname: "/pages/SeatSelection",
      params: {
        flightId: flight_id,
        travellerData: encodeURIComponent(JSON.stringify(parsedTravellerData)),
        baggageData: encodeURIComponent(JSON.stringify(parsedBaggageData)),
        selectedSeatsData: encodeURIComponent(JSON.stringify(selectedSeats)), // gửi object toàn bộ ghế
        flightIds: encodeURIComponent(JSON.stringify(flightIdArray)),
      },
    });
  };

  const handleNext = () => {
    const allSeatsChosen = flightIdArray.every(
      (id) => selectedSeats[id] && selectedSeats[id].length > 0
    );

    if (!allSeatsChosen) {
      Alert.alert("Missing seats", "Please select seats for all flights.");
      return;
    }

    const bookingData = {
      flights,
      traveller: parsedTravellerData,
      baggage: parsedBaggageData,
      seats: selectedSeats,
    };

    router.push({
      pathname: "/pages/Payment",
      params: { bookingData: encodeURIComponent(JSON.stringify(bookingData)) },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  if (!flights.length) {
    return (
      <View style={styles.centered}>
        <Text>No flight data found</Text>
      </View>
    );
  }

  const basePrice = flights.reduce((sum, f) => sum + f.ticket_price, 0);
  const baggagePrice = parsedBaggageData
    ? parsedBaggageData.checkedBagPrice + parsedBaggageData.insurancePrice
    : 0;
  const totalPrice = basePrice + baggagePrice;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <View style={styles.stepIndicator}>
            <View style={[styles.stepIcon, styles.stepComplete]}>
              <User color="#fff" size={18} />
            </View>
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <View style={[styles.stepIcon, styles.stepComplete]}>
              <Briefcase color="#fff" size={18} />
            </View>
            <View style={[styles.stepLine, styles.stepLineActive]} />
            <View style={[styles.stepIcon, styles.stepActive]}>
              <Armchair color="#fff" size={18} />
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepIcon}>
              <CreditCard color="#9CA3AF" size={18} />
            </View>
          </View>
        </View>

        {/* Body */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={styles.title}>Seat</Text>
            <Text style={styles.subTitle}>
              Select flight your preferred seats for each flight
            </Text>

            {parsedTravellerData && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Traveller:</Text>
                <Text style={styles.infoText}>
                  {parsedTravellerData.firstName} {parsedTravellerData.lastName}
                </Text>
              </View>
            )}

            {flights.map((flight) => (
              <View style={styles.section} key={flight.flight_id}>
                <Text style={styles.sectionTitle}>
                  Flight to {flight.arrival_airport_code}
                </Text>

                <TouchableOpacity
                  style={styles.flightCard}
                  onPress={() => handleSelectSeat(flight.flight_id)}
                >
                  <View style={styles.flightInfo}>
                    <Armchair color="#6B7280" size={22} />
                    <View style={styles.flightDetails}>
                      <Text style={styles.flightRoute}>
                        {flight.departure_airport_code} -{" "}
                        {flight.arrival_airport_code}
                      </Text>
                      <Text style={styles.flightPrice}>
                        Seats from ${flight.ticket_price.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.selectLink}>Select</Text>
                </TouchableOpacity>

                {selectedSeats[flight.flight_id] &&
                  selectedSeats[flight.flight_id].length > 0 && (
                    <View style={styles.selectedSeatsBox}>
                      <Text style={styles.selectedLabel}>Selected seats:</Text>
                      <Text style={styles.selectedSeats}>
                        {selectedSeats[flight.flight_id].join(", ")}
                      </Text>
                    </View>
                  )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>${totalPrice.toFixed(2)}</Text>
            <Text style={styles.priceNote}>
              {flights.length} flight(s) • 1 adult
            </Text>
          </View>
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}




const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  wrapper: { flex: 1, justifyContent: "space-between" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  backButton: { fontSize: 22, color: "#111827", marginBottom: 15 },
  stepIndicator: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  stepIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  stepActive: { backgroundColor: "#00BCD4" },
  stepComplete: { backgroundColor: "#00BCD4" },
  stepLine: { width: 28, height: 2, backgroundColor: "#E5E7EB" },
  stepLineActive: { backgroundColor: "#00BCD4" },
  title: { fontSize: 22, fontWeight: "700", color: "#111827", marginTop: 10, textAlign: "center" },
  subTitle: { fontSize: 15, color: "#4B5563", fontWeight: "500", marginVertical: 15, textAlign: "center" },
  infoBox: { backgroundColor: "#F9FAFB", padding: 12, borderRadius: 8, marginBottom: 12 },
  infoLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  infoText: { fontSize: 14, fontWeight: "600", color: "#111827" },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 10 },
  flightCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  flightInfo: { flexDirection: "row", alignItems: "center" },
  flightDetails: { marginLeft: 12 },
  flightRoute: { fontSize: 15, fontWeight: "500", color: "#1F2937", marginBottom: 3 },
  flightPrice: { fontSize: 13, color: "#6B7280" },
  selectLink: { fontSize: 14, fontWeight: "600", color: "#8B5CF6" },
  selectedSeatsBox: { marginTop: 12, padding: 12, backgroundColor: "#EFF6FF", borderRadius: 8 },
  selectedLabel: { fontSize: 12, color: "#1E40AF", marginBottom: 4 },
  selectedSeats: { fontSize: 14, fontWeight: "600", color: "#1E40AF" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: { fontSize: 24, fontWeight: "700", color: "#111827" },
  priceNote: { fontSize: 14, color: "#6B7280" },
  nextBtn: { backgroundColor: "#00BCD4", paddingVertical: 12, paddingHorizontal: 50, borderRadius: 8 },
  nextText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
