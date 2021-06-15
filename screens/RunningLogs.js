import React, { useEffect, useMemo, useState } from "react"
import { View, StyleSheet, Text, Dimensions, FlatList, Modal } from "react-native"
import { BlurView } from 'expo-blur'; //expo install expo-blur
import MapView, { Marker } from "react-native-maps";
import Spinner from "react-native-loading-spinner-overlay"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"
import { TouchableOpacity } from "react-native"

const deviceHeight = Dimensions.get("window").height

const zoom = (distance) => {
	const newDistance = distance / 1000
	if (newDistance < 2) {
		return 17.5
	} else if (newDistance < 5) {
		return 16
	} else if (newDistance < 10) {
		return 15
	} else {
		return 14
	}
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

const LogContainer = (props) => {
	const [overlayVisible, setOverlayVisible] = useState(false)
	var finalRegion = getRegionForCoordinates(props.coordinates)

	return (
		<View style={styles.container}>
			<Modal
				animationType="fade"
				transparent={true}
				visible={overlayVisible}
				onRequestClose={() => setOverlayVisible(false)}>
				<BlurView
					intensity={130}
					tint="dark"
					style={styles.overlay}>
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
							zoom: zoom(props.zoom)
						}}>
						<Marker coordinate={props.origin} />
						<MapView.Polyline // for tracking the run
							coordinates={props.coordinates}
							strokeWidth={5}
							strokeColor="blue"
						/>
					</MapView>
					<ColorButton
						containerStyle={{
							marginTop: 30
						}}
						onPress={() => setOverlayVisible(false)}
						title="Return"
						backgroundColor="#2D883F"
						height={60}
						width={150} />
				</BlurView>
			</Modal>
			<TouchableOpacity onPress={() => setOverlayVisible(true)}>
				<View style={styles.logContainer}>
					<View style={{ flex: 1, flexDirection: "row", width: "95%", borderBottomWidth: 2, borderColor: "black", paddingBottom: 5, marginBottom: 5 }}>
						<View style={{ flex: 5, flexDirection: "row" }}>
							<Text style={[styles.infoText, { alignSelf: "center", color: "black", fontWeight: "bold", fontSize: deviceHeight >= 760 ? 18 : 16 }]}>Run {props.number}: </Text>
							<Text style={[styles.infoText, { alignSelf: "center", color: "white", fontStyle: "italic", fontSize: deviceHeight >= 760 ? 18 : 16 }]}>{props.date}</Text>
						</View>
					</View>
					<View style={{ flex: 2, flexDirection: "row" }}>
						<View style={styles.textContainer}>
							<Text style={styles.infoText}>{props.distance}</Text>
							<Text style={styles.helperText}>Distance</Text>
						</View>
						<View style={styles.textContainer}>
							<Text style={styles.infoText}>{props.duration}</Text>
							<Text style={styles.helperText}>Duration</Text>
						</View>
						<View style={styles.textContainer}>
							<Text style={styles.infoText}>{props.pace}</Text>
							<Text style={styles.helperText}>Avg Pace</Text>
						</View>
						<View style={styles.textContainer}>
							<Text style={styles.infoText}>{props.calories}</Text>
							<Text style={styles.helperText}>Calories</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const formatDistance = (dist) => dist < 1000
	? dist + " m"
	: (dist / 1000).toFixed(2) + " km"

const RunningLogs = () => {
	const [logHistory, setLogHistory] = useState([])
	const [loading, setLoading] = useState(true)
	const user = Authentication.getCurrentUserId()

	const sort = (data) => {
		const sorted = data && data.sort((item1, item2) => {
			return item2.key - item1.key
		})
		return sorted
	}

	const getLogs = async () => {
		var logs = []
		await Database.userDetails(user).child("runningLogs/history/").orderByKey().limitToLast(100).get().then((snapshot) => {
			snapshot.forEach((log) => {
				logs.push(log.val())
			})
			setLoading(false)
		})
		setLogHistory(logs)
	}

	useEffect(() => {
		getLogs()
	}, [])

	return (
		<View style={styles.container}>
			<Spinner
				visible={loading}
				textContent={"Loading logs..."}
				overlayColor="rgba(94, 94, 94, 0.8)"
				textStyle={{
					color: "white"
				}} />
			<FlatList
				data={sort(logHistory)}
				keyExtractor={item => item.key.toString()}
				renderItem={useMemo(() => ({ item }) =>{
					return(
					<LogContainer
						zoom={item.distance}
						coordinates={item.route}
						origin={item.origin}
						number={item.key}
						date={item.date}
						duration={item.time}
						pace={item.pace}
						distance={formatDistance(item.distance)}
						calories={item.calories} />)}, [sort(logHistory)])
				} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#2E2E2E",
		justifyContent: "center",
		alignItems: "center"
	},
	map: {
		height: 410,
		width: 330,
	},
	overlay: {
		flex: 1,
		flexDirection: "column",
		position: "absolute",
		top: 0,
		bottom: 0,
		right: 0,
		left: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width
	},
	logContainer: {
		flexDirection: "column",
		height: 100,
		width: Dimensions.get("window").width * 0.95,
		borderWidth: 2,
		borderColor: "black",
		borderRadius: 10,
		padding: 10,
		margin: 5,
		backgroundColor: "rgba(100, 100, 100, 0.8)",
		justifyContent: "center",
		alignItems: "center"
	},
	infoText: {
		color: "white",
		alignSelf: "center",
		fontSize: deviceHeight >= 760 ? 20 : 18
	},
	helperText: {
		color: "rgba(255, 160, 47, 0.8)",
		alignSelf: "center",
		fontSize: deviceHeight >= 760 ? 14 : 12
	},
	textContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
})

export default RunningLogs
