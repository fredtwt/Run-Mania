import React from "react"
import { View, StyleSheet, TouchableOpacity, Text } from "react-native"

const Settings = () => {

  return(
    <View style={styles.container}>
      <Text>SETTINGS PAGE</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E2E2E",
    justifyContent: "center",
    alignItems: "center"
  }
})

export default Settings 