import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native"
import { CommonActions } from "@react-navigation/native"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"
import { Dimensions } from "react-native"

const Result = ({ route, navigation }) => {
	const [game, setGame] = useState(Object)
	const gameId = route.params.game
	const [winner, setWinner] = useState("")
	const [draw, setDraw] = useState(false)

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

	const goHome = () => {
		navigation.dispatch(CommonActions.reset({
			index: 0,
			routes: [{
				name: "Main",
			}]
		}))
	}

	useEffect(() => {
		let mounted = true
		Database.game(gameId).get().then(snapshot => {
			if (mounted) {
				setGame(snapshot.val())
				if (snapshot.val().winner == snapshot.child("player1/username").val()) {
					setWinner(snapshot.child("player1").val())
				} else if (snapshot.val().winner == "") {
					setDraw(true)
				} else {
					setWinner(snapshot.child("player2").val())
				}
			}
		})

		return () => {
			mounted = false
		}
	}, [])
	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>MATCH OVER</Text>
				{
					draw
						?
						<View style={styles.winner}>
							<Image
								source={require("../assets/swords.png")}
								style={styles.image}
								PlaceholderContent={<ActivityIndicator />} />
							<Text style={[styles.resultText, { color: "#FFC300" }]}>It's a draw!</Text>
						</View>
						:
						<View style={styles.winner}>
							<View style={[styles.image, {borderWidth: 3}]}>
								<Image
									source={getAvatar(winner.gender, winner.job)}
									style={[styles.image, {resizeMode: "contain", borderWidth: 2 }]}
									PlaceholderContent={<ActivityIndicator />} />
							</View>
							<Text style={[styles.resultText, { color: "#80E837" }]}>{winner.username} wins!</Text>
						</View>
				}
			<ColorButton
				title="Back to home"
				containerStyle={styles.button}
				backgroundColor="#60752A"
				width={150}
				height={60}
				onPress={() => goHome()} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.background
	},
	headerText: {
		flex: 1,
		paddingTop: "30%",
		color: "white",
		fontSize: 45,
		fontWeight: "bold",
		alignSelf: "center"
	},
	image: {
		flex: 1,
		aspectRatio: 1.2,
		resizeMode: "cover"
	},
	resultText: {
		flex: 1,
		paddingTop: "10%",
		fontSize: 40,
		fontWeight: "bold",
		color: "white",
		alignSelf: "center"
	},
	winner: {
		flex: 2,
		width: "100%",
		alignItems: "center",
	},
	button: {
		flex: 1,
		alignSelf: "center"
	}
})

export default Result