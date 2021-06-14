import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text, ActivityIndicator, Dimensions } from "react-native"
import * as Progress from "react-native-progress"
import { Image } from "react-native-elements"
import Spinner from "react-native-loading-spinner-overlay"

import colors from "../constants/color"
import * as Authentication from "../api/auth"
import * as Database from "../api/db"

const deviceWidth = Dimensions.get("window").width
const deviceHeight = Dimensions.get("window").height

const Home = () => {
	const [userStatsArr, setUserStatsArr] = useState([])
	const [expPercentage, setExpPercentage] = useState()
	const [prevRun, setPrevRun] = useState([])
	const [username, setUsername] = useState()
	const [loading, setLoading] = useState(true)

	const formatDistance = (dist) => dist < 1000
		? dist + " m"
		: (dist / 1000).toFixed(2) + " km"

	const getUserDetails = () => {
		Authentication.setOnAuthStateChanged((user) => {
			Database.userDetails(user.uid).on("value", (snapshot) => {
				setUserStatsArr(snapshot.child("statistics").val())
				setUsername(snapshot.val().username)
				const levelExp = snapshot.child("statistics").val().level * 2 * 1000
				const currentExp = snapshot.child("statistics").val().exp
				setExpPercentage(currentExp / levelExp)

				const run = snapshot.child("runningLogs")
				const numberOfRuns = run.child("numberOfRuns").val()
				setPrevRun(run.child("history/" + numberOfRuns).val())
				setLoading(false)
			})
		}, (user) => {
			console.log("no user")
		})
	}

	useEffect(() => {
		getUserDetails()
	}, [])

	return (
		<View style={styles.container}>
			<Spinner
				visible={loading}
				textContent={"Loading contents..."}
				overlayColor="rgba(94, 94, 94, 0.8)"
				textStyle={{
					color: "white"
				}} />
			<View style={{ flex: 2, height: deviceHeight * (2/3) }}>
				<View style={styles.imageContainer}>
					<Image
						source={require("../assets/archer.png")}
						style={styles.image}
						PlaceholderContent={<ActivityIndicator />} />
					<Text style={styles.text}>{username}</Text>
					<View style={styles.charContainer}>
						<Text style={styles.level}>Level: {userStatsArr.level}</Text>
						<Progress.Bar
							progress={expPercentage}
							height={10}
							width={250}
							color="#AEF94E"
							borderWidth={1}
							borderColor="#fff" />
						<View style={styles.statsContainer}>
							<View style={{ flexDirection: "column", flex: 1, alignItems: "center", width: "100%" }}>
								<Text style={styles.stats}>HP:
									<Text style={styles.value}> {userStatsArr.hp}</Text>
								</Text>
								<Text style={styles.stats}>ATK:
									<Text style={styles.value}> {userStatsArr.atk}</Text>
								</Text>
								<Text style={styles.stats}>DEF:
									<Text style={styles.value}> {userStatsArr.def}</Text>
								</Text>
							</View>
							<View style={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
								<Text style={styles.stats}>EVD:
									<Text style={styles.value}> {userStatsArr.evd}</Text>
								</Text>
								<Text style={styles.stats}>SPD:
									<Text style={styles.value}> {userStatsArr.spd}</Text>
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.logsContainer}>
				<View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
					<Text style={[styles.text, { fontSize: deviceHeight >= 770 ? 25 : 23, alignSelf: "center" }]}>Previous Run: </Text>
					<Text style={[{ color: "white", fontSize: deviceHeight >= 770 ? 22 : 20, alignSelf: "center" }]}>{prevRun != null ? prevRun.date : ""}</Text>
				</View>
				<View style={styles.runContainer}>
					<View style={{ flex: 1, flexDirection: "column", marginTop: 5, marginLeft: 10, alignSelf: "center", justifyContent: "center" }}>
						<Text style={{ fontSize: deviceHeight >= 770 ? 25 : 23, fontWeight: "bold", color: "white", alignSelf: "center" }}>{prevRun != null ? formatDistance(prevRun.distance) : "0"}</Text>
						<Text style={{ fontSize: deviceHeight >= 770 ? 14 : 12, color: "#BBBDBD", alignSelf: "center" }}>DISTANCE</Text>
					</View>
					<View style={{ flex: 1, flexDirection: "row", marginTop: 5, marginLeft: 10, marginBottom: 8, alignSelf: "center", alignItems: "center" }}>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: deviceHeight >= 770 ? 25 : 23, fontWeight: "bold", color: "white", alignSelf: "center" }}>{prevRun != null ? prevRun.time : "00:00"}</Text>
							<Text style={{ fontSize: deviceHeight >= 770 ? 14 : 12, color: "#BBBDBD", alignSelf: "center" }}>DURATION</Text>
							<Text style={{ fontSize: deviceHeight >= 770 ? 12 : 10, color: "#BBBDBD", alignSelf: "center" }}>(MM:SS)</Text>
						</View>
						<View style={{ flex: 2 }}>
							<Text style={{ fontSize: deviceHeight >= 770 ? 25 : 23, fontWeight: "bold", color: "white", alignSelf: "center" }}>{prevRun != null ? prevRun.pace + " min/km": "0:00 min/km"}</Text>
							<Text style={{ fontSize: deviceHeight >= 770 ? 14 : 12, color: "#BBBDBD", alignSelf: "center" }}>AVG PACE</Text>
							<Text style={{ fontSize: deviceHeight >= 770 ? 12 : 10, color: "#BBBDBD", alignSelf: "center" }}></Text>
						</View>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: deviceHeight >= 770 ? 25 : 23, fontWeight: "bold", color: "white", alignSelf: "center" }}>{prevRun != null ? Math.round(prevRun.calories) : "0"}</Text>
							<Text style={{ fontSize: deviceHeight >= 770 ? 14 : 12, color: "#BBBDBD", alignSelf: "center" }}>CALORIES</Text>
							<Text style={{ fontSize: deviceHeight >= 770 ? 12: 10, color: "#BBBDBD", alignSelf: "center" }}>(kcal)</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: deviceHeight,
		width: deviceWidth,
		backgroundColor: colors.background,
		justifyContent: "center",
		alignItems: "center"
	},
	imageContainer: {
		flex: 2,
		marginTop: 30,
		alignItems: "center"
	},
	image: {
		width: deviceHeight >= 760 ? deviceWidth * 0.4 : deviceWidth * 0.3,
		height: deviceHeight >= 760 ? deviceWidth * 0.4 : deviceWidth * 0.3,
		borderRadius: 10,
		borderWidth: 4,
	},
	charContainer: {
		flex: 1,
		flexDirection: "column",
		width: deviceWidth,
		alignItems: "center",
	},
	text: {
		color: "white",
		fontWeight: "bold",
		fontSize: 28,
	},
	level: {
		color: colors.statsAccent,
		fontWeight: "bold",
		fontSize: 24,
		marginBottom: 5,
	},
	statsContainer: {
		flex: 1,
		flexDirection: "row",
		width: "80%",
		marginTop: "5%",
		justifyContent: "center",
		alignSelf: "center",
	},
	stats: {
		color: colors.statsAccent,
		fontSize: deviceHeight >= 760 ? 23 : 20,
		fontWeight: "bold",
		marginRight: 20
	},
	value: {
		color: "#fff",
		fontSize: deviceHeight >= 760 ? 23 : 20,
	},
	logsContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-start",
		marginBottom: 30
	},
	runContainer: {
		flex: 6,
		backgroundColor: "rgba(77, 77, 77, 0.8)",
		width: "90%",
		borderWidth: 1.5,
		borderColor: "white",
		borderRadius: 20,
		marginTop: 10,
		alignSelf: "center"
	}
})

export default Home