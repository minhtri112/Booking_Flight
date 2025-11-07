import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plane, PlaneLanding } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { TypeNavigationProp } from '../types/types';
import { useState } from 'react';

import ButtonSearchAirport from '../components/ButtonSearchAirport';
import SwapButton from '../components/SwapButton';
import ButtonCalendar from '../components/ButtonCalendar';
import ButtonTypeTrip from '../components/ButtonTypeTrip';
import FindAriportModel from '../components/FindAriportModel';
import { showError } from '../components/Alter';

import { useDispatch } from 'react-redux';
import {addAirportRoundTrip} from '../redux/ordersSlice';
import Header from "../components/Header";

export default function RoundTripFlight() {
    const navigation = useNavigation<TypeNavigationProp>();
    const tripType = 'Round-trip';
    const [visibleAirport, setVisibleAirport] = useState(false);
    const [currentFrom, setCurrentFrom] = useState('FROM');
    const [currentTo, setCurrentTo] = useState('TO');
    const [selectedDateFrom, setSelectedDateFrom] = useState<Date | null>(new Date());
    const [selectedDateTo, setSelectedDateTo] = useState<Date | null>(new Date());
    const dispatch = useDispatch();



    const handleNextPress = () => {
        if (!currentFrom || currentFrom === 'FROM' || !currentTo || currentTo === 'TO') {
            showError("Please fill in all required fields!");
            return;
        }
        navigation.navigate("TravellerOptions");
        dispatch(addAirportRoundTrip({
            from: currentFrom.split('-')[0],
            to: currentTo.split('-')[0],
            dateFrom: selectedDateFrom?.toISOString(),
            dateTo: selectedDateTo?.toISOString(),
            type_trip: tripType
        }));
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                <Header text="Flight" Icon={X} />

                <View style={styles.tripTypeContainer}>
                    <ButtonTypeTrip tripName="Round-trip" tripTypeActive={tripType} />
                    <ButtonTypeTrip tripName="One-way" tripTypeActive={tripType} onPress={() => navigation.navigate('OneTripFlight')} />
                    <ButtonTypeTrip tripName="Multi-city" tripTypeActive={tripType} onPress={() => navigation.navigate('MultiCityTripFlight')} />
                </View>
                <View style={styles.formContainer}>

                    <View style={styles.locationContainer}>
                        <ButtonSearchAirport textName={currentFrom} Icon={Plane} onPress={() => setVisibleAirport(true)} />
                        <SwapButton />
                        <ButtonSearchAirport textName={currentTo} Icon={PlaneLanding} onPress={() => setVisibleAirport(true)} />
                    </View>

                    <View style={styles.dateContainer}>
                        <ButtonCalendar
                            textCalendar={selectedDateFrom
                                ? selectedDateFrom.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : "Depart"}
                            date={selectedDateFrom}
                            setDate={setSelectedDateFrom}
                        />

                        <ButtonCalendar
                            textCalendar={selectedDateTo
                                ? selectedDateTo.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : "Return"}
                            date={selectedDateTo}
                            setDate={setSelectedDateTo}
                        />
                    </View>

                </View>

            </ScrollView>

            <TouchableOpacity style={styles.searchButton} onPress={handleNextPress}>
                <Text style={styles.searchButtonText}>Next</Text>
            </TouchableOpacity>


            <FindAriportModel
                visible={visibleAirport}
                onClose={() => setVisibleAirport(false)}
                title="Where from?"
                currentFrom={currentFrom}
                currentTo={currentTo}
                setCurrentFrom={setCurrentFrom}
                setCurrentTo={setCurrentTo}
            />



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
    tripTypeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        justifyContent : 'space-between',
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
        flexDirection: 'row',
        gap: 12,
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
        padding: 10,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
