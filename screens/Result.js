import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { CommonActions } from "@react-navigation/native"

import color from "../constants/color"
import ColorButton from "../presentational/ColorButton"

const Result = ({ navigation }) => {
	const goHome = () => {
		navigation.dispatch(CommonActions.reset({
			index: 0,
			routes: [{
				name: "Main",
				params: {
				}
			}]
		}))
	}
	return (
		<View style={styles.container}>
			<Text>MATCH OVER</Text>
			<ColorButton
				title="Go home"
				backgroundColor="green"
				width={200}
				height={100}
				onPress={() => goHome()} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: color.background
	}
})

export default Result