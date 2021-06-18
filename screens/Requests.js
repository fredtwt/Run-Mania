import React, { useEffect, useMemo, useState } from "react"
import { View, StyleSheet, Text, Dimensions, FlatList, Modal, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { SearchBar } from "react-native-elements"
import { BlurView } from 'expo-blur'; //expo install expo-blur
import Spinner from "react-native-loading-spinner-overlay"
import Clipboard from "expo-clipboard" //expo install expo-clipboard

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"
import { Alert } from "react-native";

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const formatDistance = (dist) => dist < 1000
	? dist + " m"
	: (dist / 1000).toFixed(2) + " km"

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

const FriendContainer = (props) => {
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
						<Text style={[styles.label, { alignSelf: "flex-start", marginBottom: 5 }]}>Total distance ran: {formatDistance(props.distance)}</Text>
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
								title="Add Friend"
								titleStyle={{
									fontSize: 14
								}}
								height={35}
								width={100}
								backgroundColor="#358745"
								onPress={props.acceptFriendRequest} />
							<ColorButton
								title="Reject"
								titleStyle={{
									fontSize: 14
								}}
								height={35}
								width={100}
								backgroundColor="#D13636"
								onPress={props.rejectFriendRequest} />
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const Friends = () => {
	const user = Authentication.getCurrentUserId()
	const [requestsArray, setRequestsArray] = useState([])
	const [loading, setLoading] = useState(false)

	const acceptFriendRequest = (userId, friendId) => {
		Database.acceptFriendRequest({ currentId: userId, friendId: friendId },
			(friend) => {
				var updateArr = []
				requestsArray.forEach((request) => {
					if (request.uid != friendId) {
						updateArr.push(request)
					}
				})
				setRequestsArray(updateArr)
				return Alert.alert(null, "Friend request accepted successfully!")
			},
			(error) => {
				return Alert.alert(null, "Accepting friend request unsuccessful!")
			})
	}

	const rejectFriendRequest = (userId, friendId) => {
		Database.rejectFriendRequest({ currentId: userId, friendId: friendId },
			(friend) => {
				var updateArr = []
				requestsArray.forEach((request) => {
					if (request.uid != friendId) {
						updateArr.push(request)
					}
				})
				setRequestsArray(updateArr)
				return Alert.alert(null, "Friend request rejected successfully!")
			},
			(error) => {
				return Alert.alert(null, "Friend request rejection unsuccessful!")
			})
	}

	useEffect(() => {
		let mounted = true
		setLoading(true)
		Database.userDetails(user).child("friends").on("value", snapshot => {
			if (mounted) {
				setRequestsArray([])
				snapshot.forEach(current => {
					if (current.val().friend == false) {
						Database.userDetails(current.val().uid).get().then(snapshot => {
							setRequestsArray(prevData => [...prevData, {
								uid: current.val().uid,
								job: snapshot.val().job,
								username: snapshot.val().username,
								distance: snapshot.child("runningLogs").val().totalDistanceRan,
								level: snapshot.child("statistics").val().level,
								atk: snapshot.child("statistics").val().atk,
								hp: snapshot.child("statistics").val().hp,
								def: snapshot.child("statistics").val().def,
								magic: snapshot.child("statistics").val().magic,
								mr: snapshot.child("statistics").val().mr,
							}])
						})
					}
				})
				setLoading(false)
			}
		})

		return () => {
			mounted = false
		}
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
				<View style={styles.header}>
					<Text style={styles.headerText}>List of requests:</Text>
				</View>
			<View style={styles.resultsContainer}>
				<FlatList
					data={requestsArray}
					keyExtractor={item => item.uid.toString()}
					renderItem={useMemo(() => ({ item }) => {
						return (
							<FriendContainer
								rejectFriendRequest={() => rejectFriendRequest(user, item.uid)}
								acceptFriendRequest={() => acceptFriendRequest(user, item.uid)}
								gender={item.gender}
								job={item.job}
								atk={item.atk}
								hp={item.hp}
								def={item.def}
								magic={item.magic}
								mr={item.mr}
								distance={item.distance}
								username={item.username}
								level={item.level} />
						)
					}, [requestsArray])
					} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: deviceWidth,
		backgroundColor: "#2E2E2E",
		justifyContent: "center",
		alignItems: "center"
	},
	header: {
		flex: 1,
		position: "absolute",
		borderBottomWidth: 5,
		backgroundColor: "rgba(80, 80, 80, 0.7)",
		padding: 10,
		top: 0,
		height: 60,
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
		flex: 1,
		flexDirection: "column",
		position: "absolute",
		top: 70,
		height: deviceHeight,
		width: deviceWidth,
		padding: 10
	},
	logContainer: {
		flexDirection: "row",
		height: 100,
		borderWidth: 2,
		borderColor: "black",
		borderRadius: 20,
		padding: 10,
		margin: 5,
		backgroundColor: "rgba(82, 136, 184, 0.4)",
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
		height: 300,
		width: 350,
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

export default Friends