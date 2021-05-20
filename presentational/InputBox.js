import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const InputBox = props => {
  return (
    <Input
      secureTextEntry={props.secureTextEntry}
      autoCapitalize="none"
      containerStyle={{}}
      disabledInputStyle={{ background: "#ddd" }}
      inputContainerStyle={{}}
      errorStyle={{}}
      errorProps={{}}
      inputStyle={{ color: "white" }}
      label={props.label}
      labelStyle={{ color: "white" }}
      labelProps={{}}
      leftIcon={<Icon name={props.leftIcon} size={20} color={"#D3D7D8"} />}
      leftIconContainerStyle={{}}
      rightIcon={
        <TouchableOpacity onPress={props.onPress}>
          <Icon name={props.rightIcon} size={20} color={"grey"} />
        </TouchableOpacity>
      }
      rightIconContainerStyle={{}}
      placeholder={props.placeholder}
    />
  );
}

export default InputBox