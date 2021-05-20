import "react-native-gesture-handler"
import * as React from 'react'
import * as firebase from "firebase"
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import ApiKeys from "./constants/ApiKeys"
import Login from "./container/Login"
import Signup from "./container/Signup"

export default function App() {
  // Initialize firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(ApiKeys.firebaseConfig)
  }

  const Stack = createStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Signup" component={Signup}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
