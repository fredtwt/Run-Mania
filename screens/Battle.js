import React, { useState, useEffect, useMemo } from "react"
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Modal, Alert, Dimensions, Image } from "react-native"
import { Overlay } from "react-native-elements"
import { BlurView } from 'expo-blur'; //expo install expo-blur
import { ActivityIndicator } from "react-native-paper"
import Spinner from "react-native-loading-spinner-overlay"
import shortid from "shortid"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const Battle = ({ route, navigation }) => {
	const userId = Authentication.getCurrentUserId()
	const game = route.params.game
	const [turnover, setTurnOver] = useState(false)
	const [battleLog, setBattleLog] = useState([])

	const confirmAction = (action) => {
		Database.updateGameState(userId, action, game.id)
	}

	useEffect(() => {
		Database.game(game.id).on("value", snapshot => {
			
		})
	}, [turnover])

	return (
		<View style={styles.container}>
			<View style={styles.battleContainer}>
				<View style={styles.avatarContainer}>

				</View>
				<View style={styles.dialogContainer}>
					<View style={{ padding: 15 }}>
						<FlatList 
							data={battleLog}
							keyExtractor={(item, index) => index.toString()}
							renderItem={useMemo(() => ({item}) => {
								return (
									<Text style={styles.dialogText}>{item.text}</Text>
								)
							}, [battleLog])}/>
					</View>
				</View>
			</View>
			<View style={styles.selectionContainer}>
				<TouchableOpacity
					style={styles.row}>
					<View style={[styles.rowColor, {backgroundColor: "#F44141"}] }>
						<Text style={styles.whiteText}>Attack</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.row}>
					<View style={[styles.rowColor, {backgroundColor: "#F0A464"}] }>
						<Text style={styles.whiteText}>Skill</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.row}>
					<View style={[styles.rowColor, {backgroundColor: "#6497F0"}] }>
						<Text style={styles.whiteText}>Defend</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.row}>
					<View style={[styles.rowColor, {backgroundColor: "#6D946B"}] }>
						<Text style={styles.whiteText}>Surrender</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.background,
		justifyContent: "center",
		alignItems: "center"
	},
	battleContainer: {
		flex: 2,
		width: deviceWidth 
	},
	avatarContainer: {
		flex: 3,
		width: deviceWidth
	},
	dialogContainer: {
		flex: 1,
		width: deviceWidth * 0.99,
		alignSelf: "center",
		backgroundColor: "rgba(20, 20, 20, 0.8)",
		borderColor: "rgba(255, 255, 255, 0.6)",
		borderWidth: 3,
		borderRadius: 10
	},
	selectionContainer: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.3)",
		alignItems: "center",
		padding: 15,
		width: deviceWidth 
	}, 
	row: {
		flex: 1, 
		width: deviceWidth * 0.9,
		alignSelf: "center",
		paddingTop: 10,
	},
	rowColor: {
		flex: 1,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 4,
		borderRadius: 20,
	},
	whiteText: {
		textAlign: "center",
		width: "100%",
		fontSize: 20,
		fontWeight: "bold",
		textShadowColor: "black",
		textShadowRadius: 1,
		textShadowOffset: { width: 2, height: 2 },
		color: "white"
	},
	dialogText: {
		fontSize: 16,
		color: "white"
	}
})

export default Battle