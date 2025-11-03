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
import { Armchair, ArrowLeft } from "lucide-react-native";

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

export default function SeatSelection() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // ------------------ Chuẩn hóa các params ------------------
  const flightId: string =
    Array.isArray(params.flightId) ? params.flightId[0] : params.flightId || "";

  const selectedSeatsData: string =
    Array.isArray(params.selectedSeatsData) ? params.selectedSeatsData[0] : params.selectedSeatsData || "";

  const travellerData: string =
    Array.isArray(params.travellerData) ? params.travellerData[0] : params.travellerData || "";

  const baggageData: string =
    Array.isArray(params.baggageData) ? params.baggageData[0] : params.baggageData || "";

  const flightIds: string =
    Array.isArray(params.flightIds) ? params.flightIds[0] : params.flightIds || "";

  // ------------------ Parse JSON ------------------
  const parsedTravellerData = travellerData ? JSON.parse(decodeURIComponent(travellerData)) : null;
  const parsedBaggageData = baggageData ? JSON.parse(decodeURIComponent(baggageData)) : null;
  const parsedFlightIds: string[] = flightIds ? JSON.parse(decodeURIComponent(flightIds)) : [flightId];
  const parsedSelectedSeats: Record<string, string[]> = selectedSeatsData
    ? JSON.parse(decodeURIComponent(selectedSeatsData))
    : {};

  // ------------------ State ------------------
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>(parsedSelectedSeats[flightId] || []);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/flights/seats?flight_id=${flightId}`);
        const json = await res.json();
        const f = json.data?.[0] || generateMockFlight(flightId);

        setFlight({
          flight_id: f.flight_id || flightId,
          airplane_id: f.airplane_id || "",
          departure_airport_code: f.from || f.departure_airport_code || "",
          arrival_airport_code: f.to || f.arrival_airport_code || "",
          seat_layout: f.seat_layout || [],
          ticket_price: f.ticket_price || 320,
        });
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Cannot load flight data");
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [flightId]);

  const toggleSeat = (seatNumber: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber) ? prev.filter((s) => s !== seatNumber) : [...prev, seatNumber]
    );
  };

  const handleNext = () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No seat selected", "Please select at least 1 seat.");
      return;
    }

    const updatedSeats = { ...parsedSelectedSeats, [flightId]: selectedSeats };

    router.push({
      pathname: "/pages/Seat",
      params: {
        flightIds: encodeURIComponent(JSON.stringify(parsedFlightIds)),
        travellerData: encodeURIComponent(JSON.stringify(parsedTravellerData)),
        baggageData: encodeURIComponent(JSON.stringify(parsedBaggageData)),
        selectedSeatsData: encodeURIComponent(JSON.stringify(updatedSeats)),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  if (!flight) {
    return (
      <View style={styles.centered}>
        <Text>Flight not found</Text>
      </View>
    );
  }

  const baggagePrice = parsedBaggageData
    ? (parsedBaggageData.checkedBagPrice || 0) + (parsedBaggageData.insurancePrice || 0)
    : 0;
  const totalPrice = flight.ticket_price + baggagePrice;

  const columns = ["A", "B", "C", "D", "E", "F"];
  const rows = Array.from(
    new Set(flight.seat_layout.map((s) => parseInt(s.seat_number)))
  );

  const getSeatStatus = (seatNumber: string) => {
    const seat = flight.seat_layout.find((s) => s.seat_number === seatNumber);
    if (!seat) return "unavailable";
    if (seat.status) return "unavailable";
    if (selectedSeats.includes(seatNumber)) return "selected";
    return "available";
  };

  const renderSeat = (seatNumber: string) => {
    const status = getSeatStatus(seatNumber);
    return (
      <TouchableOpacity
        key={seatNumber}
        style={[
          styles.seat,
          status === "selected" && styles.seatSelected,
          status === "unavailable" && styles.seatUnavailable,
        ]}
        disabled={status === "unavailable"}
        onPress={() => toggleSeat(seatNumber)}
      >
        {status === "unavailable" ? (
          <Text style={styles.seatUnavailableText}>✕</Text>
        ) : status === "selected" ? (
          <Text style={styles.seatSelectedText}>✓</Text>
        ) : (
          <Text style={styles.seatText}>{seatNumber}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#00BCD4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {flight.departure_airport_code} → {flight.arrival_airport_code}
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {parsedTravellerData && (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Traveller:</Text>
            <Text style={styles.infoText}>
              {parsedTravellerData.firstName} {parsedTravellerData.lastName}
            </Text>
          </View>
        )}

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendAvailable]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendUnavailable]}>
              <Text style={styles.legendUnavailableText}>✕</Text>
            </View>
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.legendSelected]}>
              <Text style={styles.legendSelectedText}>✓</Text>
            </View>
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>

        <View style={styles.seatMapContainer}>
          <View style={styles.columnLabels}>
            <Text style={styles.rowLabel}></Text>
            {columns.map((col, index) => (
              <View key={col} style={styles.columnWrapper}>
                <Text style={styles.columnLabel}>{col}</Text>
                {index === 2 && <View style={styles.aisle} />}
              </View>
            ))}
          </View>

          {rows.map((row) => (
            <View key={row} style={styles.row}>
              <Text style={styles.rowLabel}>{String(row).padStart(2, "0")}</Text>
              {columns.map((col, index) => {
                const seatNumber = `${row}${col}`;
                return (
                  <View key={col} style={styles.columnWrapper}>
                    {renderSeat(seatNumber)}
                    {index === 2 && <View style={styles.aisle} />}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTitle}>{selectedSeats.length} seat(s)</Text>
          <Text style={styles.footerSubtitle}>${totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Text style={styles.nextText}>Select</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ----------------- Mock flight -----------------
function generateMockFlight(flightId: string): FlightData {
  const seats: SeatLayout[] = [];
  const cols = ["A", "B", "C", "D", "E", "F"];
  for (let r = 1; r <= 10; r++) {
    for (let c of cols) {
      seats.push({
        seat_number: `${r}${c}`,
        value: 0,
        class: r <= 2 ? "Business" : "Economy",
        status: Math.random() < 0.2,
      });
    }
  }
  return {
    flight_id: flightId,
    airplane_id: "A320",
    departure_airport_code: "SGN",
    arrival_airport_code: "HAN",
    seat_layout: seats,
    ticket_price: 320,
  };
}

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "600" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },
  infoBox: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginVertical: 12 },
  infoLabel: { fontSize: 12, color: "#6B7280" },
  infoText: { fontSize: 14, fontWeight: "600", color: "#111827" },
  legend: { flexDirection: "row", justifyContent: "space-around", marginVertical: 16 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendBox: { width: 26, height: 26, borderRadius: 6, marginRight: 6, justifyContent: "center", alignItems: "center" },
  legendAvailable: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#00BCD4" },
  legendUnavailable: { backgroundColor: "#F3F4F6", borderWidth: 2, borderColor: "#F3F4F6" },
  legendSelected: { backgroundColor: "#00BCD4" },
  legendText: { fontSize: 13, color: "#374151" },
  legendUnavailableText: { color: "#9CA3AF", fontSize: 12 },
  legendSelectedText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  seatMapContainer: { alignItems: "center", paddingVertical: 10 },
  columnLabels: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  columnWrapper: { flexDirection: "row", alignItems: "center" },
  columnLabel: { width: 36, textAlign: "center", fontSize: 13, fontWeight: "600", color: "#6B7280" },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rowLabel: { width: 36, textAlign: "center", fontSize: 13, fontWeight: "600", color: "#6B7280" },
  seat: {
    width: 40, height: 40, borderRadius: 8, borderWidth: 1, borderColor: "#E5E7EB",
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginHorizontal: 4
  },
  seatUnavailable: { backgroundColor: "#F3F4F6", borderColor: "#F3F4F6" },
  seatUnavailableText: { fontSize: 14, color: "#9CA3AF" },
  seatSelected: { backgroundColor: "#00BCD4", borderColor: "#00BCD4" },
  seatSelectedText: { fontSize: 14, color: "#fff", fontWeight: "700" },
  seatText: { fontWeight: "600", color: "#111827" },
  aisle: { width: 16 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerTitle: { fontSize: 16, fontWeight: "600", color: "#111827" },
  footerSubtitle: { fontSize: 14, color: "#6B7280" },
  nextBtn: { backgroundColor: "#00BCD4", paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  nextText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
