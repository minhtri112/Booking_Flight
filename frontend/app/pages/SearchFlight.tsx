import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator, 
} from "react-native";
import { ChevronLeft, Bell, SlidersHorizontal } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";

import { FlightGroup } from "../components/FlightGroup";
import FilterFlightModel from "../components/FilterFlightModel";
import { addFlights } from "../redux/ordersSlice";
import { apiService } from "../services/fetchAPI";
import { Flight, TypeNavigationProp } from "../types/types";

export default function FlightSearchScreen() {
  const [flightData, setFlightData] = useState<Flight[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const route = useRoute<any>();
  const { departure_airport_code, arrival_airport_code } = route.params;

  const navigation = useNavigation<TypeNavigationProp>();
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.orders);

  const index = orders.flights.findIndex((item: any) => {
    return (
      item.arrival_airport_code === arrival_airport_code &&
      item.departure_airport_code === departure_airport_code
    );
  });

  const length = orders.flights.length;

  const dateFromStr = orders.flights[0]?.date;
  const dateToStr = orders.flights[length - 1]?.date;

  const dateFrom = dateFromStr ? new Date(dateFromStr) : new Date();
  const dateTo = dateToStr ? new Date(dateToStr) : new Date();

  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const formattedFrom = dateFrom.toLocaleDateString("en-US", options);
  const formattedTo = dateTo.toLocaleDateString("en-US", options);

  const totalPassengers = (Object.values(orders.passenger_details) as number[]).reduce(
    (sum, value) => sum + value,
    0
  );

  useEffect(() => {
    const fetchFlights = async () => {
      if (index < 0) return;
      setLoading(true);
      const flight = orders.flights[index];
      try {
        const dateISO = new Date(flight.date).toISOString().split("T")[0];
        const req = await apiService.post("flights/one-way", {
          from: flight.departure_airport_code,
          to: flight.arrival_airport_code,
          date: dateISO,
          filter: selectedFilters,
        });

        setFlightData(req.data);
      } catch (err) {
        console.error("Fetch Flights Error:", err);
      } finally {
        setLoading(false); 
      }
    };

    fetchFlights();
  }, [orders.flights, index, selectedFilters]);

  const handleFlightPress = (item: Flight) => {
    dispatch(
      addFlights({
        index,
        path: [...item.path],
        totalPassengers,
      })
    );
    
    if (index === length - 1) {
      navigation.navigate("FlightDetail");
    } else {
      navigation.navigate("SelectFlight");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.route}>
            {orders.flights[index]?.departure_airport_code ?? "---"} -{" "}
            {orders.flights[index]?.arrival_airport_code ?? "---"}
          </Text>
          <Text style={styles.details}>
            {formattedFrom} - {formattedTo}, {totalPassengers} traveller
          </Text>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalVisible(true)}>
          <SlidersHorizontal size={18} color="#111827" />
          <Text style={styles.filterText}>Sort & Filters</Text>
        </TouchableOpacity>

        {["Airlines", "Stops", "Time"].map((label) => (
          <TouchableOpacity
            key={label}
            style={styles.chipButton}
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.chipText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading flights...</Text>
        </View>
      ) : (
        <FlatList
          data={flightData}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <FlightGroup flight={item} onPress={() => handleFlightPress(item)} />
          )}
        />
      )}

      {/* Modal filter */}
      <FilterFlightModel
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        setSelectedFilters={setSelectedFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  iconButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  route: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  details: {
    fontSize: 13,
    color: "#6B7280",
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  chipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#4B5563",
  },
});
