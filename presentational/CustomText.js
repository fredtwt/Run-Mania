import React from "react"
import { StyleSheet, Text } from "react-native"

const CustomText = props => {
  return (
    <Text style={[styles.font, props.style]}>{props.children}</Text>
  )
}

const styles = StyleSheet.create({
  font: {
    color: "#333333",
    fontFamily: "Roboto"
  }
})

export default CustomText