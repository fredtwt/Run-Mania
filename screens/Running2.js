import * as React from "react";
import * as Location from "expo-location"
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { AppState, SafeAreaView, StyleSheet, View, Text, Dimensions, Platform, Alert } from "react-native";
import MapView from "react-native-maps";
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { CommonActions } from "@react-navigation/native"
import { getDistance } from 'geolib';
import moment from "moment"
import Spinner from "react-native-loading-spinner-overlay"
import { differenceInSeconds } from "date-fns"
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as TaskManager from 'expo-task-manager';

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import ColorButton from "../presentational/ColorButton"

const Running2 = ({ route, navigation }) => {
	const polylineCoordinates = route.params.polylineCoordinates
	const generatedDistance = route.params.distance
	const origin = route.params.origin

	const [loading, setLoading] = React.useState(true)
	const [map, setMap] = React.useState(null)
	const [weight, setWeight] = React.useState(0)
	const [progress, setProgress] = React.useState(0)
	const [duration, setDuration] = React.useState(0)
	const [isPaused, setIsPaused] = React.useState(false)
	const [date, setDate] = React.useState(new Date())
	const [coveredDistance, setCoveredDistance] = React.useState(0)
	const [routeCoordinates, setRouteCoordinates] = React.useState([{ latitude: origin.latitude, longitude: origin.longitude }])
	const [pace, setPace] = React.useState(0)
	const [prevDistance, setPrevDistance] = React.useState(0)
	const [userLocation, setUserLocation] = React.useState({
		latitude: origin.latitude,
		longitude: origin.longitude,
		latitudeDelta: 0.004,
		longitudeDelta: 0.001,
		error: null
	})
	const [watcher, setWatcher] = React.useState(null);
	const appState = React.useRef(AppState.currentState);
	
	const LOCATION_TRACKING = 'location-tracking';
	const startLocationTracking = async () => {
		await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
			accuracy: Location.Accuracy.Highest,
			distanceInterval: 0,
		});
		const hasStarted = await Location.hasStartedLocationUpdatesAsync(
			LOCATION_TRACKING
		);
		console.log('tracking: ', hasStarted);
	};

	const stopLocationTracking = async () => {
		await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
		console.log('tracking: ', hasStarted);
	}

	React.useEffect(() => { // app state
		AppState.addEventListener("change", _handleAppStateChange);
		return () => {
			AppState.removeEventListener("change", _handleAppStateChange);
		};
	}, []);

	React.useEffect(() => {
		console.log("mounted")
		let mounted = true

		if (isPaused) {
			return;
		}

		(() => {
			Location.watchPositionAsync({
				accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1
			}, (pos) => {
				if (mounted) {
					setRouteCoordinates(prev => {
						setCoveredDistance((prevDist) => {
							if (prev.length == 0) { return 0 }
							if (isPaused) { return prevDist }
							const lastCoord = prev[prev.length - 1];
							return (prevDist + getDistance(lastCoord,
								{ latitude: pos.coords.latitude, longitude: pos.coords.longitude }) / 2)
						})
						return [...prev, { latitude: pos.coords.latitude, longitude: pos.coords.longitude }]
					})

					setUserLocation({
						...userLocation,
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
					})
				}

				const animateCamera = () => {
					map.animateCamera({
						center: {
							latitude: pos.coords.latitude,
							longitude: pos.coords.longitude
						},
						pitch: 45,
						heading: 0,
						altitude: 0,
						zoom: 20
					}, { duration: 750 })
				}

				if (map != null) {
					animateCamera()
				}

			},
				error => {
					setUserLocation({
						...userLocation,
						error: error.message
					})
				}).then((locationWatcher) => {
					if (mounted) {
						setWatcher(locationWatcher);
					}
				}).catch((err) => {
					console.log(err)
				})
		})()

		return () => {
			console.log("unmounted")
		}
	}, [isPaused]);

	React.useEffect(() => { // timer, pace
		let mounted = true
		const interval = setInterval(() => {
			if (isPaused) {
				setDuration(duration => duration)
			} else {
				const percentage = parseFloat((coveredDistance / (generatedDistance * 10)).toFixed(2))
				setProgress(percentage)
				setDuration(duration => duration + 1)
			}
			if (duration % 5 == 0 && coveredDistance != 0) {
				//calc pace
				const difference = coveredDistance - prevDistance
				const currentPace = difference == 0 ? 0 : parseFloat(((1000 / 60) / (difference / 5)).toFixed(2))
				console.log(difference, currentPace)
				setPace(currentPace)
				setPrevDistance(coveredDistance)
			}
		}, 1000)

		Authentication.setOnAuthStateChanged((user) => {
			Database.userDetails(user.uid).on("value", (snapshot) => {
				if (mounted) {
					setWeight(snapshot.val().weight)
				}
			})
		},
			(error) => {
				console.log(error)
			})

		setLoading(false)
		return () => {
			mounted = false
			clearInterval(interval)
		}
	}, [isPaused, duration]);

	const calcCalories = () => {
		return Math.round(24.5 * weight / 200 * (duration / 60))
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
		: (dist / 1000).toFixed(2) + " km"

	const formatPace = (pace) => {
		if (pace == 0) {
			return "0:00"
		}
		const mins = Math.floor(pace)
		const secs = ((pace - Math.floor(pace)) * 60).toFixed(0)
		return mins + ":" + (secs < 10 ? "0" + secs : secs)
	}

	const getElapsedTime = async () => {
		try {
			const startTime = await AsyncStorage.getItem("@start_time")
			const now = new Date();
			const diff = differenceInSeconds(now, Date.parse(startTime));
			// setElapsed(diff)
			return diff
		} catch (err) {
			console.warn(err);
		}
	};

	const recordStartTime = async () => {
		try {
			const now = new Date();
			await AsyncStorage.setItem("@start_time", now.toISOString());
		} catch (err) {
			console.warn(err);
		}
	};

	const _handleAppStateChange = async (nextAppState) => {
		if (Platform.OS == 'ios') {
			if (appState.current.match(/background/) && nextAppState === "active") {
				const elapsed = await getElapsedTime();
				setDuration(duration => duration + elapsed)
				stopLocationTracking()
				console.log("ios inactive/background -> active")
			}
		} else {
			if (appState.current.match(/inactive|background/) && nextAppState === "active") {
				const elapsed = await getElapsedTime();
				setDuration(duration => duration + elapsed)
				stopLocationTracking()
				console.log("android inactive/background -> active")
			}
		}
		if (appState.current.match(/inactive|active/) && nextAppState === "background") {
			recordStartTime();
			startLocationTracking();
			console.log("AppState should be inactive/active: ", appState.current);
		}
		appState.current = nextAppState;
		console.log("AppState", appState.current)
	};

	const endRun = () => {
		if (watcher != null) {
			watcher.remove()
		}

		Database.addRun({
			userId: Authentication.getCurrentUserId(),
			time: formatDuration(duration),
			distance: coveredDistance,
			pace: formatPace(calcAvgPace(coveredDistance, duration)),
			calories: calcCalories(),
			date: moment(date).utcOffset("+08:00").format("DD-MM-YYYY hh:mm a"),
			route: routeCoordinates,
			origin: origin
		},
			(run) => { },
			(error) => console.log(error))

		Database.addExperience({
			userId: Authentication.getCurrentUserId(),
			distance: coveredDistance
		},
			(levelExp, currentExp) => {
				navigation.dispatch(CommonActions.reset({
					index: 0,
					routes: [{
						name: "Running3",
						params: {
							duration: duration,
							distance: coveredDistance,
							coordinates: routeCoordinates,
							origin: origin,
							calories: calcCalories(),
							avgPace: calcAvgPace(coveredDistance, duration),
							currentExp: currentExp,
							levelExp: levelExp
						}
					}]
				}))
			},
			(error) => {
				console.log(error)
			})
	}

	TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
		if (error) {
			console.log('LOCATION_TRACKING task ERROR:', error);
			return;
		}
		if (data) {
			const { locations } = data;
			let lat = locations[0].coords.latitude;
			let long = locations[0].coords.longitude;
			const coords = { latitude: lat, longitude: long }

			setRouteCoordinates(prev => {
				setCoveredDistance((prevDist) => {
					if (prev.length == 0) { return 0 }
					if (isPaused) { return prevDist }
					const lastCoord = prev[prev.length - 1];
					return (prevDist + getDistance(lastCoord, coords) / 2)
				})
				return [...prev, coords]
			})
			console.log(`${new Date(Date.now()).toLocaleString()}: ${lat},${long}`);
		}
	});

	return (
		<SafeAreaView style={styles.container}>
			<Spinner
				visible={loading}
				textContent={"Retrieving running details..."}
				overlayColor="rgba(0, 0, 0, 0.8)"
				textStyle={{
					color: "white"
				}} />
			<MapView
				ref={map => setMap(map)}
				style={styles.map}
				provider="google"
				mapPadding={{ bottom: Dimensions.get("window").height * 0.25 }}
				style={[styles.map]}
				camera={{
					center: {
						latitude: userLocation.latitude,
						longitude: userLocation.longitude
					},
					pitch: 45,
					heading: 0,
					altitude: 0,
					zoom: 20,
				}}
				scrollEnabled={false}
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
			<View style={generatedDistance > 0 ? styles.sliderContainer : [styles.sliderContainer, { height: "40%" }]}>
				<View style={styles.runninginfo}>
					{
						generatedDistance <= 0
							?
							<View style={{ marginBottom: 10, alignItems: "center" }}>
								<Text style={styles.progressText}>
									{formatDistance(coveredDistance)}
								</Text>
							</View>
							:
							<View style={{ flex: 1, marginBottom: "10%" }}>
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
											<View style={{ marginBottom: 60, alignItems: "center" }}>
												<Text style={styles.progressText}>
													{formatDistance(coveredDistance)}
												</Text>
												<Text style={{ color: "#A7A7A7", fontSize: 16, fontStyle: "italic" }}>
													Target: {formatDistance(generatedDistance * 1000)}
												</Text>
											</View>
										)
									}
								</AnimatedCircularProgress>
							</View>
					}
					<View style={styles.infocomponent}>
						<View style={styles.iconContainer}>
							<MaterialCommunityIcons name="timer" color="white" size={35} />
							<Text style={styles.text}> Time:</Text>
						</View>
						<View style={styles.labelsContainer}>
							<Text style={[styles.text, { color: "#E1E1E1" }]}> {formatDuration(duration)} </Text>
						</View>
					</View>
					<View style={styles.infocomponent}>
						<View style={styles.iconContainer}>
							<MaterialCommunityIcons name="lightning-bolt" color="white" size={35} />
							<Text style={styles.text}> Pace:</Text>
						</View>
						<View style={styles.labelsContainer}>
							<Text style={[styles.text, { color: "#E1E1E1" }]}> {formatPace(pace)} </Text>
						</View>
					</View>
					<View style={styles.buttonsContainer}>
						<ColorButton
							title={isPaused ? "Resume" : "Pause"}
							type="solid"
							titleStyle={{
								color: "white"
							}}
							backgroundColor="#4CA050"
							width={170}
							height={60}
							onPress={() => { setIsPaused(!isPaused), watcher.remove() }}
						/>
						<ColorButton
							title="End"
							type="solid"
							titleStyle={{
								color: "white"
							}}
							backgroundColor="#F54B4B"
							width={170}
							height={60}
							loading={loading}
							onPress={() => {
								Alert.alert("End your run?", "",
									[{ text: "No", onPress: () => console.log('resume run'), style: "destructive" },
									{ text: "Yes", onPress: () => endRun() }])
							}}
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
		marginTop: 0,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	runninginfo: {
		flexDirection: "column",
		marginTop: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sliderContainer: {
		flex: 1,
		position: "absolute",
		alignItems: "center",
		justifyContent: "center",
		bottom: "-5%",
		backgroundColor: "rgba(52, 52, 52, 0.9)",
		width: Dimensions.get('window').width,
		height: "45%",
		borderRadius: 30,
	},
	infocomponent: {
		flex: 1,
		marginTop: "-5%",
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		width: "90%"
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 30,
		justifyContent: 'flex-start',
	},
	labelsContainer: {
		flex: 2,
		alignItems: 'center',
	},
	progressText: {
		color: "#D8F3EE",
		fontWeight: "bold",
		fontSize: 32,
	},
	text: {
		color: "white",
		fontSize: 28,
	},
	buttonsContainer: {
		flex: 1,
		width: "100%",
		alignItems: 'center',
		justifyContent: "space-evenly",
		flexDirection: 'row',
		marginBottom: "13%"
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
