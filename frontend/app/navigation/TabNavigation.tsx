import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import Explore from "../pages/Explore";
import { RootTabParamList } from '../types/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: "home",
            Explore: "compass",
            Profile: "person"
          };
          return (
            <Ionicons
              name={icons[route.name]}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};
