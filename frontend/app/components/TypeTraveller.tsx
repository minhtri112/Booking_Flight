import { useState } from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';


type TypeTravellerProps = {
    personType: string,
    ageRange: string,
    setTypePerson: React.Dispatch<React.SetStateAction<{
        Adults: number;
        Children: number;
        Infants: number;
    }>>;
}


export default function TypeTraveller({personType,ageRange,setTypePerson}: TypeTravellerProps) {
  const [count,setCount] = useState(0);

  const handleIncrement = () => { 
    setCount(count + 1);
    setTypePerson(prev => ({ ...prev, [personType]: count + 1 }));
  };

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
      setTypePerson(prev => ({ ...prev, [personType]: count - 1 }));
    }
  };

  return (
        <View style={styles.row}>
            <View>
                <Text style={styles.label}>{personType}</Text>
                <Text style={styles.subLabel}>{ageRange}</Text>
            </View>
            <View style={styles.counter}>
                <TouchableOpacity style={styles.circleButton} onPress={handleDecrement}>
                    <Text style={styles.btnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.countText}>{count}</Text>
                <TouchableOpacity style={styles.circleButton} onPress={handleIncrement}>
                    <Text style={styles.btnText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
  subLabel: {
    fontSize: 13,
    color: "#777",
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 18,
    color: "#333",
  },
    
  countText: {
    fontSize: 16,
    width: 24,
    textAlign: "center",
  },
})