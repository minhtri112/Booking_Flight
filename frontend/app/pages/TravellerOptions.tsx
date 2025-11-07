import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import TypeTraveller from "../components/TypeTraveller"
import TypeCabin from "../components/TypeCabin";
import { useNavigation } from "expo-router";

import { TypeNavigationProp } from "../types/types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editOptions } from "../redux/ordersSlice";
import { ChevronLeft } from "lucide-react-native";
import Header from '../components/Header';

const cabinClasses = [
    "Economy",
    "Premium Economy",
    "Business",
    "First Class",
];


export default function TravellerOptions() {
    const navigation = useNavigation<TypeNavigationProp>();
    const [typePerson, setTypePerson] = useState({
        "Adults": 0,
        "Children": 0,
        "Infants": 0,
    });
    const dispatch = useDispatch();
    const orders = useSelector((state: any) => state.orders);

    console.log("Current Orders in TravellerOptions:", orders);

    const [cabinClass, setCabinClass] = useState("Economy");




    const onFinish = () => {
        dispatch(
            editOptions({
                passenger_details: typePerson,
                cabin_class: cabinClass,
            })
        )
        navigation.navigate("SelectFlight");
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>


                <Header text="Traveller Options" Icon={ChevronLeft} />




                <Text style={styles.sectionTitle}>Traveller</Text>
                <TypeTraveller personType="Adults" ageRange="12+ years" setTypePerson={setTypePerson} />
                <TypeTraveller personType="Children" ageRange="2–12 years" setTypePerson={setTypePerson} />
                <TypeTraveller personType="Infants" ageRange="Under 2 years" setTypePerson={setTypePerson} />

                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Cabin Class</Text>
                {
                    cabinClasses.map((cabin, index) => (
                        <TypeCabin
                            key={index}
                            cabinClass={cabin}
                            isSelected={cabin === cabinClass}
                            onPress={() => setCabinClass(cabin)}
                        />
                    ))
                }

            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.tripType}>Round-trip</Text>
                <TouchableOpacity onPress={onFinish} style={styles.doneButton}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scroll: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 0.5,
        borderTopColor: "#ddd",
        padding: 16,
    },
    tripType: {
        fontSize: 15,
        color: "#555",
    },
    doneButton: {
        backgroundColor: "#00BCD4",
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    doneText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
    iconButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
