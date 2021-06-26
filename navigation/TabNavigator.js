import React from "react"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { MaterialCommunityIcons } from "react-native-vector-icons"

import MainStackScreen from "./MainStackScreen"
import Home from "../screens/Home"
import Stats from "../screens/Stats"
import Running from "../screens/Running"
import Pvp from "../screens/Pvp"

import color from "../constants/color"


const HomeScreen = ({ navigation }) => {
  return (
    <MainStackScreen name="Home" component={Home} headerTitle="Home" backgroundColor={color.homeAccent} onPress={() => navigation.openDrawer()} />
  )
}

const StatsScreen = ({ navigation }) => {
  return (
    <MainStackScreen name="Stats" component={Stats} headerTitle="Stats" backgroundColor={color.equipsAccent} onPress={() => navigation.openDrawer()} />
  )
}

const RunningScreen = ({ navigation }) => {
  return (
    <MainStackScreen name="Running" component={Running} headerTitle="RUN" backgroundColor={color.runAccent} onPress={() => navigation.openDrawer()} />
  )
}

const PvpScreen = ({ navigation }) => {
  return (
    <MainStackScreen name="Pvp" component={Pvp} headerTitle="PVP" backgroundColor={color.pvpAccent} onPress={() => navigation.openDrawer()} />
  )
}

const Tab = createMaterialBottomTabNavigator()

const TabNavigator = (props) => {

  return (
    <Tab.Navigator
      initialRouteName={props.initialRouteName}
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
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarColor: color.equipsAccent,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Running"
        component={RunningScreen}
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
          tabBarLabel: 'PVP',
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