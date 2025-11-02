import {TouchableOpacity,Text,View,StyleSheet} from "react-native"
import { Check } from "lucide-react-native";




type ButtonSelectAirlineProps = {
    nameAirline: string,
    nameSelect: string[], 
    onPress: () => void
}

export default function ButtonSelectAirline({nameAirline, nameSelect, onPress} : ButtonSelectAirlineProps) {
    return (
        <TouchableOpacity
            style={styles.checkboxOption}
            onPress={onPress}
        >
            <Text style={styles.optionText}>{nameAirline}</Text>
            <View
                style={[
                    styles.checkbox,
                    nameSelect.find(item => item === nameAirline) ? styles.checkboxChecked : {},
                ]}>
                <Check size={16} color="#FFF" />
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 15,
    color: '#374151',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#00B6D4',
    borderColor: '#00B6D4',
  },
});