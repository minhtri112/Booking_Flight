import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

export default function Header({text, Icon}: {text: string, Icon: any}) {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
                <Icon size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
    },
    icon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
        flex : 1,
        textAlign: 'center',
    },
})
