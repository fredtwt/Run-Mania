import React, { useEffect, useState } from "react"
import { Alert } from "react-native"
import { View, StyleSheet, TouchableOpacity, Text, Image, ActivityIndicator } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import ColorButton from "../presentational/ColorButton"

import * as Authentication from "../api/auth"
import * as Database from "../api/db"

const Stats = (navigation) => {
	const user = Authentication.getCurrentUserId()
	const [username, setUsername] = useState("")
	const [stats, setStats] = useState([])
	const [gender, setGender] = useState("")
	const [job, setJob] = useState("")
	const [points, setPoints] = useState(0)
	const [originalPoints, setOriginalPoints] = useState(0)
	const [atk, setAtk] = useState(0)
	const [def, setDef] = useState(0)
	const [magic, setMagic] = useState(0)
	const [mr, setMr] = useState(0)
	const [hp, setHp] = useState(0)

	const getAvatar = () => {
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

	const addStats = () => {
		Database.addStats({
			userId: user,
			hp: stats.hp + hp * 10,
			atk: stats.atk + atk,
			magic: stats.magic + magic,
			def: stats.def + def,
			mr: stats.mr + mr,
			points: points
		}, 
		() => {
			setHp(0)
			setAtk(0)
			setMagic(0)
			setDef(0)
			setMr(0)
		},
		(error) => {
			console.log(error)
		})
	}

	useEffect(() => {
		let mounted = true
		Database.userDetails(user).on("value", snapshot => {
			if (mounted) {
				setPoints(snapshot.child("statistics/points").val())
				setOriginalPoints(snapshot.child("statistics/points").val())
				setStats(snapshot.child("statistics").val())
				setGender(snapshot.val().gender)
				setJob(snapshot.val().job)
				setUsername(snapshot.val().username)
			}
		})

		return () => {
			mounted = false
		}
	}, [])

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				<Image
					source={getAvatar()}
					style={styles.image}
					PlaceholderContent={<ActivityIndicator />} />
				<View style={styles.avatarInfo}>
					<Text style={[styles.whiteText, { color: "#54D3E2", fontWeight: "bold", fontSize: 30 }]}>{username}</Text>
					<Text style={[styles.whiteText, { fontWeight: "bold" }]}>Level {stats.level}</Text>
					<Text style={styles.whiteText}>Gender: {gender}</Text>
					<Text style={styles.whiteText}>Job: {job}</Text>
				</View>
			</View>
			<View style={styles.statsContainer}>
				<View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
					<Text style={{ color: "#47B4CA", fontSize: 30, fontWeight: "bold" }}>{points} </Text>
					<Text style={{ color: "white", fontSize: 25, fontStyle: "italic" }}>stat points left</Text>
					{
						originalPoints != points
							? <ColorButton
								containerStyle={{
									flex: 1,
									alignItems: "flex-end"
								}}
								title="Confirm"
								backgroundColor="#4AA24D"
								onPress={() => addStats()}
								height={40}
								width={100} />
							: null
					}
				</View>
				<View style={styles.addStatContainer}>
					<View style={styles.statLabel}>
						<Icon
							name="heart"
							color="#63E189"
							size={30} />
						<Text style={[styles.statText, { color: hp > 0 ? "#6AE96F" : "white" }]}>  HP: {stats.hp + (hp * 10)}</Text>
					</View>
					<View style={styles.adderContainer}>
						<TouchableOpacity
							style={styles.leftButtonContainer}
							onPress={() => {
								if (hp > 0) {
									setHp(prev => prev - 1)
									setPoints(prev => prev + 1)
								} else {
									return Alert.alert(null, "Negative values are not allowed!")
								}
							}}>
							<Icon
								name="minus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
						<View style={styles.valueContainer}>
							<Text style={[styles.valueText, { color: hp > 0 ? "#6AE96F" : "white" }]}>{hp}</Text>
						</View>
						<TouchableOpacity
							style={styles.rightButtonContainer}
							onPress={() => {
								if (points > 0) {
									setHp(prev => prev + 1)
									setPoints(prev => prev - 1)
								} else {
									return Alert.alert(null, "You have insufficient stat points!")
								}
							}}>
							<Icon
								name="plus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.addStatContainer}>
					<View style={styles.statLabel}>
						<Icon
							name="sword"
							color="#E25454"
							size={30} />
						<Text style={[styles.statText, { color: atk > 0 ? "#6AE96F" : "white" }]}>  ATK: {stats.atk + atk}</Text>
					</View>
					<View style={styles.adderContainer}>
						<TouchableOpacity
							style={styles.leftButtonContainer}
							onPress={() => {
								if (atk > 0) {
									setAtk(prev => prev - 2)
									setPoints(prev => prev + 1)
								} else {
									return Alert.alert(null, "Negative values are not allowed!")
								}
							}}>
							<Icon
								name="minus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
						<View style={styles.valueContainer}>
							<Text style={[styles.valueText, { color: atk > 0 ? "#6AE96F" : "white" }]}>{atk}</Text>
						</View>
						<TouchableOpacity
							style={styles.rightButtonContainer}
							onPress={() => {
								if (points > 0) {
									setAtk(prev => prev + 2)
									setPoints(prev => prev - 1)
								} else {
									return Alert.alert(null, "You have insufficient stat points!")
								}
							}}>
							<Icon
								name="plus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.addStatContainer}>
					<View style={styles.statLabel}>
						<Icon
							name="water"
							color="#47B4CA"
							size={30} />
						<Text style={[styles.statText, { color: magic > 0 ? "#6AE96F" : "white" }]}>  MAGIC: {stats.magic + magic}</Text>
					</View>
					<View style={styles.adderContainer}>
						<TouchableOpacity
							style={styles.leftButtonContainer}
							onPress={() => {
								if (magic > 0) {
									setMagic(prev => prev - 2)
									setPoints(prev => prev + 1)
								} else {
									return Alert.alert(null, "Negative values are not allowed!")
								}
							}}>
							<Icon
								name="minus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
						<View style={styles.valueContainer}>
							<Text style={[styles.whiteText, { color: magic > 0 ? "#6AE96F" : "white" }]}>{magic}</Text>
						</View>
						<TouchableOpacity
							style={styles.rightButtonContainer}
							onPress={() => {
								if (points > 0) {
									setMagic(prev => prev + 2)
									setPoints(prev => prev - 1)
								} else {
									return Alert.alert(null, "You have insufficient stat points!")
								}
							}}>
							<Icon
								name="plus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.addStatContainer}>
					<View style={styles.statLabel}>
						<Icon
							name="shield"
							color="gold"
							size={30} />
						<Text style={[styles.statText, { color: def > 0 ? "#6AE96F" : "white" }]}>  DEF: {stats.def + def}</Text>
					</View>
					<View style={styles.adderContainer}>
						<TouchableOpacity
							style={styles.leftButtonContainer}
							onPress={() => {
								if (def > 0) {
									setDef(prev => prev - 2)
									setPoints(prev => prev + 1)
								} else {
									return Alert.alert(null, "Negative values are not allowed!")
								}
							}}>
							<Icon
								name="minus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
						<View style={styles.valueContainer}>
							<Text style={[styles.whiteText, { color: def > 0 ? "#6AE96F" : "white" }]}>{def}</Text>
						</View>
						<TouchableOpacity
							style={styles.rightButtonContainer}
							onPress={() => {
								if (points > 0) {
									setDef(prev => prev + 2)
									setPoints(prev => prev - 1)
								} else {
									return Alert.alert(null, "You have insufficient stat points!")
								}
							}}>
							<Icon
								name="plus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.addStatContainer}>
					<View style={styles.statLabel}>
						<Icon
							name="shield"
							color="#9E63E1"
							size={30} />
						<Text style={[styles.statText, { color: mr > 0 ? "#6AE96F" : "white" }]}>  MR: {stats.mr + mr}</Text>
					</View>
					<View style={styles.adderContainer}>
						<TouchableOpacity
							style={styles.leftButtonContainer}
							onPress={() => {
								if (mr > 0) {
									setMr(prev => prev - 2)
									setPoints(prev => prev + 1)
								} else {
									return Alert.alert(null, "Negative values are not allowed!")
								}
							}}>
							<Icon
								name="minus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
						<View style={styles.valueContainer}>
							<Text style={[styles.whiteText, { color: mr > 0 ? "#6AE96F" : "white" }]}>{mr}</Text>
						</View>
						<TouchableOpacity
							style={styles.rightButtonContainer}
							onPress={() => {
								if (points > 0) {
									setMr(prev => prev + 2)
									setPoints(prev => prev - 1)
								} else {
									return Alert.alert(null, "You have insufficient stat points!")
								}
							}}>
							<Icon
								name="plus"
								color="black"
								size={25}
							/>
						</TouchableOpacity>
					</View>
				</View>
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
	adderContainer: {
		flex: 1,
		height: 45,
		flexDirection: "row",
		alignSelf: "center"
	},
	statsContainer: {
		flex: 2,
		flexDirection: "column",
		padding: 5
	},
	avatarInfo: {
		flex: 2,
		flexDirection: "column",
		padding: 10,
		alignItems: "flex-start",
		paddingLeft: 20
	},
	imageContainer: {
		flex: 1,
		flexDirection: "row",
		margin: 10,
		marginBottom: -20,
		alignItems: "center",
	},
	image: {
		flex: 1.5,
		aspectRatio: 1.06,
		resizeMode: "cover",
		borderRadius: 10,
		borderWidth: 5,
	},
	leftButtonContainer: {
		flex: 1,
		borderWidth: 2,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center"
	},
	rightButtonContainer: {
		flex: 1,
		borderWidth: 2,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
		backgroundColor: "white",
		alignItems: "center",
		justifyContent: "center"
	},
	valueContainer: {
		flex: 1.5,
		borderTopWidth: 2,
		borderBottomWidth: 2,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(140, 140, 140, 0.6)"
	},
	whiteText: {
		fontSize: 20,
		color: "white",
		padding: 5
	},
	valueText: {
		fontSize: 20,
		fontWeight: "bold"
	},
	addStatContainer: {
		flex: 1,
		width: "90%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	statLabel: {
		flex: 2,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-start"
	},
	statText: {
		fontSize: 26,
		fontWeight: "bold",
		color: "white"
	}
})

export default Stats