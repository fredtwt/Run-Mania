import * as React from "react";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { SafeAreaView, StyleSheet, View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import MapView from "react-native-maps";
import { AnimatedCircularProgress } from 'react-native-circular-progress'

const Running2 = ({ navigation }) => {
  const [progress, setProgress] = React.useState(30)
  const [duration, setDuration] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isPaused) {
        setDuration(duration => duration)
      } else {
        setDuration(duration => duration + 1)
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatDuration = (seconds) => seconds < 3600
    ? new Date(seconds * 1000).toISOString().substr(14, 5)
    : new Date(seconds * 1000).toISOString().substr(11, 8)

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map} />
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
              () => (
                <Text style={styles.progressText}>
                  {progress}%
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
            <Text style={styles.text}> Pace: </Text>
          </View>
        </View>
        <View style={styles.infocomponent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="road-variant" color="white" size={42} />
            <Text style={styles.text}> Distance: </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.greenbutton}
          onPress={() => { setIsPaused(!isPaused); console.log({ isPaused }); }}>
          <Text style={styles.buttontext}> {isPaused ? "Resume" : "Pause"} </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redbutton}
          onPress={() => Alert.alert("End your run?", "",
            [{ text: "No", onPress: () => console.log('resume run'), style: "destructive" },
            { text: "Yes", onPress: () => navigation.navigate("Running3") }])}>
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