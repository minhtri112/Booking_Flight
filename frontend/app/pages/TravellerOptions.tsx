import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import TypeTraveller from "../components/TypeTraveller"
import TypeCabin from "../components/TypeCabin";
import { useNavigation } from "expo-router";

import {TypeNavigationProp} from "../types/types";


const cabinClasses = [
    {
        name: "Economy",
        isSelected: true,
    },
    {
        name: "Premium Economy",
        isSelected: false,
    },
    {
        name: "Business",
        isSelected: false,
    },
    {
        name: "First Class",
        isSelected: false,
    }
];

export default function TravellerOptions() {
    const navigation = useNavigation<TypeNavigationProp>();


    const onFinish = () => {
        navigation.navigate("SearchFlight");
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Options</Text>

                <Text style={styles.sectionTitle}>Traveller</Text>

                {/* Adults */}
                <TypeTraveller personType="Adults" ageRange="12+ years" />
                <TypeTraveller personType="Children" ageRange="2–12 years" />
                <TypeTraveller personType="Infants" ageRange="Under 2 years" />



                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Cabin Class</Text>
                 {
                    cabinClasses.map((cabin, index) => (
                        <TypeCabin
                            key={index}
                            cabinClass={cabin.name}
                            isSelected={cabin.isSelected}
                        />
                    ))
                 }

            </ScrollView>

            <View style={styles.footer}>
                <Text style={styles.tripType}>Round-trip</Text>
                <TouchableOpacity onPress={onFinish}  style={styles.doneButton}>
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
});
