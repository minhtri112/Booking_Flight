import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Plane } from 'lucide-react-native';
import { Airport } from '../types/types';

interface AirportItemProps {
    airport: Airport;
    onPress?: () => void;
}

export default function AirportItem({ airport, onPress }: AirportItemProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconContainer}>
                <Plane size={20} color="#00BDD6" />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.airportCode}>{airport.airport_code}</Text>
                    <Text style={styles.airportName} numberOfLines={1}>{airport.airport_name}</Text>
                </View>
                <Text style={styles.location} numberOfLines={1}>
                    {airport.city}, {airport.country}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e6f7fa',
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 22,
        backgroundColor: '#f0f9fb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    contentContainer: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    airportCode: {
        fontSize: 14,
        fontWeight: '700',
        color: '#00BDD6',
        marginRight: 12,
        minWidth: 50,
    },
    airportName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1F2937',
        flex: 1,
    },
    location: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
});
