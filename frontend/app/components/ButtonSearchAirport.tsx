import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


type Props = {
    textName: string;
    Icon: React.ComponentType<any>;
    onPress ? : () => void;
}

export default function ButtonSearchAirport({ textName, Icon, onPress }: Props) {
    return (
        <TouchableOpacity style = {{flex : 1}}  onPress={onPress}>
            <View style={styles.inputWrapper}>
                <Icon size={20} color="#666" style={styles.inputIcon} />
                <Text style={styles.text}>{textName}</Text>
            </View>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    text: {
        color: '#666',
        fontWeight: '500'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 15,
    },
    inputIcon: {
        marginRight: 12,
    },
})