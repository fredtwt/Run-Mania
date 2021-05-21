import React, { useState } from "react"
import { StyleSheet, ScrollView, KeyboardAvoidingView, View, Text, StatusBar } from "react-native"
import BlueButton from "../presentational/BlueButton"
import InputBox from "../presentational/InputBox"

const Signup = ({ navigation }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmation: "",
    secureTextEntry: true,
    emailErrorMessage: "",
    emailRightIcon: "",
    emailRightIconColor: "white",
    errorMessage: "",
    rightIcon: "eye-off",
    rightIconColor: "grey",
    confirmationRightIcon: "eye-off",
    confirmationRightIconColor: "grey",
    confirmationErrorMessage: ""
  })

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    })
  }

  const checkEmail = (val) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(val) === false) {
      setData({
        email: val,
        emailErrorMessage: "Invalid email address!",
        emailRightIcon: "close-circle",
        emailRightIconColor: "#FF4747"
      })
      return false
    } else {
      setData({
        email: val,
        emailErrorMessage: "",
        emailRightIcon: "check-circle",
        emailRightIconColor: "#0BF73D"
      })
      return true
    }
  }

  const checkInitialPassword = (val) => {
    if (val.length < 8) {
      setData({
        ...data,
        password: val,
        errorMessage: "Password has to be at least 8 characters long!",
        rightIcon: "close-circle",
        rightIconColor: "#FF4747"
      })
      return false
    } else {
      setData({
        ...data,
        password: val,
        errorMessage:"",
        rightIcon: "check-circle",
        rightIconColor: "#0BF73D"
      })
      return true
    }
  }

  const checkConfirmationPassword = (val) => {
    if (val == data.password) {
      setData({
        ...data,
        confirmation: val,
        confirmationErrorMessage: "",
        confirmationRightIcon: "check-circle",
        confirmationRightIconColor: "#0BF73D"
      })
      return true
    } else {
      setData({
        ...data,
        confirmation: val,
        confirmationErrorMessage: "Passwords do not match!",
        confirmationRightIcon: "close-circle",
        confirmationRightIconColor: "#FF4747"
      })
      return false
    }
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
            onChangeText={(val) => checkEmail(val)}
            rightIcon={data.emailRightIcon}
            rightIconColor={data.emailRightIconColor}
            errorMessage={data.emailErrorMessage} />
          <InputBox
            placeholder="Enter username"
            label="Username:"
            leftIcon="account" />
          <InputBox
            placeholder="Enter password"
            label="Password:"
            leftIcon="lock"
            secureTextEntry={data.secureTextEntry ? true : false}
            onPress={updateSecureTextEntry}
            onChangeText={(val) => checkInitialPassword(val)}
            rightIcon={data.rightIcon}
            rightIconColor={data.rightIconColor}
            errorMessage={data.errorMessage}
          />
          <InputBox
            placeholder="Confirm password"
            label="Re-enter Password:"
            secureTextEntry={data.secureTextEntry ? true : false}
            onPress={updateSecureTextEntry}
            leftIcon="lock"
            onChangeText={(val) => checkConfirmationPassword(val)}
            errorMessage={data.confirmationErrorMessage}
            rightIcon={data.confirmationRightIcon}
            rightIconColor={data.confirmationRightIconColor} />
          <View style={styles.buttonContainer}>
            <BlueButton
              title="Sign Up!"
              type="solid"
              onPress={{}} />
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