import React, { useEffect, useState } from "react"
import { StyleSheet, ScrollView, KeyboardAvoidingView, View, Text, StatusBar, Keyboard, Alert, SafeAreaView } from "react-native"
import DropDownPicker from "react-native-dropdown-picker" //npm install react-native-dropdown-picker
import { CommonActions } from "@react-navigation/routers"

import BlueButton from "../presentational/BlueButton"
import InputBox from "../presentational/InputBox"

import * as Authentication from "../api/auth"
import * as Database from "../api/db"

const Signup = ({ navigation }) => {
	const [username, setUserName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [height, setHeight] = useState(null)
	const [weight, setWeight] = useState(null)
	const [genderOpen, setGenderOpen] = useState(false)
	const [genderValue, setGenderValue] = useState(null)
	const [gender, setGender] = useState([
		{ label: "Male", value: "Male" },
		{ label: "Female", value: "Female" }
	])
	const [jobOpen, setJobOpen] = useState(false)
	const [jobValue, setJobValue] = useState(null)
	const [job, setJob] = useState([
		{ label: "Warrior (Well-spread out stats)", value: "Warrior" },
		{ label: "Rogue (High EVD & SPD)", value: "Rogue" },
		{ label: "Archer (High ATK & SPD)", value: "Archer" },
	])
	const [confirmationPassword, setConfirmationPassword] = useState("")
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isConfirmationPasswordVisible, setIsConfirmationPasswordVisible] = useState(false)
	const [isRegisterLoading, setIsRegisterLoading] = useState(false)
	const [users, setUsers] = useState([])

	useEffect(() => {
		let mounted = true
		Database.db.ref("users/").on("value", snapshot => {
			if (mounted) {
				setUsers([])
				snapshot.forEach(user => {
					setUsers(prevData => [...prevData, user.val().username])
				})
			}
		})

		return () => {
			mounted = false
		}
	}, [])

	const createAccount = () => {
		Authentication.createAccount(
			{ username, email, password },
			(user) => {
				navigation.dispatch(CommonActions.reset({
					index: 0,
					routes: [{
						name: "Login",
					}]
				}))
				Database.createUser({
					id: user.uid,
					username: username,
					email: email,
					gender: genderValue,
					height: height,
					weight: weight,
					job: jobValue,
				}, () => { }, (error) => alert(error))
				return Alert.alert(null, "Account has been created successfully!")
			},
			(error) => {
				setIsRegisterLoading(false)
				return Alert.alert(null, error.message)
			}
		)
	}

	const handleRegister = () => {
		Keyboard.dismiss()
		setIsRegisterLoading(true)

		if (username != "" && checkUsername(username)) {
			if (checkEmail() && checkPassword() && checkConfirmationPassword() && checkNumeric(height) && checkNumeric(weight) && genderValue != null && jobValue != null) {
				createAccount()
			} else {
				setIsRegisterLoading(false)
				return Alert.alert("Unsuccessful", "Missing required fields, please try again!")
			}
		} else {
			setIsRegisterLoading(false)
			return Alert.alert("Unsuccessful", "Username has been taken, please use another username!")
		}
	}

	const checkUsername = (username) => {
		let result = true 
		users.forEach(user => {
			if (username == user) {
				result = false
			}
		})
		return result
	}

	const checkEmail = () => {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
		return email !== null && reg.test(email)
	}

	const checkNumeric = (val) => {
		let reg = /^[0-9]+$/
		return reg.test(val)
	}

	const checkPassword = () => {
		return password != null && password.length > 7
	}

	const checkConfirmationPassword = () => {
		return password == confirmationPassword
	}

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar backgroundColor="#2E2E2E" barStyle="light-content" />
			<View style={styles.headerContainer}>
				<Text style={styles.text_header}>Registration</Text>
			</View>
			<KeyboardAvoidingView style={styles.inputContainer}>
				<ScrollView
					persistentScrollbar={true}>
					<InputBox
						placeholder="Enter email"
						label="Email:"
						leftIcon="email"
						value={email}
						onChangeText={(val) => setEmail(val)}
						rightIcon={email != "" ? checkEmail() ? "check-circle" : "close-circle" : ""}
						rightIconColor={email != "" ? checkEmail() ? "#0BF73D" : "#FF4747" : "#FFF"}
						errorMessage={email != "" ? checkEmail() ? "" : "Invalid Email Address!" : ""} />
					<InputBox
						placeholder="Enter username"
						label="Username:"
						leftIcon="account"
						value={username}
						onChangeText={(val) => setUserName(val)} />
					<InputBox
						placeholder="Enter password"
						label="Password:"
						leftIcon="lock"
						secureTextEntry={!isPasswordVisible}
						onPress={() => setIsPasswordVisible((state) => !state)}
						onChangeText={(val) => setPassword(val)}
						rightIcon={isPasswordVisible ? "eye-off" : "eye"}
						rightIconColor="grey"
						errorMessage={!checkPassword() && password != "" ? "Password has to be at least 8 characters long!" : ""}
					/>
					<InputBox
						placeholder="Confirm password"
						label="Re-enter Password:"
						secureTextEntry={!isConfirmationPasswordVisible}
						onPress={() => setIsConfirmationPasswordVisible((state) => !state)}
						leftIcon="lock"
						value={confirmationPassword}
						onChangeText={(val) => setConfirmationPassword(val)}
						errorMessage={!checkConfirmationPassword() && confirmationPassword != "" ? "Passwords do not match!" : ""}
						rightIcon={isConfirmationPasswordVisible ? "eye-off" : "eye"}
						rightIconColor="grey" />
					<InputBox
						placeholder="Enter your weight (kg)"
						label="Weight:"
						leftIcon="weight-kilogram"
						value={weight}
						onChangeText={(val) => setWeight(val)}
						errorMessage={weight != null ? checkNumeric(weight) ? "" : "Only numeric values allowed!" : ""} />
					<InputBox
						placeholder="Enter your height (cm)"
						label="Height:"
						leftIcon="human-male-height-variant"
						value={height}
						onChangeText={(val) => setHeight(val)}
						errorMessage={height != null ? checkNumeric(height) ? "" : "Only numeric values allowed!" : ""} />
					<View style={styles.dropDownContainer}>
						<DropDownPicker
							placeholder="Select your gender"
							containerStyle={{
								marginLeft: 5,
								width: "98%"
							}}
							dropDownDirection="TOP"
							open={genderOpen}
							value={genderValue}
							items={gender}
							setOpen={setGenderOpen}
							setValue={setGenderValue}
							setItems={setGender} />
						<DropDownPicker
							placeholder="Select your avatar's job class"
							containerStyle={{
								marginLeft: 5,
								marginTop: 20,
								width: "98%"
							}}
							open={jobOpen}
							value={jobValue}
							items={job}
							setOpen={setJobOpen}
							setValue={setJobValue}
							setItems={setJob} />
						<View style={styles.buttonContainer}>
							<BlueButton
								title="Create Account"
								type="solid"
								onPress={handleRegister}
								loading={isRegisterLoading}
								disabled={isRegisterLoading} />
							<BlueButton
								title="Have an account already?"
								type="outline"
								onPress={() => navigation.navigate("Login")} />
						</View>
					</View>
						</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		backgroundColor: "#2E2E2E"
	},
	headerContainer: {
		flex: 0.5,
		justifyContent: "flex-end",
		margin: 20,
	},
	inputContainer: {
		flex: 5,
		alignSelf: "center",
		justifyContent: "center",
		width: "90%"
	},
	dropDownContainer: {
		flex: 3,
		alignSelf: "center",
		justifyContent: "center",
		width: "90%"
	},
	buttonContainer: {
		alignItems: "center",
		justifyContent: "flex-end",
		marginTop: 10,
	},
	text_header: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 40
	},
})

export default Signup