import "react-native-gesture-handler"
import React, { useEffect, useState, useMemo } from 'react'
import * as firebase from "firebase"
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from "@react-navigation/native"
import ApiKeys from "./constants/ApiKeys"
import RootStackScreen from "./navigation/RootStackScreen"
import Home from "./screens/Home"

export default function App() {

  if (!firebase.apps.length) {
    firebase.initializeApp(ApiKeys.firebaseConfig)
  }

  return (
      <NavigationContainer>
        <RootStackScreen />
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
  loading: {
    flex: 1,
    justifyContent: "center",
    color: "white",
    alignItems: "center",
    backgroundColor: "#2E2E2E"
  }
});
