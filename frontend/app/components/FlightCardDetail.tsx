import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Plane, Wifi, Plug, Tv, Utensils } from 'lucide-react-native';
import { useEffect, useState } from "react";
import FetchApi from "../services/fetchAPI";

type FlightCardDetailProps = {
    item: any;
}


export default function FlightCardDetail({ item }: FlightCardDetailProps) {
    const [visible, setVisible] = useState(false);
    const [cityFrom,setCityFrom] = useState("London");
    const [cityTo,setCityTo] = useState("New York city");


    useEffect(() => {
        const fetchCities = async () => {
            const req1 = await FetchApi.get(`airports/${item.departure_airport_code}`);
            const req2 = await FetchApi.get(`airports/${item.arrival_airport_code}`);
            setCityFrom(req1.data.city);
            setCityTo(req2.data.city);
        }
        fetchCities();
    },[item]);

    const hoursDepart = new Date(item.departure_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // bật định dạng AM/PM
    });
    const hoursArrive = new Date(item.arrival_time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // bật định dạng AM/PM
    });
    const duration = item.duration_minutes;
    const dateDepart = new Date(item.departure_time).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
    const dateArrive = new Date(item.arrival_time).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
    

    return (
        <View style={styles.flightCard}>
            <View style={styles.flightHeader}>
                <View>
                    <Text style={styles.flightRoute}>{cityFrom} - {cityTo}</Text>
                    <Text style={{ fontSize: 12, color: "#6b7280" }}>{item.airplane_id.airline_name}</Text>
                </View>
            </View>


            <View style={styles.flightTimes}>

                <View >
                    <Text style={styles.time}>{hoursDepart}</Text>
                    <Text style={styles.date}>{dateDepart}</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.text}>{hoursDepart}</Text>
                    <View style={styles.line} />
                    <Text style={styles.text}>{duration}m</Text>
                </View>
                <View >
                    <Text style={styles.time}>{hoursArrive}</Text>
                    <Text style={styles.date}>{dateArrive}</Text>
                </View>
            </View>

            {/* Amenities */}
            <View style={[styles.amenities, visible ? {} : { display: 'none' }]}>
                <View style={styles.amenityRow}>
                    <View style={styles.amenityItem}>
                        <Plane size={16} color="#6b7280" />
                        <Text style={styles.amenityText}>28 seat pitch</Text>
                    </View>
                    <View style={styles.amenityItem}>
                        <Utensils size={16} color="#6b7280" />
                        <Text style={styles.amenityText}>Light meal</Text>
                    </View>
                </View>
                <View style={styles.amenityRow}>
                    <View style={styles.amenityItem}>
                        <Wifi size={16} color="#6b7280" />
                        <Text style={styles.amenityText}>Chance of Wifi</Text>
                    </View>

                    <View style={styles.amenityItem}>
                        <Plug size={16} color="#6b7280" />
                        <Text style={styles.amenityText}>No power outlet</Text>
                    </View>
                </View>
                <View style={styles.amenityRow}>
                    <View style={styles.amenityItem}>
                        <Tv size={16} color="#6b7280" />
                        <Text style={styles.amenityText}>No entertainment</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={() => setVisible(!visible)}>
                <Text style={styles.moreInfo}>{visible ? "Less info" : "More info"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    flightCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 20,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    flightHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    flightRoute: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1a1a1a',
    },
    flightTimes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    time: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#9ca3af',
    },

    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#A0A0A0", // màu xám nhạt
        fontSize: 12,
    },
    line: {
        width: 80,          // độ dài đường kẻ
        height: 1,          // độ dày đường kẻ
        backgroundColor: "#D0D0D0", // màu xám nhạt
        marginVertical: 4,  // khoảng cách giữa chữ và đường kẻ
    },
    amenities: {
        gap: 12,
    },
    amenityRow: {
        flexDirection: 'row',
        gap: 12,
    },
    amenityItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    amenityText: {
        fontSize: 13,
        color: '#6b7280',
        flex: 1,
    },
    moreInfo: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 16,
        fontWeight: '500',
    },
});

