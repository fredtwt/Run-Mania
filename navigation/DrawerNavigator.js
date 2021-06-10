import React, { useEffect, useState } from "react"
import { View, StyleSheet, Alert } from "react-native"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { Avatar } from "react-native-elements"
import { Title, Caption, Paragraph, Drawer } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import TabNavigator from "./TabNavigator"
import MainStackScreen from "./MainStackScreen"
import Settings from "../screens/Settings"
import RunningLogs from "../screens/RunningLogs"
import Running2 from "../screens/Running2"
import Running3 from "../screens/Running3"
import Login from "../screens/Login"

import color from "../constants/color"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"

const SettingsScreen = ({ navigation }) => {
  return (
    <MainStackScreen name="Settings" component={Settings} headerTitle="Settings" backgroundColor={color.settingsAccent} onPress={() => navigation.openDrawer()} />
  )
}

const RunningLogsScreen = ({ navigation }) => {
  return (
    <MainStackScreen name="RunningLogs" component={RunningLogs} headerTitle="Running Logs" backgroundColor={color.logsAccent} onPress={() => navigation.openDrawer()} />
  )
}

const HomeScreen = () => {
  return (
    <TabNavigator initialRouteName="Home" />
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
            <View style={styles.column}>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>{props.numberOfRuns}</Paragraph>
                <Caption style={styles.caption}>runs in total</Caption>
              </View>
              <View style={styles.section}>
                <Paragraph style={[styles.paragraph, styles.caption]}>{props.statsExp}m</Paragraph>
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
            onPress={() => props.navigation.navigate("Main")} />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="account-group-outline"
                color={color}
                size={size}
              />
            )}
            label="Friends"
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="trophy-variant-outline"
                color={color}
                size={size}
              />
            )}
            label="Leaderboard"
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Icon
                name="history"
                color={color}
                size={size}
              />
            )}
            label="Running Logs"
            onPress={() => props.navigation.navigate("RunningLogs")}
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
            onPress={() => props.navigation.navigate("Settings")}
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

const DrawerNavigator = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [level, setLevel] = useState("")
  const [statsExp, setStatsExp] = useState("")
  const [numberOfRuns, setNumberOfRuns] = useState(0)

  useEffect(() => {
    Database.userDetails(Authentication.getCurrentUserId()).on("value", (snapshot) => {
      const username = snapshot.child("username").val()
      const level = snapshot.child("statistics").child("level").val()
      const statsExp = snapshot.child("statistics").child("exp").val()
      setUsername(username)
      setLevel(level)
      setStatsExp(statsExp)
      setNumberOfRuns(snapshot.child("runningLogs/numberOfRuns").val())
    })
  }, [])

  const handleLogout = () => {
    Authentication.signOut(
      () => {
        navigation.navigate("Login")
        return Alert.alert(null, "You have successfully signed out!")
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
        numberOfRuns={numberOfRuns}
        username={username}
        level={level}
        statsExp={(level * 2 * 1000) - statsExp} />}>
      <DrawerNav.Screen name="Main" component={HomeScreen} />
      <DrawerNav.Screen name="Running2" component={Running2} />
      <DrawerNav.Screen name="Running3" component={Running3} />
      <DrawerNav.Screen name="RunningLogs" component={RunningLogsScreen} />
      <DrawerNav.Screen name="Settings" component={SettingsScreen} />
      <DrawerNav.Screen name="Login" component={Login} />
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
  column: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "flex-start",
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