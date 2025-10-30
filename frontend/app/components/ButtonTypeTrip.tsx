import { Text, StyleSheet, TouchableOpacity } from 'react-native';


type Props = {
    tripName : string;
    tripTypeActive : string;
    onPress?: () => void;
}

export default function ButtonTypeTrip({tripName,tripTypeActive,onPress} : Props) {

    return (
        <TouchableOpacity
            style={[styles.tripTypeButton, tripTypeActive === tripName && styles.tripTypeButtonActive]}
            onPress={onPress}
        >
            <Text style={[styles.tripTypeText, tripTypeActive === tripName && styles.tripTypeTextActive]}>
                {tripName}
            </Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create(
    {
        tripTypeButton: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            marginRight: 8,
            borderBottomWidth: 2,
            borderBottomColor: 'transparent',
        },
        tripTypeButtonActive: {
            borderBottomColor: '#000',
        },
        tripTypeText: {
            fontSize: 15,
            color: '#666',
            fontWeight: '500',
        },
        tripTypeTextActive: {
            color: '#000',
            fontWeight: '600',
        }
    },
)