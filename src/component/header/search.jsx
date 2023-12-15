import { useNavigation } from "@react-navigation/native";
import { View, Pressable, TextInput, Text } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from "react-redux";


const HeaderShow = () => {

    const cart = useSelector(state => state.cart.cart)
    const navigation = useNavigation();

    return (
        <View style={{
            backgroundColor: "orange",
            alignItems: "center",
            flexDirection: "row",
            paddingVertical: 10
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
            onPress={()=>navigation.navigate("Giỏ hàng")}
                name="cart-outline"
                size={30}
                style={{
                    marginLeft: 5,
                    marginRight: 8,
                    color: "white"
                }}
            />
            {cart.length === 0
                ? ''
                : <Text style={{
                    position: "absolute",
                    right: 6,
                    top: 10,
                    width: 16,
                    height: 16,
                    backgroundColor: "red",
                    color: "white",
                    textAlign: 'center',
                    fontSize: 12,
                    borderRadius: 8
                }}>{cart.length}</Text>
            }

        </View>
    )
}

export default HeaderShow;