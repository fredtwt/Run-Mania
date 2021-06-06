import React, { useEffect, useState } from "react"
import { Dimensions } from "react-native"
import { View, StyleSheet, Text } from "react-native"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import ColorButton from "../presentational/ColorButton"

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [userDetails, setUserDetails] = useState([])
  const email = Authentication.getCurrentUserEmail()

  const changePassword = (currentPassword, newPassword) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = Authentication.getCurrentUser;
      user.updatePassword(newPassword).then(() => {
        console.log("Password updated!");
      }).catch((error) => { console.log(error); });
    }).catch((error) => { console.log(error); });
  }

  const changeEmail = (currentPassword, newEmail) => {
    this.reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updateEmail(newEmail).then(() => {
        console.log("Email updated!");
      }).catch((error) => { console.log(error); });
    }).catch((error) => { console.log(error); });
  }

  useEffect(() => {
    Authentication.setOnAuthStateChanged((user) => {
      Database.userDetails(user.uid).on("value", (snapshot) => {
        setUserDetails(snapshot.val())
      })
    }, (user) => {
      console.log("no user")
    })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.infoContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.whiteText}>Email:</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{email}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.whiteText}>Username:</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}>{userDetails.username}</Text>
          </View>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center" }}>
        <ColorButton
          title={isEditing ? "Save" : "Edit"}
          backgroundColor="orange"
          height={60}
          width={200} />
        <ColorButton
          title="Change Password"
          backgroundColor="orange"
          height={60}
          width={200} />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: Dimensions.get("window").width,
    backgroundColor: "#2E2E2E",
    justifyContent: "center",
    alignItems: "center"
  },
  background: {
    flex: 3,
    marginTop: "20%",
    marginBottom: "40%",
    height: "50%",
    width: "95%",
    backgroundColor: "rgba(91, 91, 91, 0.7)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center"
  },
  labelContainer: {
    flex: 1
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  textContainer: {
    flex: 2,
    margin: 10,
    width: "60%",
    justifyContent: "center",
    height: 55,
    backgroundColor: "transparent",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 10
  },
  whiteText: {
    marginLeft: 10,
    alignSelf: "flex-end",
    fontSize: 22,
    color: "white",
    fontWeight: "bold"
  },
  text: {
    marginLeft: 10,
    color: "white",
    fontSize: 18
  }
})

export default Settings