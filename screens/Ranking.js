import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text, Dimensions, Image, ActivityIndicator } from "react-native"
import LeaderBoard from "react-native-leaderboard"
import Spinner from "react-native-loading-spinner-overlay"

import color from "../constants/color"
import * as Authentication from "../api/auth"
import * as Database from "../api/db"

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const getAvatar = (gender, job) => {
	if (gender == "Male") {
		if (job == "Archer") {
			return require("../assets/avatars/male_archer.png")
		} else if (job == "Mage") {
			return require("../assets/avatars/male_mage.png")
		} else {
			return require("../assets/avatars/male_warrior.png")
		}
	} else {
		if (job == "Archer") {
			return require("../assets/avatars/female_archer.png")
		} else if (job == "Mage") {
			return require("../assets/avatars/female_mage.png")
		} else {
			return require("../assets/avatars/female_warrior.png")
		}
	}
}

const Ranking = () => {
	const [data, setData] = useState([])
	const [currentUser, setCurrentUser] = useState({
		email: "",
		username: "",
		totalDistanceRan: "",
		rank: "",
	})
	const [loading, setLoading] = useState(true)

	const formatDistance = (dist) => dist < 1000
		? dist + " m"
		: (dist / 1000).toFixed(2) + " km"

	const ordinal_suffix_of = (i) => {
		var j = i % 10,
				k = i % 100;
		if (j == 1 && k != 11) {
			return i + "st";
		}
		if (j == 2 && k != 12) {
			return i + "nd";
		}
		if (j == 3 && k != 13) {
			return i + "rd";
		}
		return i + "th";
	}

	const sort = (data) => {
		const sorted = data && data.sort((item1, item2) => {
			return item2.totalDistanceRan - item1.totalDistanceRan
		})
		const userRank = sorted.findIndex((item) => {
			return item.email == currentUser.email
		})
		return userRank + 1
	}

	useEffect(() => {
		let mounted = true

		Database.db.ref("users/").on("value", (snapshot) => {
			setData([])
			snapshot.forEach((user) => {
				if (mounted) {
				setData(prevData => [...prevData, {
					username: user.val().username + "  ---  Lvl " + user.child("statistics").val().level,
					email: user.val().email,
					totalDistanceRan: user.child("runningLogs/totalDistanceRan").val(),
					gender: user.val().gender,
					job: user.val().job
				}])
				}
			})
		})

		Authentication.setOnAuthStateChanged((user) => {
			Database.db.ref("users/" + user.uid).on("value", (snapshot) => {
				const username = snapshot.val().username
				const email = snapshot.val().email
				const totalDistanceRan = snapshot.child("runningLogs").val().totalDistanceRan
				setCurrentUser({
					...currentUser,
					username: username,
					email: email,
					totalDistanceRan: totalDistanceRan,
					job: snapshot.val().job,
					gender: snapshot.val().gender
				})
			})
		},
			(error) => {
				console.log(error);
			})
		setLoading(false)

		return (() => {
			mounted = false
		})
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
			<View style={styles.headerContainer}>
				<View style={styles.header}>
					<Text style={styles.headerText}>{ordinal_suffix_of(sort(data))}</Text>
				</View>
				<View style={styles.header}>
					<Image
						source={getAvatar(currentUser.gender, currentUser.job)}
						style={styles.image}
						PlaceholderContent={<ActivityIndicator size="large" />} />
				</View>
				<View style={styles.header}>
					<Text style={[styles.headerText, {fontSize: deviceHeight >= 760 ? 25 : 22}]}>{formatDistance(currentUser.totalDistanceRan)}</Text>
				</View>
			</View>
			<View style={styles.leaderboardContainer}>
				<LeaderBoard
					data={data}
					evenRowColor="#edfcf9"
					sortBy="totalDistanceRan"
					labelBy="username" />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		height: Dimensions.get("window").height,
		width: Dimensions.get("window").width
	},
	headerContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: color.leaderboardAccent,
		width: "100%",
		alignItems: "center",
		justifyContent: "center"
	},
	header: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	headerText: {
		fontSize: deviceHeight >= 760 ? 30 : 28,
		color: "white",
	},
	leaderboardContainer: {
		flex: 3,
		backgroundColor: color.background,
	},
	image: {
		width: deviceHeight >= 760 ? 120 : 110,
		height: deviceHeight >= 760 ? 120 : 110,
		borderRadius: deviceHeight >= 760 ? 120 / 2 : 110 /2,
		borderWidth: 3.5,
		borderColor: "black"
	},
})


export default Ranking
