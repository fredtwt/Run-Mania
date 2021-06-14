import React, { useEffect, useMemo, useState } from "react"
import { View, StyleSheet, Text, Dimensions, FlatList } from "react-native"
import Spinner from "react-native-loading-spinner-overlay"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"
import { TouchableOpacity } from "react-native"

const deviceHeight = Dimensions.get("window").height


const LogContainer = (props) => (
	<View style={styles.container}>
		<TouchableOpacity>
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

const formatDistance = (dist) => dist < 1000
	? dist + " m"
	: (dist / 1000).toFixed(2) + " km"

const RunningLogs = () => {
	const [logHistory, setLogHistory] = useState([])
	const [pageSize, setPageSize] = useState(10)
	const [last, setLast] = useState()
	const [finalLog, setFinalLog] = useState(false)
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

	const getMoreLogs = async () => {
		if (!finalLog) {
			setLoading(true)
			await Database.userDetails(user).child("runningLogs/history/").orderByKey().limitToLast(pageSize).get().then((snapshot) => {
				const moreLogs = snapshot.val().pop()
				logHistory.concat(moreLogs)
				setLast(snapshot.val()[1])
				snapshot.val().length == 0 ? setFinalLog(true) : setFinalLog(false)
			})
		}
		setLoading(false)
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
				renderItem={useMemo(() => ({ item }) => <LogContainer
					number={item.key}
					date={item.date}
					duration={item.time}
					pace={item.pace}
					distance={formatDistance(item.distance)}
					calories={item.calories} />, [sort(logHistory)])
				} />
			<View style={{ flex: 1 }}>

			</View>
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