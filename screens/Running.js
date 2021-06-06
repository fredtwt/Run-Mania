import * as React from "react";
import * as Location from "expo-location"
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions"
import Slider from '@react-native-community/slider';
import { CommonActions } from "@react-navigation/native"
import randomLocation from 'random-location';

import ColorButton from "../presentational/ColorButton"
import color from "../constants/color"
import apikey from "../constants/GoogleAPIKey"


const Running = ({ navigation }) => {
  const [origin, setOrigin] = React.useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.004,
    longitudeDelta: 0.001,
    error: null
  })
  const [distance, setDistance] = React.useState(1)
  const [generatedDistance, setGeneratedDistance] = React.useState(0)
  const [waypoints, setWaypoints] = React.useState([])
  const [isGeneratingRoute, setIsGeneratingRoute] = React.useState(false)
  const [isButtonEnabled, setIsButtonEnabled] = React.useState(false)
  const [isFirstLoad, setIsFirstLoad] = React.useState(true)
  const [resetLocationButton, setResetLocationButton] = React.useState(0)
  const [generatedCoordinates, setGeneratedCoordinates] = React.useState([])

  const minDistance = 1;
  const maxDistance = 20;

  const addWaypoint = (newWaypoint) => setWaypoints(state => [...state, newWaypoint]);

  const startRun = () => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{
        name: "Running2",
        params: {
          polylineCoordinates: generatedCoordinates,
          distance: generatedDistance,
          origin: origin
        }
      }]
    }))
  }

  const generateRoute = () => {
    setWaypoints([]);
    setIsFirstLoad(false)
    setIsGeneratingRoute(true)
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
      setIsButtonEnabled(true)
    },
      error => {
        setOrigin({
          ...origin,
          error: error.message
        })
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
    setTimeout(() => setResetLocationButton(1), 500)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={[styles.map, { marginTop: resetLocationButton }]}
        provider="google"
        showsUserLocation={true}
        // region={origin}
        camera={{
          center: {
            latitude: origin.latitude,
            longitude: origin.longitude
          },
          pitch: 20,
          heading: 0,
          altitude: 0,
          zoom: 18,
        }}>
        <Marker
          coordinate={origin}
          draggable
          onDragEnd={result => {
            setOrigin({
              latitude: result.nativeEvent.coordinate.latitude,
              longitude: result.nativeEvent.coordinate.longitude
            })
          }} />
        {isFirstLoad
          ? null
          : <MapViewDirections
            origin={origin}
            destination={origin}
            apikey={apikey}
            waypoints={waypoints}
            mode="WALKING"
            strokeWidth={5}
            strokeColor="purple"
            onReady={result => {
              if (result.distance >= (distance - 0.25) && result.distance <= (distance + 0.25)) {
                setIsGeneratingRoute(false)
                setGeneratedDistance(result.distance)
                setGeneratedCoordinates(result.coordinates)
                console.log("final distance: " + result.distance)
              } else {
                generateRoute();
              }
            }} />
        }
      </MapView>
      <View style={styles.sliderContainer}>
        <View style={{ marginTop: "2%", justifyContent: "space-between", height: "35%" }}>
          <View>
            <Text style={styles.dynamicText}>
              {distance + "km"}
            </Text>
          </View>
          <Slider
            minimumValue={minDistance}
            maximumValue={maxDistance}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            step={0.5}
            onValueChange={val => { setDistance(val) }}
            thumbTintColor="#AB98DF"
            maximumTrackTintColor='#d3d3d3'
            minimumTrackTintColor='#9B83DB'
          />
          <View style={styles.textCon}>
            <Text style={styles.whitetext}> {minDistance} km</Text>
            <Text style={styles.whitetext}> {maxDistance} km</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <ColorButton
            title="Generate Route"
            type="solid"
            titleStyle={{
              color: "white"
            }}
            backgroundColor="#7F68A9"
            width={150}
            height={60}
            loading={isGeneratingRoute}
            disabled={isButtonEnabled ? isGeneratingRoute : true}
            onPress={generateRoute}
          />
          <ColorButton
            title="Start Run"
            type="solid"
            titleStyle={{
              color: "white"
            }}
            backgroundColor={color.startAccent}
            width={150}
            height={60}
            disabled={isButtonEnabled ? (isGeneratingRoute ? true : generatedDistance == 0) : true}
            onPress={startRun}
          />
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
    marginTop: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    marginTop: "5%",
    justifyContent: "space-evenly"
  },
  sliderContainer: {
    flex: 1,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: "-5%",
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    width: Dimensions.get('window').width,
    height: "35%",
    borderRadius: 30,
  },
  whitetext: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  textCon: {
    width: 320,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dynamicText: {
    textAlign: 'center',
    color: "white",
    fontWeight: "bold",
    fontSize: 35,
  }
});

export default Running