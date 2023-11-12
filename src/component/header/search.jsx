import {View, Pressable, TextInput} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';


const HeaderShow = () => {
    return (
        <View style={{
            backgroundColor: "orange",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical:10
        }}>
            <Pressable style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 7,
                gap: 10,
                backgroundColor: "white",
                borderRadius: 3,
                height: 38,
                flex: 1
            }}>
                <Ionicons
                    name="search-outline"
                    size={22}
                    style={{ paddingLeft: 10 }}
                />
                <TextInput placeholder="Tìm kiếm" />
            </Pressable>
            <Ionicons
                name="cart-outline"
                size={22}
                style={{
                    marginLeft: 5,
                    marginRight: 8,
                    color: "white"
                }}
            />

        </View>
    )
}

export default HeaderShow;