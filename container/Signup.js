import React, { useState } from "react"
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, View, Image, Text, StatusBar } from "react-native"
import BlueButton from "../presentational/BlueButton"
import InputBox from "../presentational/InputBox"

const Signup = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    secureTextEntry: true
  })

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E2E2E" barStyle="light-content" />
      <KeyboardAvoidingView style={styles.inputContainer}>
        <View style={styles.input}>
          <InputBox
            placeholder="Enter Email"
            label="Email:"
            leftIcon="account" />
          <InputBox
            placeholder="Enter password"
            label="Password:"
            secureTextEntry={data.secureTextEntry ? true : false}
            onPress={updateSecureTextEntry}
            leftIcon="lock"
            rightIcon="eye-off" />
        </View>
        <View>
          <BlueButton
            title="Sign Up!"
            type="solid"
            onPress={{}} />
          <BlueButton
            title="Have an account already?"
            type="outline"
            onPress={{}} />
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

export default Signup 