import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plane, PlaneLanding } from 'lucide-react-native';

import ButtonSearchAirport from '../components/ButtonSearchAirport';
import SwapButton from '../components/SwapButton';
import ButtonCalendar from '../components/ButtonCalendar';
import ButtonTypeTrip from '../components/ButtonTypeTrip';


import { useNavigation } from 'expo-router';
import { TypeNavigationProp } from '../types/types';

export default function FlightSearchScreen() {
    const navigation = useNavigation<TypeNavigationProp>();

    const tripType = 'One-way';


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton}>
                        <X size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Flight</Text>
                    <View style={styles.placeholder} />
                </View>

                <View style={styles.tripTypeContainer}>
                    <ButtonTypeTrip tripName="Round-trip" tripTypeActive={tripType} onPress={() => navigation.navigate('RoundTripFlight')} />
                    <ButtonTypeTrip tripName="One-way" tripTypeActive={tripType}  />
                    <ButtonTypeTrip tripName="Multi-city" tripTypeActive={tripType} onPress={() => navigation.navigate('MultiCityTripFlight')} />
                </View>

                <View style={styles.formContainer}>

                    <View style={styles.locationContainer}>
                        <ButtonSearchAirport textName="FROM" Icon={Plane} />
                        <SwapButton />
                        <ButtonSearchAirport textName="TO" Icon={PlaneLanding} />
                    </View>

                    <View style={styles.dateContainer}>
                        <ButtonCalendar textCalendar="Fri,Jul 14" />
                    </View>

                </View>

            </ScrollView>

            <TouchableOpacity style={styles.searchButton}>
                <Text style={styles.searchButtonText}>Search flights</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    closeButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    placeholder: {
        width: 40,
    },
    tripTypeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    locationContainer: {
        borderRadius: 12,
        padding: 5,
        position: 'relative',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    dateContainer: {
        marginBottom: 16,
    },
    dateText: {
        fontSize: 15,
        color: '#666',
    },
    detailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 15,
        color: '#666',
    },
    detailSeparator: {
        marginHorizontal: 12,
        fontSize: 15,
        color: '#666',
    },
    searchButton: {
        backgroundColor: '#00bcd4',
        borderRadius: 12,
        padding: 18,
        marginHorizontal: 20,
        marginTop: 32,
        marginBottom: 32,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
