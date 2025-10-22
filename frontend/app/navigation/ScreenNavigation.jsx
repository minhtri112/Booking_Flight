import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigation } from "./TabNavigation";
import TravellerInformation from '../pages/TravellerInformation';
import BaggageInformation from '../pages/BaggageInformation';
import Seat from '../pages/Seat';
import SeatSelection from '../pages/SeatSelection';
import Payment from '../pages/Payment'; 
import BookingSuccess from '../pages/BookingSuccess';
import BookingDetail from '../pages/BookingDetail';

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
      <Stack.Screen 
        name="TravellerInformation" 
        component={TravellerInformation} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="BaggageInformation" 
        component={BaggageInformation} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="Seat" 
        component={Seat} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="SeatSelection" 
        component={SeatSelection} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="Payment" 
        component={Payment} 
        options={{ headerShown: false }} 
      />

       <Stack.Screen 
        name="BookingSuccess" 
        component={BookingSuccess} 
        options={{ headerShown: false }} 
      />

      <Stack.Screen 
        name="BookingDetail" 
        component={BookingDetail} 
        options={{ headerShown: false }} 
      />


    </Stack.Navigator>
    );
}