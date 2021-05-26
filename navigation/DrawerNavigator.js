import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { CommonActions } from "@react-navigation/routers"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { Avatar } from "react-native-elements"
import { Title, Caption, Paragraph, Drawer } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import TabNavigator from "./TabNavigator"
import MainStackScreen from "./MainStackScreen"
import * as Database from "../api/db"
import * as Authentication from "../api/auth"

const RunningLogsScreen = ({ navigation }) => {
  return (
    <MainStackScreen initialRouteName="RunningLogs" onPress={() => navigation.openDrawer()} />
  )
}

const SettingsScreen = ({ navigation }) => {
  return (
    <MainStackScreen initialRouteName="Settings" onPress={() => navigation.openDrawer()} />
  )
}

const DrawerContent = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View style={{ marginRight: 15 }}>
                <Avatar activeOpacity={0.2} size="large" containerStyle={{ backgroundColor: "#fff" }} source={require("../assets/archer.png")} rounded />
              </View>
              <View style={{ marginleft: 20, flexDirection: "column" }}>
                <Title style={styles.title}>{props.username}</Title>
                <Caption style={styles.caption}>Level {props.level}</Caption>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>100</Paragraph>
                <Caption style={styles.caption}>Runs</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>{props.statsExp}km</Paragraph>
                <Caption style={styles.caption}>to level up</Caption>
              </View>
            </View>
          </View>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="home-outline"
                color={color}
                size={size}
              />
            )}
            label="Home"
            onPress={() => {
              props.navigation.navigate("Main")
            }} />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="history"
                color={color}
                size={size}
              />
            )}
            label="Running Logs"
            onPress={() => { props.navigation.navigate("RunningLogs") }}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="account-settings-outline"
                color={color}
                size={size}
              />
            )}
            label="Settings"
            onPress={() => { props.navigation.navigate("Settings") }}
          />
        </Drawer.Section>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon
              name="exit-to-app"
              color={color}
              size={size}
            />
          )}
          label="Logout"
          onPress={props.onPress}
        />
      </Drawer.Section>
    </View>
  )
}

const DrawerNav = createDrawerNavigator()

const DrawerNavigator = ({ route, navigation }) => {
  const [username, setUsername] = useState("")
  const [level, setLevel] = useState("")
  const [statsExp, setStatsExp] = useState("")

  const { user } = route.params
  const userDetails = Database.userDetails(user.uid)

  useEffect(() => {
    userDetails.on("value", (snapshot) => {
      const username = snapshot.child("username").val()
      const level = snapshot.child("statistics").child("level").val()
      const statsExp = snapshot.child("statistics").child("exp").val()
      setUsername(username)
      setLevel(level)
      setStatsExp(statsExp)
    })
  }, [])

  const handleLogout = () => {
    Authentication.signOut(
      () => {
        navigation.dispatch(CommonActions.reset({
          index: 0,
          routes: [{
            name: "Login"
          }]
        }))
        return alert("You have successfully signed out!")
      },
      (error) => {
        return alert(error)
      }
    )
  }

  return (
    <DrawerNav.Navigator drawerContent={
      props => <DrawerContent {...props}
        onPress={handleLogout}
        username={username}
        level={level}
        statsExp={statsExp} />}>
      <DrawerNav.Screen name="Main" component={TabNavigator} />
      <DrawerNav.Screen name="RunningLogs" component={RunningLogsScreen} />
      <DrawerNav.Screen name="Settings" component={SettingsScreen} />
    </DrawerNav.Navigator>
  )
}

export default DrawerNavigator

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 16,
    lineHeight: 30,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  }
})