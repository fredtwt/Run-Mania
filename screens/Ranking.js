import React, { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import LeaderBoard from "react-native-leaderboard"

import color from "../constants/color"
import * as Authentication from "../api/auth"
import * as Database from "../api/db"

const Ranking = () => {
	const [data, setData] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		Database.db.ref("users/").on("value", (snapshot) => {
			snapshot.forEach((user) => {
				
				setData(prevData => [...prevData, {
					username: user.val().username,
					totalDistanceRan: user.child("runningLogs/totalDistanceRan").val()
				}])
			})
		})
		return () => {
			setData([])
		}
	}, [])


	return (
		<View style={styles.container}>
			<View style={styles.headerContainer}>

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
		backgroundColor: color.background,
		alignItems: "center"
	},
	headerContainer: {
		flex: 1
	},
	leaderboardContainer: {
		flex: 2,
		backgroundColor: color.background,

	}
})

export default Ranking