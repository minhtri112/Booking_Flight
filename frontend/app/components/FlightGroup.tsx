import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Flight } from '../types/types';

import { FlightCard } from './FlightCard';

type FlightGroupProps = {
    flight: Flight;
};

export function FlightGroup({ flight }: FlightGroupProps) {
    return (
        <View style={styles.groupCard}>
            {flight.path.map((item, index) => (
                <FlightCard key={index} item={item} />
            ))}

            <View style={styles.footer}>
                <TouchableOpacity style={styles.heartButton}>
                    <Heart size={24} color="#6B7280" strokeWidth={2} />
                </TouchableOpacity>

                <Text style={styles.price}>${flight.totalPrice}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create(
    {
        groupCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 10,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
        },
        heartButton: { 
            padding: 4 
        },
        price: { 
            fontSize: 20, 
            fontWeight: '700', 
            color: '#111827' 
        },
    }
)