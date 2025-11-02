import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type TypeCabinProps = {
    cabinClass: string,
    isSelected: boolean,
}

export default function TypeCabin({ cabinClass, isSelected}: TypeCabinProps) {
    return (
        <TouchableOpacity style={styles.classOption}>
            <Text style={styles.classText}>{cabinClass}</Text>
            {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    classOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 14,
        borderBottomWidth: 0.5,
        borderBottomColor: "#eee",
    },

    classText: {
        fontSize: 15,
    },
    checkMark: {
        color: "#00BCD4",
        fontWeight: "bold",
    },
})