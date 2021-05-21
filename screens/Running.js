import * as React from "react";
//import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native"
import MapView from "react-native-maps";

const Running = () => {
  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map} />
      <View style={styles.runninginfo}></View>
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E2E2E",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  runninginfo: {
    flex: 2,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  }
});

export default Running