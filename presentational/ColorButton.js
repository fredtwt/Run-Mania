import * as React from "react"
import {Button} from "react-native-elements"

const ColorButton = props => {
  return (
    <Button
      buttonStyle={{
        height: 45,
        borderRadius: 20,
        width: 250,
        marginBottom: 15,
        backgroundColor: props.backgroundColor,
        borderColor: props.borderColor,
        borderWidth: props.borderWidth,
      }}
      icon={props.icon}
      iconRight
      disabled={props.disabled}
      containerStyle={{ margin: 5 }}
      loading={props.loading}
      loadingProps={{ animating: true }}
      loadingStyle={{}}
      onPress={props.onPress}
      title={props.title}
      type={props.type}
      titleStyle={
        [props.titleStyle,{
        marginVertical: 2,
      }]
      }
    />
  )
}

export default ColorButton