import React, { useEffect, useMemo, useState } from "react"
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Modal, Alert, Dimensions, Image } from "react-native"
import { Overlay } from "react-native-elements"
import { BlurView } from 'expo-blur'; //expo install expo-blur
import { ActivityIndicator } from "react-native-paper"
import { CommonActions } from "@react-navigation/native"
import Spinner from "react-native-loading-spinner-overlay"
import shortid from "shortid"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"

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

const RequestContainer = (props) => {
	const [overlayVisible, setOverlayVisible] = useState(false)

	return (
		<View>
			<Modal
				animationType="slide"
				visible={overlayVisible}
				transparent={true}>
				<BlurView
					intensity={130}
					tint="dark"
					style={styles.overlay} />
				<View style={styles.overlayBackground}>
					<View style={{ flex: 1, flexDirection: "row", paddingTop: 20, paddingLeft: 20, paddingBottom: 10, width: "100%" }}>
						<Image
							source={getAvatar(props.gender, props.job)}
							style={styles.image}
							PlaceholderContent={<ActivityIndicator size="large" />} />
						<View style={{ flexDirection: "column", paddingLeft: 10, justifyContent: "center" }}>
							<Text style={[styles.label, { fontWeight: "bold", alignSelf: "flex-start" }]}>{props.username}</Text>
							<Text style={[styles.label, { fontSize: 18, alignSelf: "flex-start" }]}>Level: {props.level} </Text>
						</View>
					</View>
					<View style={{ flex: 2, padding: 20, paddingTop: 0, width: "100%" }}>
						<Text style={[styles.label, { alignSelf: "flex-start" }]}>Job class: {props.job}</Text>
						<View style={{ flex: 1, flexDirection: "row", padding: 10, alignItems: "center", justifyContent: "space-between" }}>
							<View>
								<Text style={styles.statsHeader}>HP:</Text>
								<Text style={styles.stats}>{props.hp}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>ATK:</Text>
								<Text style={styles.stats}>{props.atk}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>MAGIC:</Text>
								<Text style={styles.stats}>{props.magic}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>DEF:</Text>
								<Text style={styles.stats}>{props.def}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>MR:</Text>
								<Text style={styles.stats}>{props.mr}</Text>
							</View>
						</View>
						<View style={{ flex: 1, flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "space-around" }}>
							<ColorButton
								title="Close"
								titleStyle={{
									fontSize: 14
								}}
								height={40}
								width={100}
								backgroundColor="#D13636"
								onPress={() => setOverlayVisible(false)} />
						</View>
					</View>
				</View>
			</Modal>
			<TouchableOpacity onPress={() => setOverlayVisible(true)}>
				<View style={styles.logContainer}>
					<Image
						source={getAvatar(props.gender, props.job)}
						style={styles.listImage}
						PlaceholderContent={<ActivityIndicator size="large" />} />
					<View style={{ flex: 1, flexDirection: "column" }}>
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
							<Text style={styles.listText}>{props.username}</Text>
							<Text style={[styles.listText, { color: "#80E837" }]}>Lvl {props.level}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 2 }}>
							<ColorButton
								title="Accept"
								titleStyle={{
									fontSize: 14
								}}
								height={35}
								width={100}
								backgroundColor="#358745"
								onPress={props.accept} />
							<ColorButton
								title="Reject"
								titleStyle={{
									fontSize: 14
								}}
								height={35}
								width={100}
								backgroundColor="#D34F4F"
								onPress={props.reject} />
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const ArenaContainer = (props) => {
	const [overlayVisible, setOverlayVisible] = useState(false)

	return (
		<View>
			<Modal
				animationType="slide"
				visible={overlayVisible}
				transparent={true}>
				<BlurView
					intensity={130}
					tint="dark"
					style={styles.overlay} />
				<View style={styles.overlayBackground}>
					<View style={{ flex: 1, flexDirection: "row", paddingTop: 20, paddingLeft: 20, paddingBottom: 10, width: "100%" }}>
						<Image
							source={getAvatar(props.gender, props.job)}
							style={styles.image}
							PlaceholderContent={<ActivityIndicator size="large" />} />
						<View style={{ flexDirection: "column", paddingLeft: 10, justifyContent: "center" }}>
							<Text style={[styles.label, { fontWeight: "bold", alignSelf: "flex-start" }]}>{props.username}</Text>
							<Text style={[styles.label, { fontSize: 18, alignSelf: "flex-start" }]}>Level: {props.level} </Text>
						</View>
					</View>
					<View style={{ flex: 2, padding: 20, paddingTop: 0, width: "100%" }}>
						<Text style={[styles.label, { alignSelf: "flex-start" }]}>Job class: {props.job}</Text>
						<View style={{ flex: 1, flexDirection: "row", padding: 10, alignItems: "center", justifyContent: "space-between" }}>
							<View>
								<Text style={styles.statsHeader}>HP:</Text>
								<Text style={styles.stats}>{props.hp}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>ATK:</Text>
								<Text style={styles.stats}>{props.atk}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>MAGIC:</Text>
								<Text style={styles.stats}>{props.magic}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>DEF:</Text>
								<Text style={styles.stats}>{props.def}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>MR:</Text>
								<Text style={styles.stats}>{props.mr}</Text>
							</View>
						</View>
						<View style={{ flex: 1, flexDirection: "row", marginTop: 5, alignItems: "center", justifyContent: "space-around" }}>
							<ColorButton
								title="Close"
								titleStyle={{
									fontSize: 14
								}}
								height={40}
								width={100}
								backgroundColor="#D13636"
								onPress={() => setOverlayVisible(false)} />
						</View>
					</View>
				</View>
			</Modal>
			<TouchableOpacity onPress={() => setOverlayVisible(true)}>
				<View style={styles.logContainer}>
					<Image
						source={getAvatar(props.gender, props.job)}
						style={styles.listImage}
						PlaceholderContent={<ActivityIndicator size="large" />} />
					<View style={{ flex: 1, flexDirection: "row", padding: 10 }}>
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
							<Text style={styles.listText}>{props.username}</Text>
							<Text style={[styles.listText, { color: "#80E837" }]}>Lvl {props.level}</Text>
						</View>
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around", marginTop: 2 }}>
							<ColorButton
								title="Challenge"
								titleStyle={{
									fontSize: 14
								}}
								height={35}
								width={100}
								backgroundColor="#358745"
								onPress={props.challenge} />
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const Pvp = ({ navigation }) => {
	const userId = Authentication.getCurrentUserId()
	const [isArena, setIsArena] = useState(true)
	const [userInfo, setUserInfo] = useState([])
	const [opponent, setOpponent] = useState("")
	const [roomId, setRoomId] = useState("")
	const [requestsArray, setRequestsArray] = useState([])
	const [pvpArray, setPvpArray] = useState([])
	const [isWaiting, setIsWaiting] = useState(false)
	const [position, setPosition] = useState("")
	const [p1Username, setP1Username] = useState("")
	const [p2Username, setP2Username] = useState("")
	const [loading, setLoading] = useState(false)
	const [game, setGame] = useState({
		gameStarted: false,
		player1: "",
		position: ""
	})

	const pvpRequest = (opponent) => {
		let id = shortid.generate()
		Database.newGame({
			id: id,
			player: userId,
			opponent: opponent
		},
			(game) => {
				setGame(game)
				setRoomId(id)
				setOpponent(opponent)
			},
			(error) => {
				console.log(error)
			})
	}

	const cancelRequest = (id, opponent) => {
		Database.cancelGame({
			id: id,
			player: userId,
			opponent: opponent
		},
			(game) => {
				setGame(null)
			},
			(error) => {
				console.log(error)
			})
	}

	const acceptRequest = () => {
		Database.gameDetails(userId).get().then(match => {
			Database.acceptGame({
				id: match.val().id,
				player: match.val().player1,
				opponent: userId
			},
				(game) => setGame(game),
				(error) => {
					console.log(error)
				})
		})
	}

	const rejectRequest = () => {
		Database.gameDetails(userId).get().then(match => {
			Database.cancelGame({
				id: match.val().id,
				player: match.val().player1,
				opponent: userId
			},
				(game) => {
					setGame(null)
				},
				(error) => {
					console.log(error)
				})
		})
	}

	const checkGameStatus = (game) => {
		if (game.gameStarted) {
			navigation.dispatch(CommonActions.reset({
				index: 0,
				routes: [{
					name: "Battle",
					params: {
						game: game
					}
				}]
			}))
		}
	}

	const checkWaiting = (game) => {
		if (game == null) {
			setIsWaiting(false)
		} else {
			setIsWaiting(!game.gameStarted)
		}
	}

	const checkPosition = (game) => {
		if (game != null) {
			return game.position
		}
	}

	useEffect(() => {
		let mounted = true

		Database.gameDetails(userId).on("value", snapshot => {
			if (mounted) {
				if (snapshot.val() != null) {
					setPosition(checkPosition(snapshot.val()))
					setP1Username(snapshot.val().p1Username)
					setP2Username(snapshot.val().p2Username)
					checkWaiting(snapshot.val())
					Database.db.ref("pvp/" + snapshot.val().id).get().then(game => {
						checkGameStatus(game.val())
					})
				} else {
					setP1Username("")
					setP2Username("")
					setIsWaiting(false)
				}
			}
		})


		Database.userDetails(userId).on("value", userDetails => {
			Database.db.ref("users/").on("value", snapshot => {
				if (mounted) {
					let limit = 0
					let userLevel = userDetails.child("statistics").val().level
					setUserInfo(userDetails.val().statistics)
					setPvpArray([])
					snapshot.forEach(user => {
						if (user.child("currentMatch").val() == null && user.child("statistics").val().level <= userLevel + 3 && user.child("statistics").val().level >= userLevel - 3 && user.key != userId && user.val().status && limit < 10) {
							setPvpArray(prev => [...prev, {
								uid: user.key,
								gender: user.val().gender,
								username: user.val().username,
								job: user.val().job,
								atk: user.child("statistics").val().atk,
								def: user.child("statistics").val().def,
								magic: user.child("statistics").val().magic,
								mr: user.child("statistics").val().mr,
								hp: user.child("statistics").val().hp,
								level: user.child("statistics").val().level,
							}])
							limit++
						}
					})
				}
			})
		})

		return () => {
			mounted = false
		}
	}, [])

	return (
		<View style={styles.container}>
			{
				position == "inviter"
					?
					<Overlay
						visible={isWaiting}
						overlayStyle={styles.loadingOverlay}>
						<View>
							<ActivityIndicator size="large" color="#4AAA5B" style={styles.loading} />
							<View style={{ alignItems: "center", justifyContent: "center" }}>
								<Text style={{
									margin: 10,
									color: "white",
									fontSize: 20,
								}}>Waiting for opponent</Text>
								<ColorButton
									title="Cancel"
									backgroundColor="red"
									onPress={() => cancelRequest(roomId, opponent)}
									height={35}
									width={90} />
							</View>
						</View>
					</Overlay>
					:
					<Overlay
						visible={isWaiting}
						overlayStyle={styles.loadingOverlay}>
						<View>
							<View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
								<ActivityIndicator size="large" color="#4AAA5B" style={styles.loading} />
								<Text style={{
									marginTop: 5,
									marginBottom: 10,
									color: "white",
									fontSize: 20,
								}}>PVP request from {p1Username}</Text>
							</View>
							<View style={{ flex: 1, flexDirection: "row", width: 300, justifyContent: "space-evenly", marginTop: 10 }}>
								<ColorButton
									title="Accept"
									backgroundColor="green"
									onPress={() => acceptRequest()}
									height={35}
									width={90} />
								<ColorButton
									title="Reject"
									backgroundColor="red"
									onPress={() => rejectRequest()}
									height={35}
									width={90} />
							</View>
						</View>
					</Overlay>
			}
			<View style={styles.requestContainer}>
				<Spinner
					visible={loading}
					textContent={"Loading..."}
					overlayColor="rgba(94, 94, 94, 0.8)"
					textStyle={{
						color: "white"
					}} />
				<View style={styles.headerContainer}>

				</View>
				<View style={{ flex: 0.2, alignSelf: "center", width: deviceWidth * 0.95, flexDirection: "row", borderRadius: 15, borderWidth: 4, backgroundColor: "rgba(35, 35, 35, 0.8)" }}>
					<TouchableOpacity
						style={[styles.button]}
						onPress={() => setIsArena(true)}>
						<View style={styles.textContainer}>
							<Text style={[styles.buttonText, { color: isArena ? color.pvpAccent : "white" }]}>Arena</Text>
						</View>
					</TouchableOpacity>
					<View style={{ borderWidth: 2 }}></View>
					<TouchableOpacity
						style={styles.button}
						onPress={() => setIsArena(false)}>
						<View style={styles.textContainer}>
							<Text style={[styles.buttonText, { color: isArena ? "white" : color.pvpAccent }]}>Match History</Text>
						</View>
					</TouchableOpacity>
				</View>
				{
					isArena
						? <View style={styles.header}>
							<Text style={styles.headerText}>Arena:</Text>
							<View style={styles.resultsContainer}>
								<FlatList
									data={pvpArray}
									keyExtractor={(item, index) => index.toString()}
									renderItem={useMemo(() => ({ item }) => {
										return (
											<ArenaContainer
												challenge={() => pvpRequest(item.uid)}
												gender={item.gender}
												job={item.job}
												atk={item.atk}
												hp={item.hp}
												def={item.def}
												magic={item.magic}
												mr={item.mr}
												username={item.username}
												level={item.level} />
										)
									}, [pvpArray])
									} />
							</View>
						</View>
						: <View style={styles.header}>
							<Text style={styles.headerText}>Pvp log:</Text>
							<View style={styles.resultsContainer}>
								<FlatList
									data={requestsArray}
									keyExtractor={(item, index) => index.toString()}
									renderItem={useMemo(() => ({ item }) => {
										return (
											<RequestContainer
												gender={item.gender}
												job={item.job}
												atk={item.atk}
												hp={item.hp}
												def={item.def}
												magic={item.magic}
												mr={item.mr}
												username={item.username}
												level={item.level} />
										)
									}, [requestsArray])
									} />
							</View>
						</View>
				}
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
	headerContainer: {
		flex: 1,
	},
	requestContainer: {
		flex: 2,
	},
	text: {
		fontSize: 30,
		color: "white"
	},
	button: {
		width: "50%",
	},
	textContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: 18
	},
	loadingOverlay: {
		height: 200,
		width: 300,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgb(80, 80, 80)",
		borderRadius: 10,
	},
	loading: {
		justifyContent: "center",
		margin: 20
	},
	header: {
		flex: 2,
		backgroundColor: "rgba(50, 50, 50, 0.8)",
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		borderColor: "black",
		width: deviceWidth
	},
	footer: {
		flexDirection: "row",
		borderColor: "black",
		alignItems: "center",
		justifyContent: "flex-start"
	},
	uidLabel: {
		fontSize: 18,
		fontWeight: "bold",
		color: "orange"
	},
	uid: {
		fontSize: 16,
		fontStyle: "italic",
		color: "orange"
	},
	headerText: {
		alignSelf: "flex-start",
		color: "white",
		fontWeight: "bold",
		fontSize: 24,
		marginLeft: 10,
	},
	inputText: {
		flex: 4,
		borderRadius: 20,
		height: 60,
		alignSelf: "center"
	},
	resultsContainer: {
		flex: 2,
		flexDirection: "column",
		width: deviceWidth,
	},
	logContainer: {
		flexDirection: "row",
		height: 90,
		width: "95%",
		alignSelf: "center",
		borderWidth: 2,
		borderColor: "black",
		borderRadius: 20,
		padding: 10,
		margin: 5,
		backgroundColor: "rgba(100, 100, 100, 0.5)",
		alignItems: "center"
	},
	button: {
		flex: 1,
		alignSelf: "center",
		paddingLeft: 5
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
	},
	overlayBackground: {
		flexDirection: "column",
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		top: "20%",
		borderWidth: 4,
		height: 280,
		width: 320,
		borderRadius: 20,
		backgroundColor: color.background,
	},
	label: {
		color: "white",
		fontSize: 18
	},
	image: {
		width: 80,
		height: 80,
		borderRadius: 80 / 2,
		borderWidth: 3,
		borderColor: "black"
	},
	listImage: {
		marginLeft: 5,
		width: 70,
		height: 70,
		borderRadius: 70 / 2,
		borderWidth: 3,
		borderColor: "black"
	},
	listLabel: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center"
	},
	listText: {
		marginLeft: 10,
		color: "white",
		fontSize: 20,
		alignSelf: "center"
	},
	statsHeader: {
		color: color.statsAccent,
		fontSize: 16,
		fontWeight: "bold",
		alignSelf: "center"
	},
	stats: {
		color: "white",
		fontSize: 16,
		alignSelf: "center"
	}
})

export default Pvp