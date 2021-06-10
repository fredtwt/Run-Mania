import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const InputBox = props => {
  return (
    <Input
      returnKeyType="next"
      value={props.value}
      onChangeText={props.onChangeText}
      secureTextEntry={props.secureTextEntry}
      autoCapitalize="none"
      containerStyle={{}}
      disabledInputStyle={{ background: "#ddd" }}
      inputContainerStyle={{
        height: 40
      }}
      errorMessage={props.errorMessage}
      errorStyle={{color: "#FF4747"}}
      errorProps={{}}
      inputStyle={{ color: "white" }}
      label={props.label} 
      labelStyle={{ color: "white" }}
      labelProps={{}}
      leftIcon={<Icon name={props.leftIcon} size={20} color={"#D3D7D8"} />}
      leftIconContainerStyle={{}}
      rightIcon={
        <Icon name={props.rightIcon} size={20} color={props.rightIconColor} onPress={props.onPress} />
      }
      rightIconContainerStyle={{}}
      placeholder={props.placeholder}
    />
  )
}

export default InputBox