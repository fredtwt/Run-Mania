import "react-native-gesture-handler"
import * as React from 'react'
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import "@react-navigation/drawer"
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RunningLogs from "../screens/RunningLogs";

const MainStackScreen = (props) => {

	const DrawerIcon = () => {
		return (
			<Icon.Button name="menu" size={25} backgroundColor={props.backgroundColor} onPress={props.onPress} />
		)
	}

	const Stack = createStackNavigator()

	return (
		<Stack.Navigator
			initialRouteName={props.initialRouteName}
			screenOptions={{
				gestureEnabled: true,
				headerTintColor: "#fff",
				headerTitleStyle: {
					alignSelf: "center",
					fontWeight: "bold",
					fontSize: 25,
				},
				headerTitleAlign: "center",
				...TransitionPresets.SlideFromRightIOS
			}}>
			<Stack.Screen
				name={props.name}
				component={props.component}
				options={{ headerTitle: props.headerTitle, headerStyle: { backgroundColor: props.backgroundColor }, headerLeft: () => (<DrawerIcon />) }}>
			</Stack.Screen>
		</Stack.Navigator>
	)
}

export default MainStackScreen