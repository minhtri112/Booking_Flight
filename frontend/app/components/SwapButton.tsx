import { TouchableOpacity, StyleSheet,View } from "react-native";
import { ArrowDownUp } from "lucide-react-native";

export default function SwapButton() {
    return (
        <View style={styles.swapButton}>
            <TouchableOpacity >
                <ArrowDownUp size={20} color="#000" />
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    swapButton: {
        position : 'absolute',
        padding : 5,
        borderRadius : 50,
        backgroundColor: '#e0e0e0',
        top : '50%',
        right : 20,
        borderColor : '#fff',
        borderWidth : 2,
        zIndex : 10,
        transform: [{ translateY: -15 }]
    },
});