import React, { useState } from "react";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { Marker }  from "react-native-maps";
import * as Progress from "react-native-progress";
import { CommonActions } from "@react-navigation/native"

import BlueButton from "../presentational/BlueButton"

const Running3 = ({ route, navigation }) => {
  const [coveredDistance, setCoveredDistance] = useState(route.params.distance)
  const [duration, setDuration] = useState(route.params.duration)
  const [coordinates, setCoordinates] = useState(route.params.coordinates)
  const [origin, setOrigin] = useState(route.params.origin)
  const [avgPace, setAvgPace] = useState(route.params.avgPace)
  const [calories, setCalories] = useState(route.params.calories) // change 65 to weight from firebase

  const goHomeScreen = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{
        name: "Main"
      }]
    }))
  }

  const formatDuration = (seconds) => seconds < 3600
    ? new Date(seconds * 1000).toISOString().substr(14, 5)
    : new Date(seconds * 1000).toISOString().substr(11, 8)

  const formatDistance = (dist) => dist < 1000 
  ? dist + " m"
  : (dist/1000).toFixed(2) + " km"

  const formatPace = (pace) => Math.floor(pace) + ":" + ((pace - Math.floor(pace)) * 60).toFixed(0) + " min/km"


  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        style={styles.map} 
        provider="google"
        camera={{
          center: {
            latitude: origin.latitude,
            longitude: origin.longitude
          },
          pitch: 50,
          heading: 60,
          altitude: 0,
          zoom: 20,
        }}
        showsUserLocation={true}>
        <Marker coordinate={origin}/>
        <MapView.Polyline // for tracking the run
          coordinates={coordinates}
          strokeWidth={5}
          strokeColor="blue"
          />
      </MapView>
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
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{formatDuration(duration)}</Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <MaterialCommunityIcons name="lightning-bolt" color="white" size={34} />
          <Text style={styles.smallText}> Avg Pace: </Text>
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{formatPace(avgPace)}</Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <MaterialCommunityIcons name="road-variant" color="white" size={34} />
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}> Distance: </Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{formatDistance(coveredDistance)}</Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <MaterialCommunityIcons name="fire" color="white" size={34} />
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>Calories burned: </Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{calories.toFixed(0)}</Text>
          </View>
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
  labelsContainer: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'white',
    marginRight: -30,
    textAlign: 'center'
  },
});

export default Running3