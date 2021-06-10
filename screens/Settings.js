import React, { useEffect, useState } from "react"
import { Dimensions } from "react-native"
import { View, StyleSheet, Text, TextInput } from "react-native"
import { Dialog } from "react-native-simple-dialogs" //npm i -S react-native-simple-dialogs

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import firebase from "firebase"
import ColorButton from "../presentational/ColorButton"

const Settings = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [changePasswordVisible, setChangePasswordVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [editDetails, setEditDetails] = useState({
    email: "",
    username: "",
    password: "",
    newPassword: "",
  })

  const checkEmail = (email) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
    return email !== null && reg.test(email)
  }

  const checkPassword = (password) => {
    return password != null && password.length > 7
  }

  const reauthenticate = (currentPassword) => {
    var user = Authentication.getCurrentUser();
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  const changePassword = (currentPassword, newPassword) => {
    reauthenticate(currentPassword).then(() => {
      var user = Authentication.getCurrentUser()
      if (!checkPassword(newPassword)) {
        return alert("Password has to be at least 8 characters long")
      }
      user.updatePassword(newPassword).then(() => {
        alert("Password successfully updated!");
      }).catch((error) => { console.log(error); });
    }).catch((error) => { alert("Incorrect password") });
  }

  const changeEmail = (currentPassword, newEmail, newUsername) => {
    reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser
      if (!checkEmail(newEmail)) {
        return alert("Invalid email address!")
      }
      user.updateEmail(newEmail).then(() => {
        Database.userDetails(user.uid).update({
          email: newEmail,
          username: newUsername
        })
        setEditDetails({
          ...editDetails,
          email: newEmail,
          username: newUsername 
        })
        setIsEditing(false)
        setDialogVisible(false)
        alert("Details updated successfully!")
      }).catch((error) => { console.log(error) })
    }).catch((error) => { alert("Incorrect Password!") })
  }


  useEffect(() => {
    Authentication.setOnAuthStateChanged((user) => {
      Database.userDetails(user.uid).on("value", (snapshot) => {
        setEmail(snapshot.val().email)
        setUsername(snapshot.val().username)
        setEditDetails({
          email: snapshot.val().email,
          username: snapshot.val().username
        })
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
            {isEditing
              ? <TextInput
                style={{ color: "#45EEE7", marginLeft: 10, fontSize: 18 }}
                value={editDetails.email}
                onChangeText={(email) => setEditDetails({
                  ...editDetails,
                  email: email
                })} />
              : <Text style={styles.text}>{editDetails.email}</Text>
            }
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.whiteText}>Username:</Text>
          </View>
          <View style={styles.textContainer}>
            {isEditing
              ? <TextInput
                style={{ color: "#45EEE7", marginLeft: 10, fontSize: 18 }}
                value={editDetails.username}
                onChangeText={(username) => setEditDetails({
                  ...editDetails,
                  username: username
                })} />
              : <Text style={styles.text}>{editDetails.username}</Text>
            }
          </View>
        </View>
      </View>
      <View style={{ flex: 1, alignItems: "center", marginBottom: "30%", marginTop: "-30%" }}>
        <View style={{ marginBottom: 20 }}>
          <Dialog
            visible={dialogVisible}
            title="Enter password to confirm changes:"
            titleStyle={{ fontWeight: "bold" }}
            dialogStyle={{ borderRadius: 15 }}
            contentStyle={{ height: 200 }}>
            <View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={{ color: "black", marginLeft: 10, fontSize: 18 }}
                  secureTextEntry
                  value={editDetails.password}
                  onChangeText={(password) => setEditDetails({
                    ...editDetails,
                    password: password
                  })} />
              </View>
              <View style={{ flexDirection: "row", marginTop: 25, alignSelf: "center" }}>
                <ColorButton
                  title="Cancel"
                  titleStyle={{ fontSize: 20 }}
                  containerStyle={{ marginRight: 30 }}
                  backgroundColor="red"
                  onPress={() => {
                    setDialogVisible(false)
                    setIsEditing(false)
                  }}
                  height={60}
                  width={120} />
                <ColorButton
                  title="Confirm"
                  titleStyle={{ fontSize: 20 }}
                  backgroundColor="green"
                  onPress={() => {
                    changeEmail(editDetails.password, editDetails.email, editDetails.username)
                  }}
                  height={60}
                  width={120} />
              </View>
            </View>
          </Dialog>
          <Dialog
            visible={changePasswordVisible}
            title="Enter current and new passwords:"
            titleStyle={{ fontWeight: "bold" }}
            dialogStyle={{ borderRadius: 15 }}
            contentStyle={{ height: 300 }}>
            <View>
              <View style={{ flexDirection: "row", marginBottom: 30, alignItems: "center" }}>
                <Text style={{ flex: 1, fontSize: 22, color: "black", fontWeight: "bold" }}>Current:</Text>
                <View style={[styles.passwordContainer, { flex: 2, width: 200 }]}>
                  <TextInput
                    style={{ color: "black", marginLeft: 10, fontSize: 18 }}
                    secureTextEntry
                    value={editDetails.password}
                    onChangeText={(password) => setEditDetails({
                      ...editDetails,
                      password: password
                    })} />
                </View>
              </View>
              <View style={{ flexDirection: "row", marginBottom: 30, alignItems: "center" }}>
                <Text style={{ flex: 1, fontSize: 22, color: "black", fontWeight: "bold" }}>New:</Text>
                <View style={[styles.passwordContainer, { flex: 2, width: 200 }]}>
                  <TextInput
                    style={{ color: "black", marginLeft: 10, fontSize: 18 }}
                    secureTextEntry
                    value={editDetails.newPassword}
                    onChangeText={(password) => setEditDetails({
                      ...editDetails,
                      newPassword: password
                    })} />
                </View>
              </View>
              <View style={{ flexDirection: "row", marginTop: 25, alignSelf: "center" }}>
                <ColorButton
                  title="Cancel"
                  titleStyle={{ fontSize: 20 }}
                  containerStyle={{ marginRight: 30 }}
                  backgroundColor="red"
                  onPress={() => setChangePasswordVisible(false)}
                  height={60}
                  width={120} />
                <ColorButton
                  title="Confirm"
                  titleStyle={{ fontSize: 20 }}
                  backgroundColor="green"
                  onPress={() => {
                    console.log(editDetails.password)
                    changePassword(editDetails.password, editDetails.newPassword)
                    setChangePasswordVisible(false)
                  }}
                  height={60}
                  width={120} />
              </View>
            </View>
          </Dialog>
          <ColorButton
            title={isEditing ? "Save" : "Edit Profile"}
            titleStyle={{ fontSize: 20 }}
            backgroundColor={isEditing ? "#5BBD4C" : "#ED802B"}
            loading={dialogVisible}
            onPress={() => { isEditing ? setDialogVisible(true) : setIsEditing(true) }}
            height={70}
            width={200} />
        </View>
        <ColorButton
          title={isEditing ? "Cancel" : "Change Password"}
          titleStyle={{ fontSize: 20 }}
          backgroundColor={isEditing ? "#F7483D" : "#ED802B"}
          onPress={() => { isEditing ? setIsEditing(false) : setChangePasswordVisible(true) }}
          loading={changePasswordVisible}
          height={70}
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
  passwordContainer: {
    alignSelf: "center",
    justifyContent: "center",
    width: "95%",
    height: 55,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black"
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