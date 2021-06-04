import * as React from "react";
import * as Location from "expo-location"
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions"
import Slider from '@react-native-community/slider';
import { CommonActions } from "@react-navigation/native"
import randomLocation from 'random-location';

import ColorButton from "../presentational/ColorButton"
import { State } from "react-native-gesture-handler";

const Running = ({ navigation }) => {
  const LATITUDE_DELTA = 0.004
  const LONGITUDE_DELTA = 0.001
  const [distance, setDistance] = React.useState(1)
  const [origin, setOrigin] = React.useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.004,
    longitudeDelta: 0.001,
    error: null
  })
  const [destination, setDestination] = React.useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.004,
    longitudeDelta: 0.001,
    error: null
  })
  const [waypoints, setWaypoints] = React.useState([]);
  const addWaypoint = (newWaypoint) => setWaypoints(state => [...state, newWaypoint]);
  const [distanceGenerated, setDistanceGenerated] = React.useState(0);

  const minDistance = 1;
  const maxDistance = 20;
  const textLeft = distance * 300 / 20 - 150

  const startRun = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{
        name: "Running2"
      }]
    }))
  }

  const generateRoute = () => {
    setWaypoints([]);
    // console.log("Distance (from for loop)" + distanceGenerated)
    // console.log(waypoints)
    for (let i = 0; i < 2; i++) {
      addWaypoint(randomLocation.randomCircumferencePoint(origin, distance * 1000 / 5));
    }
  }

  React.useEffect(() => {
    Location.installWebGeolocationPolyfill()
    navigator.geolocation.getCurrentPosition(pos => {
      setOrigin({
        ...origin,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      })
    },
      error => {
        setOrigin({
          ...origin,
          error: error.message
        })
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 }
    )
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        region={origin}>
        <Marker coordinate={origin} />
        <MapViewDirections
          origin={origin}
          destination={origin}
          apikey="AIzaSyAdDrHN0itDXhqn6d4iH4ahBh1quzPru6c"
          waypoints={waypoints}
          mode="WALKING"
          strokeWidth={3}
          strokeColor="purple" 
          onReady={result => {
            if (result.distance >= (distance - 0.25) && result.distance <= (distance + 0.25)) {
              setDistanceGenerated(result.distance)
              // console.log('Distance: ' + distanceGenerated + 'km')
            } else {
              generateRoute();
            }
          }}/>
      </MapView>
      <View style={styles.queryContainer}>
        <View style={styles.sliderContainer}>
          <Text style={[styles.dynamicText, { left: textLeft }]}>
            {distance + ' km'}
          </Text>
          <Slider
            style={{ width: 300, height: 40 }}
            minimumValue={minDistance}
            maximumValue={maxDistance}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            step={0.5}
            onValueChange={val => { setDistance(val) }}
            thumbTintColor='rgb(252, 228, 149)'
            maximumTrackTintColor='#d3d3d3'
            minimumTrackTintColor='rgb(252, 228, 149)'
          />
          <View style={styles.textCon}>
            <Text style={styles.greytext}> {minDistance} km</Text>
            <Text style={styles.greytext}> {maxDistance} km</Text>
          </View>
          <View style={{
            marginTop: 10
          }}>
            <ColorButton
              title="Generate Route"
              type="outline"
              borderColor="white"
              borderWidth={2}
              titleStyle={{
                color: "white"
              }}
              onPress={generateRoute}
            />
            <ColorButton
              title="Start Run"
              type="outline"
              borderColor="white"
              borderWidth={2}
              titleStyle={{
                color: "white"
              }}
              onPress={startRun}
            />
          </View>
        </View>
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
    flex: 3,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  queryContainer: {
    flex: 2,
    flexDirection: "column",
    width: 300,
    marginBottom: 30
  },
  sliderContainer: {
    flex: 1,
    alignItems: "center",
    marginVertical: 20,
  },
  greytext: {
    color: "#d3d3d3",
    fontWeight: "bold",
    fontSize: 16,
  },
  textCon: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dynamicText: {
    width: 120,
    textAlign: 'center',
    color: "rgb(252, 228, 149)",
    fontWeight: "bold",
    fontSize: 28,
  }
});

export default Running