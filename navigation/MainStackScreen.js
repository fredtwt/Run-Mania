import "react-native-gesture-handler"
import * as React from 'react'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import "@react-navigation/drawer"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Home from "../screens/Home"
import Equipments from "../screens/Equipments"
import Running from "../screens/Running"
import Pvp from "../screens/Pvp"
import RunningLogs from "../screens/RunningLogs"
import Settings from "../screens/Settings"

import color from "../constants/color"

const MainStackScreen = (props) => {

  const DrawerIcon = (prop) => {
    return (
      <Icon.Button name="menu" size={25} backgroundColor={prop.backgroundColor} onPress={props.onPress} />
    )
  }

  const Stack = createStackNavigator()

  const screens = [
    {
      name: "Home",
      component: Home,
      options: { headerTitle: "Run Mania", headerStyle: { backgroundColor: color.homeAccent }, headerLeft: () => (<DrawerIcon backgroundColor={color.homeAccent} />) }
    },
    {
      name: "Equipments",
      component: Equipments,
      options: { headerTitle: "Equipments", headerStyle: { backgroundColor: color.equipsAccent }, headerLeft: () => (<DrawerIcon backgroundColor={color.equipsAccent} />) }
    },
    {
      name: "Running",
      component: Running,
      options: { headerTitle: "RUN", headerStyle: { backgroundColor: color.runAccent }, headerLeft: () => (<DrawerIcon backgroundColor={color.runAccent} />) }
    },
    {
      name: "Pvp",
      component: Pvp,
      options: { headerTitle: "PvP", headerStyle: { backgroundColor: color.pvpAccent }, headerLeft: () => (<DrawerIcon backgroundColor={color.pvpAccent} />) }
    },
    {
      name: "RunningLogs",
      component: RunningLogs,
      options: { headerTitle: "Running Logs", headerStyle: { backgroundColor: color.logsAccent }, headerLeft: () => (<DrawerIcon backgroundColor={color.logsAccent} />) }
    },
    {
      name: "Settings",
      component: Settings,
      options: { headerTitle: "Settings", headerStyle: { backgroundColor: color.settingsAccent }, headerLeft: () => (<DrawerIcon backgroundColor={color.settingsAccent} />) }
    },
  ]

  return (
    <Stack.Navigator
      initialRouteName={props.initialRouteName}
      screenOptions={{
        gestureEnabled: true,
        headerTintColor: "#fff",
        headerTitleStyle: {
          alignSelf: "center",
          fontWeight: "bold",
          fontSize: 25,
        },
        headerTitleAlign: "center",
        ...TransitionPresets.SlideFromRightIOS
      }}>
      {screens.map(({ name, component, options }) => <Stack.Screen
        key={name}
        name={name}
        component={component}
        options={options} />)}
    </Stack.Navigator>
  )
}

export default MainStackScreen