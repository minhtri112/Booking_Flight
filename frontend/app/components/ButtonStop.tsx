import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Check } from 'lucide-react-native';


type ButtonStopProps = {
    nameStops: string, 
    nameSelect: boolean, 
    onPress: () => void
}

export default function ButtonStop({nameStops,nameSelect,onPress}:ButtonStopProps ) {
    return (
        <TouchableOpacity
            style={styles.option}
            onPress={onPress}>
            <Text style={styles.optionText}>{nameStops}</Text>
            {nameSelect && (
                <Check size={20} color="#00B6D4" />
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
      option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
})