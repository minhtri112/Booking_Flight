import Toast from 'react-native-toast-message';
import { toastConfig } from '../components/Alter';


import { createStackNavigator } from '@react-navigation/stack';
import { TabNavigation } from "./TabNavigation";
import TravellerInformation from '../pages/TravellerInformation';
import BaggageInformation from '../pages/BaggageInformation';
import Seat from '../pages/Seat';
import SeatSelection from '../pages/SeatSelection';
import Payment from '../pages/Payment';
import BookingSuccess from '../pages/BookingSuccess';
import BookingDetail from '../pages/BookingDetail';
import RoundTripFlight from "../pages/RoundTripFlight";
import OneTripFlight from "../pages/OneTripFlight";
import MultiCityTripFlight from "../pages/MultiCityTripFlight";
import SearchFlight from '../pages/SearchFlight';
import FlightDetail from '../pages/FlightDetail';
import SelectFlight from '../pages/SelectFlight';
import Login from "../pages/Login";
import Register from "../pages/Register";

import { RootStackParamList } from '../types/types';
import TravellerOptions from '../pages/TravellerOptions';

const Stack = createStackNavigator<RootStackParamList>();


export default function ScreenNavigation() {
  return (
    <>
      <Stack.Navigator>
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

        <Stack.Screen
          name="RoundTripFlight"
          component={RoundTripFlight}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="OneTripFlight"
          component={OneTripFlight}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="MultiCityTripFlight"
          component={MultiCityTripFlight}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="TravellerOptions"
          component={TravellerOptions}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SearchFlight"
          component={SearchFlight}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="FlightDetail"
          component={FlightDetail}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SelectFlight"
          component={SelectFlight}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>

      <Toast config={toastConfig} />

    </>
  );
}