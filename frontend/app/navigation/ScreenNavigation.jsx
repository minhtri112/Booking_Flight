import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigation } from "./TabNavigation";



const Stack = createStackNavigator();

export default function ScreenNavigation() {
    return (
    <Stack.Navigator   >
      <Stack.Screen 
        name="Tab" 
        component={TabNavigation} 
        options={{ headerShown: false }} 
      />
      {/* Các màn hình con */}
    </Stack.Navigator>
    );
}