import { StyleSheet, TouchableOpacity,Text } from 'react-native';
import { Calendar } from 'lucide-react-native';


type Props = {
    textCalendar ?: string;
}

export default function ButtonCalendar({textCalendar} : Props) {
    return (
        <TouchableOpacity style={styles.dateButton}>
            <Calendar size={20} color="#666" style={styles.dateIcon} />
            <Text>{textCalendar}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
    },
    dateIcon: {
        marginRight: 12,
    },
})