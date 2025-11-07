import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Tab: undefined;
  TravellerInformation: undefined;
  BaggageInformation: undefined;
  Seat: undefined;
  SeatSelection: any;
  Payment: any;
  BookingSuccess: any;
  BookingDetail: undefined;
  RoundTripFlight: undefined;
  OneTripFlight: undefined;
  MultiCityTripFlight: undefined;
  TravellerOptions: undefined;
  SearchFlight: any;
  FlightDetail: undefined;
  SelectFlight : undefined;
  Login: undefined;
  Register: undefined;
};


export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Profile: undefined;
};

export type TypeNavigationProp = StackNavigationProp<RootStackParamList, "Tab">;


export type Airport = {
  _id: string,
  airport_code: string,
  airport_name: string,
  city: string,
  country: string,
}


export type FlightItem = {
  _id: string,
  departure_airport_code: string,
  arrival_airport_code: string,
  departure_time: string,
  arrival_time: string,
  duration_minutes: number,
  airplane_id: {
    _id: string,
    airline_name: string,
  },
  ticket_price: number,
}

export type Flight = {
  path: [
    FlightItem
  ],
  totalStops: number,
  totalPrice: number,
  totalTime: string,
  airline: string,
}
