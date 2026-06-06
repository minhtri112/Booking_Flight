import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Plane, PlaneLanding } from 'lucide-react-native';

import ButtonSearchAirport from '../components/ButtonSearchAirport';
import ButtonCalendar from '../components/ButtonCalendar';
import ButtonTypeTrip from '../components/ButtonTypeTrip';

import { useNavigation } from 'expo-router';
import { TypeNavigationProp } from '../types/types';
import { useState } from 'react';
import FindAirportModel from '../components/FindAriportModel';
import { showError } from '../components/Alter';
import { useDispatch } from 'react-redux';
import { addAirportMultiCity } from '../redux/ordersSlice';
import Header from "../components/Header";

type Flight = {
    from: string;
    to: string;
    date: string;
};


export default function MultiCityTripFlight() {
    const [flights, setFlights] = useState<Flight[]>([{ from: 'FROM', to: 'TO', date: new Date().toISOString() }]);
    const [visibleAirport, setVisibleAirport] = useState(false);
    const [indexFlight, setIndexFlight] = useState(0);
    const dispatch = useDispatch();


    console.log("Flights:", flights);



    const navigation = useNavigation<TypeNavigationProp>();
    const tripType = 'Multi-city';

    const addFlight = () => {
        setFlights([...flights, { from: 'FROM', to: 'TO', date: new Date().toISOString() }]);
    }

    const handleNextPress = () => {
        const check = flights.some(flight => flight.from === 'FROM' || flight.to === 'TO');
        if (check) {
            showError('Please fill in all required fields!');
            return;
        }
        dispatch(addAirportMultiCity(flights))


        navigation.navigate('TravellerOptions');

    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                <Header text="Flight" Icon={X} />

                <View style={styles.tripTypeContainer}>
                    <ButtonTypeTrip tripName="Round-trip" tripTypeActive={tripType} onPress={() => navigation.navigate('RoundTripFlight')} />
                    <ButtonTypeTrip tripName="One-way" tripTypeActive={tripType} onPress={() => navigation.navigate('OneTripFlight')} />
                    <ButtonTypeTrip tripName="Multi-city" tripTypeActive={tripType} />
                </View>

                <View style={styles.formContainer}>

                    {
                        flights.map((item, index) => {
                            return (
                                <View key={index} >
                                    <View style={styles.locationContainer}>
                                        <ButtonSearchAirport textName={item.from} Icon={Plane} onPress={() => { setVisibleAirport(true); setIndexFlight(index) }} />
                                        <ButtonSearchAirport textName={item.to} Icon={PlaneLanding} onPress={() => { setVisibleAirport(true); setIndexFlight(index) }} />
                                    </View>

                                    <View style={styles.dateContainer}>
                                        <ButtonCalendar
                                            textCalendar={
                                                item.date
                                                    ? new Date(item.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : 'Depart'
                                            }
                                            date={item.date ? new Date(item.date) : null}
                                            setDate={(date: any) => {
                                                const newFlights = [...flights];
                                                newFlights[index].date = date ? date.toISOString() : new Date().toISOString();
                                                setFlights(newFlights);
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>

                <View style={styles.containerButtonAddFlight}>
                    <TouchableOpacity onPress={addFlight} style={styles.buttonAddFlight}>
                        <Text style={styles.textButtonAddFlight} >Add Flight</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.searchButton} onPress={handleNextPress}>
                <Text style={styles.searchButtonText}>Next</Text>
            </TouchableOpacity>


            <FindAirportModel
                visible={visibleAirport}
                onClose={() => setVisibleAirport(false)}
                title="Select Airport"
                currentFrom=""
                currentTo=""
                setFlights={setFlights}
                index={indexFlight}
                flights={flights}
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
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    locationContainer: {
        flexDirection: 'row',
        gap: 12,
        padding: 5,
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
    containerButtonAddFlight: {
        paddingHorizontal: 20,
    },
    textButtonAddFlight: {
        color: '#00bcd4',
        fontWeight: '500',
        fontSize: 15,
    },
    buttonAddFlight: {
        borderWidth: 1,
        borderColor: '#00bcd4',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 16,
    }
});
