import React, { useState } from "react"
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, View, Image, Text, StatusBar, Keyboard, TouchableOpacity } from "react-native"
import { CommonActions } from "@react-navigation/native"

import BlueButton from "../presentational/BlueButton"
import InputBox from "../presentational/InputBox"

import * as Authentication from "../api/auth"

const Login = ({ navigation }) => {
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  const handleLogin = () => {
    Keyboard.dismiss()
    setIsLoginLoading(true)

    Authentication.signIn(
      { email, password },
      (user) => navigation.dispatch(CommonActions.reset({
        index: 0,
        routes: [{
          name: "Main",
        }]
      })),
      (error) => {
        setIsLoginLoading(false)
        return alert(error)
      }
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E2E2E" barStyle="light-content" />
      <View style={styles.image}>
        <Image source={require("../assets/logo_enhanced.png")} />
      </View>
      <KeyboardAvoidingView style={styles.inputContainer}>
        <View style={styles.input}>
          <InputBox
            placeholder="Enter email"
            label="Email:"
            value={email}
            onChangeText={(val) => setEmail(val)}
            leftIcon="email" />
          <InputBox
            placeholder="Enter password"
            label="Password:"
            secureTextEntry={!isPasswordVisible}
            onPress={() => setIsPasswordVisible((state) => !state)}
            value={password}
            onChangeText={(val) => setPassword(val)}
            leftIcon="lock"
            rightIcon="eye-off"
            rightIconColor="grey" />
        </View>
        <View>
          <BlueButton
            title="Login"
            type="solid"
            disabled={!email && !password}
            loading={isLoginLoading}
            onPress={handleLogin} />
          <BlueButton
            title="Sign up"
            type="outline"
            onPress={() => navigation.navigate("Signup")} />
        </View>
        <View style={styles.signupContainer}>
          <TouchableOpacity style={styles.hyperlink} onPress={() => navigation.navigate("Reset")}>
            <Text style={{ color: "rgb(32, 137, 220)" }}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#2E2E2E"
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    color: "white",
    alignItems: "center",
    backgroundColor: "#2E2E2E"
  },
  hyperlink: {
    alignItems: "center"
  },
  inputContainer: {
    flex: 1,
    alignItems: "center"
  },
  input: {
    width: 300,
  },
  image: {
    flex: 0.5,
    marginTop: 50,
    marginBottom: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  signupContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginVertical: 16
  }
})

export default Login