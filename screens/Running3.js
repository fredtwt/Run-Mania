import * as React from "react";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import MapView from "react-native-maps";
import * as Progress from "react-native-progress";
import { CommonActions } from "@react-navigation/native"

import BlueButton from "../presentational/BlueButton"

const Running3 = ({ navigation }) => {
  const finishRun = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{
        name: "Running"
      }]
    }))
  }

  const goHomeScreen = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{
        name: "Main"
      }]
    }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map} provider="google"></MapView>
      <View style={styles.runStats}>
        <Text style={styles.bigText}> Good Job!!</Text>
        <Text style={styles.smallText}> XX km more to level up</Text>
        <Progress.Bar
          progress={0.6}
          height={10}
          width={250}
          color="#AEF94E"
          borderWidth={1}
          borderColor="#fff"
        />
        <View style={styles.infocomponent}>
          <MaterialCommunityIcons name="timer" color="white" size={34} />
          <Text style={styles.smallText}> Time: </Text>
        </View>
        <View style={styles.infocomponent}>
          <MaterialCommunityIcons name="lightning-bolt" color="white" size={34} />
          <Text style={styles.smallText}> Avg Pace: </Text>
        </View>
        <View style={styles.infocomponent}>
          <MaterialCommunityIcons name="road-variant" color="white" size={34} />
          <Text style={styles.smallText}> Distance: </Text>
        </View>
        <View style={styles.infocomponent}>
          <MaterialCommunityIcons name="fire" color="white" size={34} />
          <Text style={styles.smallText}>Calories burned: </Text>
        </View>
        <BlueButton
          title="Close"
          type="solid"
          onPress={goHomeScreen}
        />
      </View>
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
    flex: 4,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  runStats: {
    flex: 5,
    flexDirection: 'column',
  },
  bigText: {
    color: '#AEF94E',
    fontWeight: "bold",
    fontSize: 50,
    textAlign: 'center'
  },
  smallText: {
    color: 'white',
    fontWeight: "bold",
    fontSize: 24,
    textAlign: 'left',
    paddingBottom: 5 
  },
  infocomponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 4
  },
});

export default Running3