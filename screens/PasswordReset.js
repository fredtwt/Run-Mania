import React, { useState } from "react"
import { StyleSheet, View, Text, StatusBar } from "react-native"
import { CommonActions } from "@react-navigation/routers"

import InputBox from "../presentational/InputBox"
import BlueButton from "../presentational/BlueButton"

import * as Authentication from "../api/auth"

const PasswordReset = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [isResetLoading, setIsResetLoading] = useState(false)

  const handleReset = () => {
    setIsResetLoading(true)
    Authentication.resetPassword({ email },
      () => {
        alert("Email has been sent successfully. Please check your email to reset your password!")
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{
            name: "Login",
          }]
        }))
      },
      (error) => {
        setIsResetLoading(false)
        alert(error)
        //alert("Invalid/unregistered email addresss!")
      })
  }

  const checkEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    return email !== null && reg.test(email)
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E2E2E" barStyle="light-content" />
      <View style={styles.textContainer}>
        <Text style={styles.text_header}>Reset</Text>
        <Text style={styles.text_header}>Password</Text>
      </View>
      <View style={{ flex: 3, margin: 10, alignItems: "center", marginTop: 80 }}>
        <InputBox
          placeholder="Enter registered email"
          label="Email:"
          leftIcon="email"
          value={email}
          onChangeText={(val) => setEmail(val)}
          rightIcon={email != "" ? checkEmail() ? "check-circle" : "close-circle" : ""}
          rightIconColor={email != "" ? checkEmail() ? "#0BF73D" : "#FF4747" : "#FFF"}
          errorMessage={email != "" ? checkEmail() ? "" : "Invalid Email Address!" : ""} />
        <BlueButton
          title="Send email"
          loading={isResetLoading}
          disabled={isResetLoading}
          onPress={handleReset} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#2E2E2E"
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 10
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 45,
    alignSelf: "center"
  },
})

export default PasswordReset