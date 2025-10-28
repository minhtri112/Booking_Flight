import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Tab: undefined;
  TravellerInformation: undefined;
  BaggageInformation: undefined;
  Seat: undefined;
  SeatSelection: undefined;
  Payment: undefined;
  BookingSuccess: undefined;
  BookingDetail: undefined;
};


export type RootTabParamList = {
  Home: undefined;
  Explore: undefined;
  Profile: undefined;
};

export type TypeNavigationProp = StackNavigationProp<RootStackParamList, "Tab">;
