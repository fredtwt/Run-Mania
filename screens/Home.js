import React from "react"
import { StyleSheet } from "react-native"

const Home = () => {
  return(
    <View style={styles.container}>
      <Text>HOME PAGE</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E2E2E"
  }
})

export default Home