import * as React from "react";
import * as Location from "expo-location"
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { SafeAreaView, StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import MapView from "react-native-maps";
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { CommonActions } from "@react-navigation/native"
import { getDistance } from 'geolib';
import moment from "moment"//npm install moment --save

import * as Database from "../api/db"
import * as Authentication from "../api/auth"

const Running2 = ({ route, navigation }) => {
  const polylineCoordinates = route.params.polylineCoordinates
  const generatedDistance = route.params.distance
  const origin = route.params.origin

  const [progress, setProgress] = React.useState(0)
  const [duration, setDuration] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [weight, setWeight] = React.useState(0)
  const [date, setDate] = React.useState(new Date())
  const [coveredDistance, setCoveredDistance] = React.useState(0)
  const [routeCoordinates, setRouteCoordinates] = React.useState([{latitude: origin.latitude, longitude: origin.longitude}])
  const [pace, setPace] = React.useState(0)
  const [prevDistance, setPrevDistance] = React.useState(0)
  const [userLocation, setUserLocation] = React.useState({
    latitude: origin.latitude,
    longitude: origin.longitude,
    latitudeDelta: 0.004,
    longitudeDelta: 0.001,
    error: null
  })

  React.useEffect(() => {
    Location.installWebGeolocationPolyfill()
    const watchID = navigator.geolocation.watchPosition(pos => {
      if (!isPaused) {
        setCoveredDistance(coveredDistance + getDistance(routeCoordinates[routeCoordinates.length-1], pos.coords))
      }
      setUserLocation({
        ...userLocation,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      })
      setRouteCoordinates(oldstate => [...oldstate, 
       { latitude: pos.coords.latitude, longitude: pos.coords.longitude }])
    },
      error => {
        setUserLocation({
          ...userLocation,
          error: error.message
        })
      },
    )

    Authentication.setOnAuthStateChanged((user) => {
      Database.userDetails(user.uid).on("value", (snapshot) => {
        setWeight(snapshot.val().weight)
      })
    },
    (error) => {
      console.log(error)
    })

    const interval = setInterval(() => {
      if (isPaused) {
        setDuration(duration => duration)
      } else {
        const percentage = parseFloat((coveredDistance / (generatedDistance * 1000)).toFixed(2)) 
        setProgress(percentage)
        setDuration(duration => duration + 1)
      }
      if (duration % 10 == 5 && coveredDistance != 0) {
        //calc pace
        const difference = coveredDistance - prevDistance
        const currentPace = parseFloat(((1000 / 60) / (difference / 5)).toFixed(2))
        console.log(currentPace)
        setPace(currentPace)
        setPrevDistance(coveredDistance)
      } 
    }, 1000);
    return () => {clearInterval(interval); navigator.geolocation.clearWatch(watchID)};
  }, [isPaused, duration]);

  const endRun = () => {
    Database.addRun({
      userId: Authentication.getCurrentUserId(),
      time: formatDuration(duration),
      distance: coveredDistance,
      pace: formatPace(calcAvgPace(coveredDistance, duration)),
      calories: calcCalories(),
      date: moment(date).utcOffset("+08:00").format("DD-MM-YYYY hh:mm a") 
    }, 
    (run) => console.log("run successfully ended"),
    (error) => console.log(error))
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{
        name: "Running3",
        params: {
          duration: duration, 
          distance: coveredDistance,
          coordinates: routeCoordinates,
          origin: origin
        }
      }]
    }))
  }

  const calcCalories = () => {
    return 24.5 * weight / 200 * (duration / 60)
  }

  const calcAvgPace = (distance, duration) => {
    if (distance == 0) {
      return 0
    }
    return (1000 / 60) / (coveredDistance / duration)
  }

  const formatDuration = (seconds) => seconds < 3600
    ? new Date(seconds * 1000).toISOString().substr(14, 5)
    : new Date(seconds * 1000).toISOString().substr(11, 8)

  const formatDistance = (dist) => dist < 1000 
  ? dist + " m"
  : (dist/1000).toFixed(2) + " km"

  const formatPace = (pace) => {
    if (pace == 0) {
      return "00:00 min/km"
    }
    return Math.floor(pace) + ":" + ((pace - Math.floor(pace)) * 60).toFixed(0) + " min/km"
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        style={styles.map} 
        provider="google"
        camera={{
          center: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          },
          pitch: 50,
          heading: 60,
          altitude: 0,
          zoom: 20,
        }}
        showsUserLocation={true}
        >
        <MapView.Polyline
          coordinates={polylineCoordinates}
          strokeWidth={5}
          strokeColor="purple"
          />
         <MapView.Polyline // for tracking the run
          coordinates={routeCoordinates}
          strokeWidth={5}
          strokeColor="blue"
          />
      </MapView>
      <View style={styles.runninginfo}>
        <View style={{ flex: 2 }}>
          <AnimatedCircularProgress
            size={200}
            width={25}
            rotation={270}
            arcSweepAngle={180}
            fill={progress}
            tintColor="#00e0ff"
            backgroundColor="#3d5875">
            {
              (progress) => (
                <Text style={styles.progressText}>
                  {formatDistance(coveredDistance)}
                </Text>
              )
            }
          </AnimatedCircularProgress>
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="timer" color="white" size={42} />
            <Text style={styles.text}> Time:</Text>
          </View>
          <View style={styles.labelsContainer}>
            <Text style={styles.text}> {formatDuration(duration)} </Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="lightning-bolt" color="white" size={42} />
            <Text style={styles.text}> Pace:     </Text>
            <View style={styles.labelsContainer}>
              <Text style={styles.text}> {formatPace(pace)} </Text>
            </View> 
          </View>
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="road-variant" color="white" size={42} />
            <Text style={styles.text}> Distance: </Text>
            <View style={styles.labelsContainer}>
              <Text style={styles.text}> {formatDistance(coveredDistance)} </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.greenbutton}
          onPress={() => { setIsPaused(!isPaused) }}>
          <Text style={styles.buttontext}> {isPaused ? "Resume" : "Pause"} </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redbutton}
          onPress={() => {Alert.alert("End your run?", "",
            [{ text: "No", onPress: () => console.log('resume run'), style: "destructive" },
            { text: "Yes", onPress: () => endRun() }]), 
            navigator.geolocation.stopObserving()}} >
          <Text style={styles.buttontext}> End </Text>
        </TouchableOpacity>
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
    flex: 5,
    marginTop: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  runninginfo: {
    paddingTop: 10,
    flex: 4,
    flexDirection: "column",
    backgroundColor: "#2E2E2E",
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
  },
  infocomponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 0,
    borderColor: 'white',
    width: 300
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 5,
    borderWidth: 0,
    borderColor: 'white',
  },
  labelsContainer: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'white',
    marginRight: -30
  },
  progressText: {
    color: "#D8F3EE",
    fontWeight: "bold",
    fontSize: 40,
    paddingBottom: 30
  },
  text: {
    color: "white",
    fontSize: 30,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  redbutton: {
    flex: 1,
    padding: 10,
    borderColor: "#2E2E2E",
    backgroundColor: "red",
    borderRadius: 25,
    marginHorizontal: 4,
  },
  greenbutton: {
    flex: 1,
    padding: 10,
    borderColor: "#2E2E2E",
    backgroundColor: "green",
    borderRadius: 25,
    marginHorizontal: 4
  },
  buttontext: {
    color: "white",
    fontWeight: "bold",
    fontSize: 36,
    justifyContent: "center",
    textAlign: "center"
  },
});

export default Running2