import * as React from 'react'
import { TouchableOpacity, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Btn({ title, onPress, icon, color }) {
    return (
        <TouchableOpacity onPress={onPress} style={{
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        }}>
            <Ionicons size={40} name={icon} color={color ? color : '#000'} />
            <Text style={{ fontSize: 20, fontWeight:700, paddingLeft:10}}>{title}</Text>
        </TouchableOpacity>
    )
}