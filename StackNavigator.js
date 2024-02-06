import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Login from './screens/Login'
import Register from './screens/Register'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './screens/HomeScreen'
import ThreadScreen from "./screens/ThreadScreen"
import ActivityScreen from "./screens/ActivityScreen"
import ProfileScreen from "./screens/ProfileScreen"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarLabelStyle: { color: 'black' },
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ?
            (
              <Ionicons name="home" size={24} color="black" />
            ) :
            (
              <Ionicons name="home-outline" size={24} color="black" />
            )
        }} />

      <Tab.Screen
        name='Thread'
        component={ThreadScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarLabelStyle: { color: 'black' },
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ?
            (
              <Ionicons name="create" size={24} color="black" />
            ) :
            (
              <Ionicons name="create-outline" size={24} color="black" />
            )
        }} />
      <Tab.Screen
        name='Activity'
        component={ActivityScreen}
        options={{
          tabBarLabel: 'Activity',
          tabBarLabelStyle: { color: 'black' },
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ?
            (
              <AntDesign name="heart" size={24} color="black" />
            ) :
            (
              <AntDesign name="hearto" size={24} color="black" />
            )
        }} />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarLabelStyle: { color: 'black' },
          headerShown: false,
          tabBarIcon: ({ focused }) => focused ?
            (
              <Ionicons name="person" size={24} color="black" />
            ) :
            (
              <Ionicons name="person-outline" size={24} color="black" />
            )
        }} />

    </Tab.Navigator>

  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})