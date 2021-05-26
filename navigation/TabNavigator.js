import React, { useEffect } from "react"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { MaterialCommunityIcons } from "react-native-vector-icons"

import MainStackScreen from "./MainStackScreen"
import * as Authentication from "../api/auth"

import color from "../constants/color"


const HomeScreen = ({ navigation }) => {
  return (
    <MainStackScreen initialRouteName="Home" onPress={() => navigation.openDrawer()} />
  )
}

const EquipmentScreen = ({ navigation }) => {
  return (
    <MainStackScreen initialRouteName="Equipments" onPress={() => navigation.openDrawer()} />
  )
}

const RunScreen = ({ navigation }) => {
  return (
    <MainStackScreen initialRouteName="Running" onPress={() => navigation.openDrawer()} />
  )
}

const PvpScreen = ({ navigation }) => {
  return (
    <MainStackScreen initialRouteName="Pvp" onPress={() => navigation.openDrawer()} />
  )
}

const Tab = createMaterialBottomTabNavigator()

const TabNavigator = () => {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#fff"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Avatar',
          tabBarColor: color.homeAccent,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Equipment"
        component={EquipmentScreen}
        options={{
          tabBarLabel: 'Equips',
          tabBarColor: color.equipsAccent,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bag-personal" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Running"
        component={RunScreen}
        options={{
          tabBarLabel: 'RUN',
          tabBarColor: color.runAccent,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="run-fast" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Pvp"
        component={PvpScreen}
        options={{
          tabBarLabel: 'PvP',
          tabBarColor: color.pvpAccent,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="sword-cross" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

export default TabNavigator