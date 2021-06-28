import "react-native-gesture-handler"
import * as React from 'react'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"

import Login from "../screens/Login"
import Signup from "../screens/Signup"
import DrawerNavigator from "./DrawerNavigator"
import PasswordReset from "../screens/PasswordReset"
import Battle from "../screens/Battle"
import Result from "../screens/Result"
import Running2 from "../screens/Running2"
import Running3 from "../screens/Running3"

const RootStackScreen = () => {

  const Stack = createStackNavigator()

  const screens = [
    { name: "Login", component: Login },
    { name: "Signup", component: Signup },
    { name: "Main", component: DrawerNavigator },
    { name: "Reset", component: PasswordReset },
		{ name: "Battle", component: Battle },
		{ name: "Result", component: Result }, 
		{ name: "Running2", component: Running2 }, 
		{ name: "Running3", component: Running3 }, 
  ]

  return (
    <Stack.Navigator
      initialRouteName={screens[0].name}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS
      }}>
      {screens.map(({ name, component }) => <Stack.Screen key={name} name={name} component={component} />)}
    </Stack.Navigator>
  )
}

export default RootStackScreen