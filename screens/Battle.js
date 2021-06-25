import React, { useState, useEffect } from "react"
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

const Battle = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<Text style={styles.whiteText}>BATTLE SCREEN</Text>
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
	whiteText: {
		color: "white"
	}
})

export default Battle