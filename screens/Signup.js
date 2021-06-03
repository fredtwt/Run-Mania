import React, { useState } from "react"
import { StyleSheet, ScrollView, KeyboardAvoidingView, View, Text, StatusBar, Keyboard } from "react-native"

import BlueButton from "../presentational/BlueButton"
import InputBox from "../presentational/InputBox"

import * as Authentication from "../api/auth"
import * as Database from "../api/db"
import { CommonActions } from "@react-navigation/routers"

const Signup = ({ navigation }) => {
  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmationPassword, setConfirmationPassword] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmationPasswordVisible, setIsConfirmationPasswordVisible] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)

  const handleRegister = () => {
    Keyboard.dismiss()
    setIsRegisterLoading(true)
    if (checkEmail() && checkPassword() && checkConfirmationPassword() && username != "") {
      Authentication.createAccount(
        { username, email, password },
        (user) => {
          navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [{
              name: "Login",
            }]
          }))
          Database.createUser({ id: user.uid, username, email }, () => { }, (error) => alert(error))
          return alert("Account has been created successfully!")
        },
        (error) => {
          setIsRegisterLoading(false)
          return alert(error)
        }
      )
    } else {
      setIsRegisterLoading(false)
      return alert("Unsuccessful in signing up!")
    }
  }

  const checkEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    return email !== null && reg.test(email)
  }

  const checkPassword = () => {
    return password != null && password.length > 7
  }

  const checkConfirmationPassword = () => {
    return password == confirmationPassword
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E2E2E" barStyle="light-content" />
      <View style={styles.headerContainer}>
        <Text style={styles.text_header}>Registration</Text>
      </View>
      <KeyboardAvoidingView style={styles.inputContainer}>
        <ScrollView>
          <InputBox
            placeholder="Enter email"
            label="Email:"
            leftIcon="email"
            value={email}
            onChangeText={(val) => setEmail(val)}
            rightIcon={email != "" ? checkEmail() ? "check-circle" : "close-circle" : ""}
            rightIconColor={email != "" ? checkEmail() ? "#0BF73D" : "#FF4747" : "#FFF"}
            errorMessage={email != "" ? checkEmail() ? "" : "Invalid Email Address!" : ""} />
          <InputBox
            placeholder="Enter username"
            label="Username:"
            leftIcon="account"
            value={username}
            onChangeText={(val) => setUserName(val)} />
          <InputBox
            placeholder="Enter password"
            label="Password:"
            leftIcon="lock"
            secureTextEntry={!isPasswordVisible}
            onPress={() => setIsPasswordVisible((state) => !state)}
            onChangeText={(val) => setPassword(val)}
            rightIcon={isPasswordVisible ? "eye-off" : "eye"}
            rightIconColor="grey"
            errorMessage={!checkPassword() && password != "" ? "Password has to be at least 8 characters long!" : ""}
          />
          <InputBox
            placeholder="Confirm password"
            label="Re-enter Password:"
            secureTextEntry={!isConfirmationPasswordVisible}
            onPress={() => setIsConfirmationPasswordVisible((state) => !state)}
            leftIcon="lock"
            value={confirmationPassword}
            onChangeText={(val) => setConfirmationPassword(val)}
            errorMessage={!checkConfirmationPassword() && confirmationPassword != "" ? "Passwords do not match!" : ""}
            rightIcon={isConfirmationPasswordVisible ? "eye-off" : "eye"}
            rightIconColor="grey" />
          <View style={styles.buttonContainer}>
            <BlueButton
              title="Create Account"
              type="solid"
              onPress={handleRegister}
              loading={isRegisterLoading}
              disabled={isRegisterLoading} />
            <BlueButton
              title="Have an account already?"
              type="outline"
              onPress={() => navigation.navigate("Login")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#2E2E2E"
  },
  headerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginLeft: 15
  },
  inputContainer: {
    flex: 10,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 50,
    width: "90%"
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 50
  },
})

export default Signup