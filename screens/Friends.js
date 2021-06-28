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
						<Text style={[styles.label, { alignSelf: "flex-start" }]}>Job: {props.job}</Text>
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
								title="Unfriend"
								titleStyle={{
									fontSize: 14
								}}
								height={40}
								width={100}
								backgroundColor="#D13636"
								onPress={props.unfriendRequest} />
							<ColorButton
								title="Close"
								titleStyle={{
									fontSize: 14
								}}
								height={40}
								width={100}
								backgroundColor="#3A7DB7"
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
					<View style={{ flexDirection: "column" }}>
						<View style={styles.listLabel}>
							<Text style={styles.listText}>{props.username}</Text>
							<Text style={[styles.listText, { color: "#80E837" }]}>Lvl {props.level}</Text>
						</View>
						<View style={styles.listLabel}>
							<Text style={styles.listText}>Total Distance:</Text>
							<Text style={[styles.listText, { color: "#80E837" }]}>{formatDistance(props.distance)}</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}

const Friends = () => {
	const user = Authentication.getCurrentUserId()
	const [search, setSearch] = useState("")
	const [searchFriend, setSearchFriend] = useState({
		job: "",
		gender: "",
		username: "",
		statistics: {
			level: "",
			atk: "",
			hp: "",
			def: "",
			magic: "",
			mr: ""
		},
		runningLogs: {
			totalDistanceRan: ""
		}
	})
	const [friendsArray, setFriendsArray] = useState([])
	const [overlayVisible, setOverlayVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	const searchUser = (uid) => {
		setLoading(true)
		if (uid == "") {
			setLoading(false)
			return Alert.alert(null, "UID search field is empty!")
		} else if (uid == user) {
			setLoading(false)
			return Alert.alert(null, "Your own personal UID is not allowed!")
		}

		Database.searchUser({ id: uid },
			(user) => {
				user.get().then((snapshot) => {
					setSearchFriend(snapshot.val())
					setLoading(false)
					setOverlayVisible(true)
				})
			},
			(error) => {
				setLoading(false)
				return Alert.alert(null, "No such user found! Please try again.")
			})
	}

	const sendFriendRequest = (userId, friendId) => {
		setOverlayVisible(false)
		setLoading(true)

		Database.sendFriendRequest({ currentId: userId, friendId: friendId },
			(friend) => {
				setLoading(false)
				return Alert.alert(null, "Friend request sent successfully!")
			},
			(error) => {
				setLoading(false)
				console.log(error)
				return Alert.alert(null, "Friend request unsuccessful! You have made this request before!")
			})
	}

	const unfriendRequest = (userId, friendId) => {
		setOverlayVisible(false)

		Alert.alert(null, "Are you sure?", [
			{
				text: "Yes",
				onPress: () => {
					setLoading(true)
					Database.rejectFriendRequest({ currentId: userId, friendId: friendId },
						(friend) => {
							setLoading(false)
							return Alert.alert(null, "Unfriended successfully!")
						},
						(error) => {
							setLoading(false)
							console.log(error)
							return Alert.alert(null, "Unfriend unsuccessful!")
						})

				}
			},
			{
				text: "No",
				onPress: () => {
					console.log("request cancelled")
				},
				style: "destructive"
			}
		])
	}

	useEffect(() => {
		let mounted = true
		setLoading(true)
		Database.userDetails(user).child("friends").on("value", snapshot => {
			if (mounted) {
				setFriendsArray([])
				snapshot.forEach(current => {
					if (current.val().friend == true) {
						Database.userDetails(current.val().uid).get().then(snapshot => {
							setFriendsArray(prevData => [...prevData, {
								uid: current.val().uid,
								job: snapshot.val().job,
								gender: snapshot.val().gender,
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
				textContent={"Loading..."}
				overlayColor="rgba(94, 94, 94, 0.8)"
				textStyle={{
					color: "white"
				}} />
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
							source={getAvatar(searchFriend.gender, searchFriend.job)}
							style={styles.image}
							PlaceholderContent={<ActivityIndicator size="large" />} />
						<View style={{ flexDirection: "column", paddingLeft: 10, justifyContent: "center" }}>
							<Text style={[styles.label, { fontWeight: "bold", alignSelf: "flex-start" }]}>{searchFriend.username}</Text>
							<Text style={[styles.label, { fontSize: 18, alignSelf: "flex-start" }]}>Level: {searchFriend.statistics.level} </Text>
						</View>
					</View>
					<View style={{ flex: 2, padding: 20, paddingTop: 0, width: "100%" }}>
						<Text style={[styles.label, { alignSelf: "flex-start" }]}>Total distance ran: {formatDistance(searchFriend.runningLogs.totalDistanceRan)}</Text>
						<Text style={[styles.label, { alignSelf: "flex-start" }]}>Job: {searchFriend.job}</Text>
						<View style={{ flex: 1, flexDirection: "row", padding: 10, alignItems: "center", justifyContent: "space-between" }}>
							<View>
								<Text style={styles.statsHeader}>HP:</Text>
								<Text style={styles.stats}>{searchFriend.statistics.hp}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>ATK:</Text>
								<Text style={styles.stats}>{searchFriend.statistics.atk}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>MAGIC:</Text>
								<Text style={styles.stats}>{searchFriend.statistics.magic}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>DEF:</Text>
								<Text style={styles.stats}>{searchFriend.statistics.def}</Text>
							</View>
							<View>
								<Text style={styles.statsHeader}>MR:</Text>
								<Text style={styles.stats}>{searchFriend.statistics.mr}</Text>
							</View>
						</View>
						<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
							<ColorButton
								title="Add Friend"
								titleStyle={{
									fontSize: 14
								}}
								height={40}
								width={100}
								backgroundColor="#358745"
								onPress={() => sendFriendRequest(user, search)} />
							<ColorButton
								title="Cancel"
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
			<View style={styles.header}>
				<View style={{ flex: 1, marginBottom: 10 }}>
					<Text style={styles.headerText}>Add Friend:</Text>
				</View>
				<View style={{ flex: 2, flexDirection: "row", marginBottom: 10 }}>
					<SearchBar
						placeholder="Enter a UID here"
						platform="android"
						onChangeText={(text) => setSearch(text)}
						containerStyle={styles.inputText}
						value={search} />
					<ColorButton
						containerStyle={styles.button}
						title="Search"
						height={60}
						backgroundColor="#358745"
						onPress={() => searchUser(search)} />
				</View>
				<TouchableOpacity
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						borderWidth: 4,
						borderRadius: 20,
						backgroundColor: "grey"
					}}
					onPress={() => {
						Clipboard.setString(user)
						Alert.alert("UID copied to clipboard")
					}}>
					<View style={styles.footer}>
						<Text style={styles.uidLabel}>Your UID: </Text>
						<Text style={styles.uid}>{user}</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View style={styles.resultsContainer}>
				<Text style={styles.headerText}>Your Friends:</Text>
				<FlatList
					data={friendsArray}
					keyExtractor={(item, index) => index.toString()}
					renderItem={useMemo(() => ({ item }) => {
						return (
							<FriendContainer
								unfriendRequest={() => unfriendRequest(user, item.uid)}
								gender={item.gender}
								job={item.job}
								atk={item.atk}
								hp={item.hp}
								def={item.def}
								mr={item.mr}
								magic={item.magic}
								distance={item.distance}
								username={item.username}
								level={item.level} />
						)
					}, [friendsArray])
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
		borderTopWidth: 4,
		borderBottomWidth: 4,
		backgroundColor: "rgba(80, 80, 80, 0.7)",
		padding: 10,
		top: 0,
		height: 180,
		borderColor: "black",
		width: "100%"
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
		color: "white"
	},
	uid: {
		fontSize: 16,
		fontStyle: "italic",
		color: "#9AD126"
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
		flex: 4,
		flexDirection: "column",
		position: "absolute",
		top: 190,
		left: 10,
		right: 10
	},
	logContainer: {
		flexDirection: "row",
		height: 80,
		borderWidth: 3,
		borderColor: "black",
		borderRadius: 40,
		padding: 10,
		margin: 5,
		backgroundColor: "rgba(194, 215, 150, 0.3)",
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
		backgroundColor: "rgb(65, 65, 65)",
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
		width: 60,
		height: 60,
		borderRadius: 60 / 2,
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