import React from 'react';
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screen/auth/Login';
import RegisterScreen from './src/screen/auth/Register';
import DetailScreen from './src/screen/detail/DetailScreen';
import HomeScreen from './src/screen/home/Home';
import AccountScreen from './src/screen/account/Account';
import AddAddressScreen from './src/screen/address/AddAddressScreen';
import AddressScreen from './src/screen/address/AddressScreen';
import CartScreen from './src/screen/cart/Cart';
import DetectScreen from './src/screen/scanFlower/DetectScreen';
import Confirm from './src/screen/confirm/ConfirmScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function AppTabNavigator() {

  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Trang chủ') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Tài khoản') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'Giỏ hàng') {
              iconName = focused ? 'cart' : 'cart-outline'
            } else if (route.name === 'Tìm hoa') {
              iconName = focused ? 'camera' : 'camera-outline'
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}>
        <Tab.Screen
          name='Trang chủ'
          component={HomeScreen}
        />
        <Tab.Screen
          name="Giỏ hàng"
          component={CartScreen}
        />
        <Tab.Screen
          name="Tìm hoa"
          component={DetectScreen}
        />
        <Tab.Screen
          name="Tài khoản"
          component={AccountScreen}
        />
      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Main' component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name='Detail' component={DetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Address' component={AddAddressScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Add' component={AddressScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Confirm' component={Confirm} options={{ headerShown: false }} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}
