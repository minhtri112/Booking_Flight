import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("TravellerInformation")}>
        <Text>Go to Traveller Info</Text>
      </TouchableOpacity>
    </View>
  );
}
