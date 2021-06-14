import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Progress from "react-native-progress";
import { CommonActions } from "@react-navigation/native"

import BlueButton from "../presentational/BlueButton"

const deviceHeight = Dimensions.get("window").height

const Running3 = ({ route, navigation }) => {
  const [coveredDistance, setCoveredDistance] = useState(route.params.distance)
  const [duration, setDuration] = useState(route.params.duration)
  const [coordinates, setCoordinates] = useState(route.params.coordinates)
  const [origin, setOrigin] = useState(route.params.origin)
  const [avgPace, setAvgPace] = useState(route.params.avgPace)
  const [calories, setCalories] = useState(route.params.calories)
  const [levelExp, setLevelExp] = useState(route.params.levelExp)
  const [currentExp, setCurrentExp] = useState(route.params.currentExp)

  const zoom = () => {
    if (coveredDistance < 2) {
      return 17.5
    } else if (coveredDistance < 5) {
      return 16
    } else if (coveredDistance < 10) {
      return 15
    } else {
      return 14
    }
  } 
      
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
    : (dist / 1000).toFixed(2) + " km"

  const formatPace = (pace) => {
    if (pace == 0) {
      return "0:00 min/km"
    }
    const mins = Math.floor(pace)
    const secs = ((pace - Math.floor(pace)) * 60).toFixed(0)
    return mins + ":" + (secs < 10 ? "0" + secs : secs) + " min/km"
  }

  const getRegionForCoordinates = (points) => {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY
    };
  }

  const expPercentage = currentExp / levelExp
  const expLeft = levelExp - currentExp
  const finalRegion = getRegionForCoordinates(coordinates)

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        camera={{
          center: {
            latitude: finalRegion.latitude,
            longitude: finalRegion.longitude
          },
          pitch: 20,
          heading: 60,
          altitude: 0,
          zoom: zoom() 
        }}
        showsUserLocation={true}>
        <Marker coordinate={origin} />
        <MapView.Polyline // for tracking the run
          coordinates={coordinates}
          strokeWidth={5}
          strokeColor="blue"
        />
      </MapView>
      <View style={styles.runStats}>
        <View style={{alignItems: "center", marginTop: 5, marginBottom: 10}}>
          <Text style={styles.bigText}> Run completed!</Text>
          <Text style={[styles.smallText, { fontSize: deviceHeight >= 770 ? 20 : 18}]}> {expLeft} km more to level up</Text>
          <Progress.Bar
            progress={expPercentage}
            style={{ marginTop: 5 }}
            height={10}
            width={250}
            color="#AEF94E"
            borderWidth={1}
            borderColor="#fff"
          />
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="timer" color="white" size={30} />
            <Text style={styles.smallText}> Time:</Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{formatDuration(duration)}</Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="lightning-bolt" color="white" size={30} />
            <Text style={styles.smallText}> Avg Pace:</Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{formatPace(avgPace)}</Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="road-variant" color="white" size={30} />
            <Text style={styles.smallText}> Distance:</Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{formatDistance(coveredDistance)}</Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="fire" color="white" size={30} />
            <Text style={styles.smallText}> Calories:</Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.smallText}>{calories.toFixed(0)} kcal</Text>
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
    alignItems: "center"
  },
  bigText: {
    color: '#AEF94E',
    fontWeight: "bold",
    fontSize: deviceHeight >= 770 ? 40 : 35,
    textAlign: 'center'
  },
  smallText: {
    color: 'white',
    fontWeight: "bold",
    fontSize: deviceHeight >= 770 ? 24 : 20,
    textAlign: 'left',
    paddingBottom: 5
  },
  infocomponent: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 5
  },
  labelsContainer: {
    flex: 2,
    alignItems: 'center',
  },
  iconContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: "15%"
  }
});

export default Running3