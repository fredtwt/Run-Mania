import React, { useState } from "react"
import { View, StyleSheet } from "react-native"
import LeaderBoard from "react-native-leaderboard"

import color from "../constants/color"

const Ranking = () => {
	const [data, setData] = useState([])
	
	return (
		<View style={styles.container}>
			<LeaderBoard
				data={data}
				containerStyle={styles.leaderboardContainer}
				sortBy="highScore"
				labelBy="userName" />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.background,
		alignItems: "center"
	},
	leaderboardContainer: {
		flex: 1,
		marginTop: 50,
		backgroundColor: color.background,

	}
})

export default Ranking