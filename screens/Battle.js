import React, { useState, useEffect, useMemo } from "react"
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text, FlatList, Modal, Alert, Dimensions, Image } from "react-native"
import { Overlay } from "react-native-elements"
import { BlurView } from 'expo-blur'; //expo install expo-blur
import { ActivityIndicator, ProgressBar } from "react-native-paper"
import { CommonActions } from "@react-navigation/native"
import * as Progress from "react-native-progress"
import Spinner from "react-native-loading-spinner-overlay"

import * as Database from "../api/db"
import * as Authentication from "../api/auth"
import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"

const deviceHeight = Dimensions.get("window").height
const deviceWidth = Dimensions.get("window").width

const Battle = ({ route, navigation }) => {
	const userId = Authentication.getCurrentUserId()
	const gameId = route.params.game.id
	const [player1, setPlayer1] = useState(route.params.game.player1)
	const [player2, setPlayer2] = useState(route.params.game.player2)
	const p1MaxHp = route.params.game.player1.maxHp
	const p2MaxHp = route.params.game.player2.maxHp
	const player = route.params.game.player1.id == userId ? "player1" : "player2"
	const [p1Hp, setP1Hp] = useState(1)
	const [p2Hp, setP2Hp] = useState(1)
	const [isActionDone, setIsActionDone] = useState(false)
	const [skillCd, setSkillCd] = useState(false)
	const [cdAmt, setCdAmt] = useState(0)
	const [forfeitTurn, setForfeitTurn] = useState(false)
	const [penaltyCd, setPenaltyCd] = useState(0)
	const [penaltyAmt, setPenaltyAmt] = useState(0)
	const [penaltyType, setPenaltyType] = useState("")
	const [battleLog, setBattleLog] = useState([])
	const [game, setGame] = useState(Object)

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
	const confirmAction = async (action) => {
		await Database.updateGameState({ playerId: player, action: action, matchId: gameId },
			() => {
			},
			(error) => {
				console.log(error)
			})
		setIsActionDone(true)
	}

	const calcDmgTaken = (atk, def) => {
		let negatedDmg = atk - def
		if (negatedDmg <= 0) {
			return 0
		} else {
			return negatedDmg
		}
	}

	const matchOver = async (player, winner, position, dialog) => {
		await Database.endGame({
			id: gameId,
			user: player,
			winner: winner,
			position: position
		},
			() => {
			},
			(error) => console.log(error))
		navigation.dispatch(CommonActions.reset({
			index: 0,
			routes: [{
				name: "Result",
				params: {
					game: gameId
				}
			}]
		}))
	}

	const currentState = Database.game(gameId)

	const useSkill = async (turn, job, magic, player, playerDetails, target, targetDetails, defend) => {
		setSkillCd(true)
		if (job == "Archer") {
			setCdAmt(3)
			setForfeitTurn(true)
			let dmg = magic * 2 - targetDetails.stats.mr
			let negatedDmg = Math.round(dmg * 0.1)
			const newHp = () => {
				if (defend) {
					return targetDetails.stats.hp - negatedDmg < 0 ? 0 : targetDetails.stats.hp - negatedDmg
				} else {
					return targetDetails.stats.hp - dmg < 0 ? 0 : targetDetails.stats.hp - dmg
				}
			}
			let dialog = {
				text: "Turn " + turn + ": " + playerDetails.username + " used Twin Shot, dealing " + dmg + " damage"
			}
			await currentState.child(target + "/stats").update({
				hp: newHp()
			})
			await currentState.child("battleLog").push(dialog)
			await currentState.child(player).update({
				action: "nothing",
				ready: true
			})
		} else if (job == "Mage") {
			setCdAmt(3)
			setPenaltyCd(1)
			setPenaltyType("atk")
			const dmg = () => {
				if (defend) {
					return Math.round((magic - targetDetails.stats.mr) * 0.1)
				} else {
					return magic - targetDetails.stats.mr
				}
			}
			let healAmt = dmg() / 2 
			let penalty = Math.round(playerDetails.stats.atk * 0.2)
			let playerNewHp = playerDetails.stats.hp + healAmt >= playerDetails.maxHp ? playerDetails.maxHp : playerDetails.stats.hp + healAmt
			let targetNewHp = targetDetails.stats.hp - dmg() < 0 ? 0 : targetDetails.stats.hp - dmg()

			setPenaltyAmt(penalty)
			await currentState.child(target + "/stats").update({
				hp: targetNewHp
			})

			await currentState.child(player + "/stats").update({
				hp: playerNewHp,
				atk: playerDetails.stats.atk - penalty
			})

			let dialog = {
				text: "Turn " + turn + ": " + playerDetails.username + " used Siphon Life, dealing " + dmg() + " damage"
			}
			await currentState.child("battleLog").push(dialog)
		} else if (job == "Warrior") {
			setCdAmt(2)
			setPenaltyCd(1)
			setPenaltyType("def")

			const dmg = () => {
				if (defend) {
					return Math.round(magic * 0.1)
				} else {
					return magic 
				}
			}
			let penalty = Math.round(playerDetails.stats.def * 0.2)
			let targetNewHp = targetDetails.stats.hp - dmg() < 0 ? 0 : targetDetails.stats.hp - dmg()

			setPenaltyAmt(penalty)
			await currentState.child(target + "/stats").update({
				hp: targetNewHp
			})
			await currentState.child(player + "/stats").update({
				def: playerDetails.stats.def - penalty
			})
			let dialog = {
				text: "Turn " + turn + ": " + playerDetails.username + " used Double-Edged, dealing " + dmg() + " damage"
			}
			await currentState.child("battleLog").push(dialog)
		}
	}

	const triggerAction = async (game) => {
		let p1 = game.player1
		let p2 = game.player2
		let turn = game.turn
		let currentPlayer = player == "player1" ? p1 : p2
		let otherPlayer = player == "player1" ? p2 : p1
		let dialog
		setForfeitTurn(false)

		await currentState.child(player).update({
			action: "",
			ready: false,
		})

		if (cdAmt > 0) {
			console.log("cdAmt: " + cdAmt)
			setCdAmt(prev => prev - 1)
		}

		if (penaltyCd > 1) {
			console.log("penaltyAmt: " + penaltyAmt)
			console.log(penaltyType)
			setPenaltyCd(prev => prev - 1)
		} else if (penaltyCd == 1 && penaltyAmt > 0) {
			console.log("penaltyCd: " + penaltyCd)
			if (penaltyType == "atk") {
				await currentState.child(player + "/stats").update({
					atk: currentPlayer.stats.atk + penaltyAmt
				})
			} else if (penaltyType == "def") {
				await currentState.child(player + "/stats").update({
					def: currentPlayer.stats.def + penaltyAmt
				})
			}
			setPenaltyAmt(0)
		}

		if (p1.action == "attack") {
			if (p2.action == "attack") {
				let dmgTaken = calcDmgTaken(currentPlayer.stats.atk, otherPlayer.stats.def)
				let newHp = currentPlayer.stats.hp - dmgTaken

				dialog = {
					text: "Turn " + turn + ": " + currentPlayer.username + " attacked " + otherPlayer.username + " for " + dmgTaken + " damage"
				}
				await currentState.child(player + "/stats").update({
					hp: newHp < 0 ? 0 : newHp
				})
				await currentState.child("battleLog").push(dialog)
			} else if (p2.action == "skill") {
				if (player == "player2") {
					useSkill(turn, p2.job, p2.stats.magic, "player2", p2, "player1", p1, false)
				} else {
					let p2DmgTaken = calcDmgTaken(p1.stats.atk, p2.stats.def)
					let p2NewHp = p2.stats.hp - p2DmgTaken
					dialog = {
						text: "Turn " + turn + ": " + p1.username + " attacked " + p2.username + " for " + p2DmgTaken + " damage"
					}
					await currentState.child("player2/stats").update({
						hp: p2NewHp < 0 ? 0 : p2NewHp
					})
					await currentState.child("battleLog").push(dialog)
				}
			} else if (p2.action == "defend") {
				let p2DmgTaken = Math.round(calcDmgTaken(p1.stats.atk, p2.stats.def) * 0.1)
				let p2NewHp = p2.stats.hp - p2DmgTaken
				if (player == "player1") {
					dialog = {
						text: "Turn " + turn + ": " + p1.username + " attacked " + p2.username + " for " + p2DmgTaken + " damage"
					}
				} else {
					dialog = {
						text: "Turn " + turn + ": " + p2.username + " defended"
					}
				}
				await currentState.child("player2/stats").update({
					hp: p2NewHp < 0 ? 0 : p2NewHp
				})
				await currentState.child("battleLog").push(dialog)
			} else if (p2.action == "surrender") {
				dialog = {
					text: p2.username + " surrendered. " + p1.username + " wins!"
				}
				setIsActionDone(false)
				matchOver(userId, player1.username, player, dialog.text)
			} else if (p2.action == "nothing") {
				let p2DmgTaken = calcDmgTaken(p1.stats.atk, p2.stats.def)
				let p2NewHp = p2.stats.hp - p2DmgTaken
				if (player == "player1") {
					dialog = {
						text: "Turn " + turn + ": " + p1.username + " attacked " + p2.username + " for " + p2DmgTaken + " damage"
					}
				} else {
					dialog = {
						text: "Turn " + turn + ": " + p2.username + " forfeited a turn"
					}
				}
				await currentState.child("player2/stats").update({
					hp: p2NewHp < 0 ? 0 : p2NewHp
				})
				await currentState.child("battleLog").push(dialog)
			}
		} else if (p1.action == "skill") {
			if (p2.action == "attack") {
				if (player == "player1") {
					useSkill(turn, p1.job, p1.stats.magic, "player1", p1, "player2", p2, false)
				} else {
					let dmg = calcDmgTaken(p2.stats.atk, p2.stats.def)
					let newHp = p2.stats.hp - dmg
					dialog = {
						text: "Turn " + turn + ": " + p2.username + " attacked " + p1.username + " for " + dmg + " damage"
					}
					await currentState.child("player1/stats").update({
						hp: newHp < 0 ? 0 : newHp
					})
					await currentState.child("battleLog").push(dialog)
				}
			} else if (p2.action == "skill") {
				useSkill(turn, currentPlayer.job, currentPlayer.stats.magic, player, currentPlayer, player == "player1" ? "player2" : "player1", otherPlayer, false)
			} else if (p2.action == "defend") {
				if (player == "player1") {
					useSkill(turn, p1.job, p1.stats.magic, "player1", p1, "player2", p2, true)
				} else {
					dialog = {
						text: "Turn " + turn + ": " + p2.username + " defended"
					}
					await currentState.child("battleLog").push(dialog)
				}
			} else if (p2.action == "surrender") {
				dialog = {
					text: p2.username + " surrendered. " + p1.username + " wins!"
				}
				setIsActionDone(false)
				matchOver(userId, player1.username, player, dialog.text)
			} else if (p2.action == "nothing") {
				if (player == "player1") {
					useSkill(turn, p1.job, p1.stats.magic, "player1", p1, "player2", p2, true)
				} else {
					dialog = {
						text: "Turn " + turn + ": " + p2.username + " forfeited a turn"
					}
					await currentState.child("battleLog").push(dialog)
				}
			}
		} else if (p1.action == "defend") {
			if (p2.action == "attack") {
				let p1DmgTaken = Math.round(calcDmgTaken(p2.stats.atk, p1.stats.def) * 0.1)
				let p1NewHp = p1.stats.hp - p1DmgTaken
				if (player == "player1") {
					dialog = {
						text: "Turn " + turn + ": " + p1.username + " defended"
					}
				} else {
					dialog = {
						text: "Turn " + turn + ": " + p2.username + " attacked " + p1.username + " for " + p1DmgTaken + " damage"
					}
				}
				await currentState.child("player1/stats").update({
					hp: p1NewHp < 0 ? 0 : p1NewHp
				})
				await currentState.child("battleLog").push(dialog)
			} else if (p2.action == "skill") {
				if (player == "player2") {
					useSkill(turn, p2.job, p2.stats.magic, "player2", p2, "player1", p1, true)
				} else {
					dialog = {
						text: "Turn " + turn + ": " + p1.username + " defended"
					}
					await currentState.child("battleLog").push(dialog)
				}
			} else if (p2.action == "defend") {
				dialog = {
					text: "Turn " + turn + ": " + currentPlayer.username + " defended"
				}
				await currentState.child("battleLog").push(dialog)
			} else if (p2.action == "surrender") {
				dialog = {
					text: p2.username + " surrendered. " + p1.username + " wins!"
				}
				setIsActionDone(false)
				matchOver(userId, player1.username, player, dialog.text)
			} else if (p2.action == "nothing") {
				if (player == "player1") {
					dialog = {
						text: "Turn " + turn + ": " + currentPlayer.username + " defended"
					}
				} else {
					dialog = {
						text: "Turn " + turn + ": " + p2.username + " forfeited a turn"
					}
				}
				await currentState.child("battleLog").push(dialog)
			}
		} else if (p1.action == "surrender") {
			if (p2.action == "surrender") {
				dialog = {
					text: currentPlayer.username + " and " + otherPlayer.username + " surrendered!"
				}
				setIsActionDone(false)
				matchOver(userId, "", player, dialog.text)
			} else {
				dialog = {
					text: p1.username + " surrendered. " + p2.username + " wins!"
				}
				setIsActionDone(false)
				matchOver(userId, player2.username, player, dialog.text)
			}
		} else if (p1.action == "nothing") {
			if (p2.action == "attack") {
				if (player == "player2") {
					let dmgTaken = calcDmgTaken(currentPlayer.stats.atk, otherPlayer.stats.def)
					let newHp = currentPlayer.stats.hp - dmgTaken

					dialog = {
						text: "Turn " + turn + ": " + currentPlayer.username + " attacked " + otherPlayer.username + " for " + dmgTaken + " damage"
					}
					await currentState.child(player + "/stats").update({
						hp: newHp < 0 ? 0 : newHp
					})
				} else {
					dialog = {
						text: "Turn " + turn + ": " + currentPlayer.username + " forfeited a turn"
					}
				}
				await currentState.child("battleLog").push(dialog)
			} else if (p2.action == "skill") {
				if (player == "player2") {
					useSkill(turn, p2.job, p2.stats.magic, "player2", p2, "player1", p1, true)
				} else {
					dialog = {
						text: "Turn " + turn + ": " + currentPlayer.username + " forfeited a turn"
					}
				}
				await currentState.child("battleLog").push(dialog)
			} else if (p2.action == "defend") {
				if (player == "player2") {
					dialog = {
						text: "Turn " + turn + ": " + currentPlayer.username + " defended"
					}
				} else {
					dialog = {
						text: "Turn " + turn + ": " + currentPlayer.username + " forfeited a turn"
					}
				}
				await currentState.child("battleLog").push(dialog)
			} else if (p2.action == "surrender") {
				dialog = {
					text: p2.username + " surrendered. " + p1.username + " wins!"
				}
				setIsActionDone(false)
				matchOver(userId, player1.username, player, dialog.text)
			}
		}
		await currentState.update({
			turn: turn + 1
		})
		setIsActionDone(false)
	}

	useEffect(() => {
		let mounted = true

		Database.game(gameId).child("battleLog").on("value", logs => {
			if (mounted) {
				setBattleLog([])
				logs.forEach(log => {
					setBattleLog(prev => [log.val().text, ...prev])
				})
			}
		})

		Database.game(gameId).on("value", snapshot => {
			let p1 = snapshot.val().player1
			let p2 = snapshot.val().player2
			if (mounted) {
				setPlayer1(p1)
				setPlayer2(p2)
				setP1Hp(p1.stats.hp / p1MaxHp)
				setP2Hp(p2.stats.hp / p2MaxHp)
				setGame(snapshot.val())
				if (p1.stats.hp > 0 && p2.stats.hp > 0) {
					if (p1.ready && p2.ready) {
						triggerAction(snapshot.val())
					}
				} else {
					if (p1.stats.hp == 0 && p2.stats.hp == 0) {
						let dialog = p1.username + " and " + p2.username + " surrendered!"
						matchOver(userId, "", player, dialog)
					} else if (p1.stats.hp == 0) {
						let dialog = p1.username + " has been wiped out and " + p2.username + " is the winner!"
						matchOver(userId, p2.username, player, dialog)
					} else {
						let dialog = p2.username + " has been wiped out and " + p1.username + " is the winner!"
						matchOver(userId, p1.username, player, dialog)
					}
				}
			}
		})

		return () => {
			mounted = false
		}
	}, [cdAmt])

	return (
		<SafeAreaView style={styles.container}>
			<Spinner
				visible={isActionDone || forfeitTurn}
				animation="fade"
				textContent={forfeitTurn ? "Forfeiting a turn..." : "Waiting for opponent..."}
				overlayColor="rgba(0, 0, 0, 0.7)"
				textStyle={{
					color: "white"
				}} />
			<View style={styles.battleContainer}>
				<View style={styles.avatarContainer}>
					<View style={styles.playerContainer}>
						<Text style={[styles.statsText, { fontSize: 22 }]}>{player1.username}</Text>
						<Image
							source={getAvatar(player1.gender, player1.job)}
							style={styles.image}
							PlaceholderContent={<ActivityIndicator />} />
						<View style={styles.statsContainer}>
							<Text style={styles.statsText}>HP: {player1.stats.hp} / {p1MaxHp}</Text>
							<Progress.Bar
								animationConfig={{
									bounciness: 10
								}}
								unfilledColor="rgba(100, 100, 100, 0.6)"
								progress={p1Hp}
								height={10}
								width={140}
								color="#4D9341"
								borderWidth={3}
								borderColor="black" />
							<View style={styles.stats}>
								<Text style={styles.statsText}>ATK: {player1.stats.atk}</Text>
								<Text style={styles.statsText}>MAGIC: {player1.stats.magic}</Text>
								<Text style={styles.statsText}>DEF: {player1.stats.def}</Text>
								<Text style={styles.statsText}>MR: {player1.stats.mr}</Text>
							</View>
						</View>
					</View>
					<Text style={{
						color: "white",
						fontWeight: "bold",
						fontSize: 30,
						marginTop: "20%"
					}}>VS</Text>
					<View style={styles.playerContainer}>
						<Text style={[styles.statsText, { fontSize: 22 }]}>{player2.username}</Text>
						<Image
							source={getAvatar(player2.gender, player2.job)}
							style={styles.image}
							PlaceholderContent={<ActivityIndicator />} />
						<View style={styles.statsContainer}>
							<Text style={styles.statsText}>HP: {player2.stats.hp} / {p2MaxHp}</Text>
							<Progress.Bar
								unfilledColor="rgba(100, 100, 100, 0.6)"
								progress={p2Hp}
								height={10}
								width={140}
								color="#4D9341"
								borderWidth={3}
								borderColor="black" />
							<View style={styles.stats}>
								<Text style={styles.statsText}>ATK: {player2.stats.atk}</Text>
								<Text style={styles.statsText}>MAGIC: {player2.stats.magic}</Text>
								<Text style={styles.statsText}>DEF: {player2.stats.def}</Text>
								<Text style={styles.statsText}>MR: {player2.stats.mr}</Text>
							</View>
						</View>
					</View>
				</View>
				<View style={styles.dialogContainer}>
					<View style={{ padding: 15 }}>
						<FlatList
							data={battleLog}
							keyExtractor={(item, index) => index.toString()}
							renderItem={useMemo(() => ({ item }) => {
								return (
									<Text style={styles.dialogText}>{item}</Text>
								)
							}, [battleLog])} />
					</View>
				</View>
			</View>
			<View style={styles.selectionContainer}>
				<TouchableOpacity
					style={styles.row}
					onPress={() => confirmAction("attack")}>
					<View style={[styles.rowColor, { backgroundColor: "#F44141" }]}>
						<Text style={styles.whiteText}>Attack</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					disabled={cdAmt > 0}
					style={styles.row}
					onPress={() => confirmAction("skill")}>
					<View style={[styles.rowColor, cdAmt > 0 ? { backgroundColor: "grey" } : { backgroundColor: "#F0A464" }]}>
						<Text style={styles.whiteText}>{cdAmt > 0 ? cdAmt + " more turns" : "Skill"}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.row}
					onPress={() => confirmAction("defend")}>
					<View style={[styles.rowColor, { backgroundColor: "#6497F0" }]}>
						<Text style={styles.whiteText}>Defend</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.row}
					onPress={() => confirmAction("surrender")}>
					<View style={[styles.rowColor, { backgroundColor: "#6D946B" }]}>
						<Text style={styles.whiteText}>Surrender</Text>
					</View>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
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
		marginTop: 25,
		flexDirection: "row",
		width: deviceWidth
	},
	playerContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	statsContainer: {
		flex: 2,
		alignItems: "center",
		flexDirection: "column",
	},
	stats: {
		flex: 1,
		width: 130,
		alignItems: "flex-start",
		justifyContent: "center",
		backgroundColor: "rgba(100, 100, 100, 0.4)",
		borderWidth: 3,
		borderRadius: 10,
		padding: 10,
		margin: 10
	},
	statsText: {
		margin: 3,
		fontSize: deviceHeight >= 770 ? 18 : 16,
		fontWeight: "bold",
		color: "white"
	},
	image: {
		flex: 1,
		aspectRatio: 1,
		resizeMode: "cover",
		borderRadius: 10,
		borderWidth: 5,
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