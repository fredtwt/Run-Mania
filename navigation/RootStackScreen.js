import "react-native-gesture-handler"
import * as React from 'react'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"

import Login from "../screens/Login"
import Signup from "../screens/Signup"
import DrawerNavigator from "./DrawerNavigator"

const RootStackScreen = () => {

  const Stack = createStackNavigator()

  const screens = [
    { name: "Login", component: Login },
    { name: "Signup", component: Signup },
    { name: "Main", component: DrawerNavigator },
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