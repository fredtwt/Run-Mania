import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text, ActivityIndicator } from "react-native"
import { Image } from "react-native-elements"

import colors from "../constants/color"
import * as Authentication from "../api/auth"
import * as Database from "../api/db"


const Home = () => {
  const [userStatsArr, setUserStatsArr] = useState([])
  const [username, setUsername] = useState()

  useEffect(() => {
    Authentication.setOnAuthStateChanged((user) => {
      Database.userDetails(user.uid).on("value", (snapshot) => {
        setUserStatsArr(snapshot.child("statistics").val())
        setUsername(snapshot.val().username)
      })
    }, (user) => {
      console.log("no user")
    })
  }, [])

  console.log(userStatsArr)

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/archer.png")}
          style={styles.image}
          PlaceholderContent={<ActivityIndicator />} />
        <View style={styles.charContainer}>
          <Text style={styles.text}>{username}</Text>
          <Text style={styles.level}>Level: {userStatsArr.level}</Text>
          <View style={styles.statsContainer}>
            <View style={{ flexDirection: "column", marginRight: 50}}>
              <Text style={styles.stats}>HP:
                <Text style={styles.value}> {userStatsArr.hp}</Text>
              </Text>
              <Text style={styles.stats}>ATK:
                <Text style={styles.value}> {userStatsArr.atk}</Text>
              </Text>
              <Text style={styles.stats}>DEF:
                <Text style={styles.value}> {userStatsArr.def}</Text>
              </Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.stats}>EVD:
                <Text style={styles.value}> {userStatsArr.evd}</Text>
              </Text>
              <Text style={styles.stats}>SPD:
                <Text style={styles.value}> {userStatsArr.spd}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center"
  },
  imageContainer: {
    flex: 2,
    marginTop: 30,
    alignItems: "center"
  },
  image: {
    alignItems: "center",
    width: 200,
    height: 200,
  },
  charContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 28,
  },
  level: {
    color: "#FFD012",
    fontStyle: "italic",
    fontWeight: "bold",
    fontSize: 24,
  },
  statsContainer: {
    flex: 2,
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-start",
  },
  stats: {
    color: "#F7E188",
    fontSize: 20,
    fontWeight: "bold",
    paddingRight: 10
  },
  value: {
    color: "#F7E188",
    fontSize: 20,
    paddingRight: 10
  }
})

export default Home