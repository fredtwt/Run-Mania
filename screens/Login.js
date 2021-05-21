import React, { useContext, useState } from "react"
import { StyleSheet, SafeAreaView, KeyboardAvoidingView, View, Image, Text, StatusBar } from "react-native"
import BlueButton from "../presentational/BlueButton"
import InputBox from "../presentational/InputBox"

const Login = ({ navigation }) => {
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
      <View style={styles.image}>
        <Image source={require("../assets/logo_enhanced.png")} />
      </View>
      <KeyboardAvoidingView style={styles.inputContainer}>
        <View style={styles.input}>
          <InputBox
            placeholder="Enter email"
            label="Email:"
            leftIcon="email" />
          <InputBox
            placeholder="Enter password"
            label="Password:"
            secureTextEntry={data.secureTextEntry ? true : false}
            onPress={updateSecureTextEntry}
            leftIcon="lock"
            rightIcon="eye-off"
            rightIconColor="grey" />
        </View>
        <View>
          <BlueButton
            title="Login"
            type="solid"
            onPress={{}} />
          <BlueButton
            title="Sign up"
            type="outline"
            onPress={() => navigation.navigate("Signup")} />
        </View>
        <View style={styles.signupContainer}>
          <Text style={{ color: "rgb(32, 137, 220)" }}>Forgot your password?</Text>
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

export default Login