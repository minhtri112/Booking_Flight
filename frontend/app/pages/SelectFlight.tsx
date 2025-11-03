import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "expo-router";
import { ChevronLeft, PlaneTakeoff, ArrowUp } from "lucide-react-native";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FetchApi from "../services/fetchAPI";

import {TypeNavigationProp} from "../types/types";

export default function SelectFlight() {
    const navigation = useNavigation<TypeNavigationProp>();
    const [airports, setAirports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const flightData = useSelector((state: any) => state.orders.flights);

    useEffect(() => {
        const fetchAirports = async () => {
            try {
                if (!flightData || flightData.length === 0) return;

                const results: any[] = [];
                for (const flight of flightData) {
                    const [req_1, req_2] = await Promise.all([
                        FetchApi.get(`airports/${flight.departure_airport_code}`),
                        FetchApi.get(`airports/${flight.arrival_airport_code}`),
                    ]);
                    results.push({
                        departure: req_1.data,
                        arrival: req_2.data,
                        date: flight.date,
                    });
                }

                setAirports(results);
            } catch (error) {
                console.error("Fetch airports failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAirports();
    }, [flightData]);

    const handleSelectFlight = (item: any) => {
        navigation.navigate("SearchFlight", {
            departure_airport_code: item.departure.airport_code,
            arrival_airport_code: item.arrival.airport_code,
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#00BCD4" />
                <Text style={{ marginTop: 8, color: "#6b7280" }}>Loading flights...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ChevronLeft size={26} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Flight</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {airports.map((item, index) => (
                    <View style={styles.card} key={index}>
                        <View style={styles.row}>
                            <PlaneTakeoff size={32} color="#00BCD4" style={styles.icon} />

                            <View style={styles.flightInfo}>
                                <View style={styles.codeRow}>
                                    <Text style={styles.flightCode}>{item.departure.airport_code}</Text>
                                    <ArrowUp size={20} color="#00BCD4" style={styles.planeBetween} />
                                    <Text style={styles.flightCode}>{item.arrival.airport_code}</Text>
                                </View>

                                <Text style={styles.flightRoute}>
                                    {item.departure.city} → {item.arrival.city}
                                </Text>
                                <Text style={styles.flightTime}>
                                    Date: {new Date(item.date).toLocaleDateString("vi-VN")}
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={() => handleSelectFlight(item)}>
                                <Text style={styles.buttonText}>Select</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        backgroundColor: "#fff",
    },
    backButton: {
        width: 36,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        marginRight: 36,
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        marginRight: 10,
    },
    flightInfo: {
        flex: 1,
    },
    codeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    planeBetween: {
        transform: [{ rotate: "90deg" }],
    },
    flightCode: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    flightRoute: {
        fontSize: 14,
        color: "#6b7280",
        marginTop: 4,
        textAlign: "center",
    },
    flightTime: {
        fontSize: 13,
        color: "#9ca3af",
        marginTop: 2,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#00BCD4",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});
