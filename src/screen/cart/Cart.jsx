import { Pressable, ScrollView, View, Text, Image } from "react-native"
import { useDispatch, useSelector } from "react-redux";
import HeaderShow from "../../component/header/search";
import { apiURL } from "../../utils/callAPI";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { decrementQuantity, incementQuantity, removeFromCart } from "../../redux/CartReducer";
import { useNavigation } from "@react-navigation/native";


const CartScreen = () => {
    const cart = useSelector(state => state.cart.cart)
    const total = cart?.map(item => item.price * item.quantity).reduce((curr, prev) => curr + prev, 0)
    const dispatch = useDispatch();
    const handlePlus = (item) => {
        dispatch(incementQuantity(item))
    }
    const handleMinus = (item) => {
        dispatch(decrementQuantity(item))
    }
    const handleDelete = (item) => {
        dispatch(removeFromCart(item))
    }

    const navigation = useNavigation();
    return (
        <ScrollView>
            <View style={{
                height: 50,
                width: "100%",
                backgroundColor: "orange",
            }} />
            <HeaderShow />

            <View style={{
                padding: 10,
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 400
                }}>Tổng tiền: </Text>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold"
                }}>{total.toLocaleString()} đ</Text>
            </View >
            <Text style={{ marginHorizontal: 10 }}>Chi tiết giỏ hàng</Text>
            <Pressable
            
            onPress={()=>navigation.navigate("Confirm")}
            style={{
                backgroundColor: "#ffc72c",
                padding: 10,
                borderRadius: 5,
                justifyContent: "center",
                marginHorizontal: 10,
                marginTop: 10
            }}>
                <Text>Mua ngay ({cart.length}) sản phẩm</Text>
            </Pressable>
            <Text style={{ height: 1, borderColor: "#d0d0d0", borderWidth: 1, marginTop: 16 }} />
            <View style={{ marginHorizontal: 10 }}>
                {cart?.map((item, index) => (
                    <View style={{
                        backgroundColor: "white",
                        marginVertical: 10,
                        borderBottomColor: "#f0f0f0",
                        borderWidth: 2,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                        borderRightWidth: 0
                    }}
                        key={index}
                    >
                        <Pressable style={{
                            marginVertical: 10,
                            flexDirection: "row",
                        }}>
                            <View>
                                <Image
                                    style={{ width: 140, height: 140, resizeMode: "contain" }}
                                    source={{ uri: apiURL + item?.image[0] }}
                                />
                            </View>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={{ width: 150, marginTop: 10, fontWeight: "bold", }}>{item?.product_name}</Text>
                                <Text numberOfLines={2} style={{ width: 150, marginTop: 10, }}>{item?.description}</Text>
                                <Text style={{ width: 150, marginTop: 10, fontWeight: "bold", }}>{item?.price.toLocaleString()} đ</Text>
                            </View>
                        </Pressable>
                        <Pressable style={{
                            marginTop: 15,
                            marginBottom: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 7
                            }}>
                                {item?.quantity > 1
                                    ? <Pressable
                                        onPress={() => handleMinus(item)}
                                        style={{
                                            backgroundColor: "#d8d8d8",
                                            padding: 7,
                                            borderTopLeftRadius: 6,
                                            borderBottomLeftRadius: 6
                                        }}>
                                        <Ionicons name="remove-outline" size={24} />
                                    </Pressable>
                                    : <Pressable
                                        onPress={() => handleDelete(item)}
                                        style={{
                                            backgroundColor: "#d8d8d8",
                                            padding: 7,
                                            borderTopLeftRadius: 6,
                                            borderBottomLeftRadius: 6
                                        }}>
                                        <Ionicons name="trash-outline" size={24} />
                                    </Pressable>
                                }
                                <Pressable style={{
                                    backgroundColor: "white",
                                    padding: 7,
                                    paddingHorizontal: 20
                                }}>
                                    <Text>{item.quantity}</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => handlePlus(item)}
                                    style={{
                                        backgroundColor: "#d8d8d8",
                                        padding: 7,
                                        borderTopRightRadius: 6,
                                        borderBottomRightRadius: 6
                                    }}>
                                    <Ionicons name="add-outline" size={24} />
                                </Pressable>
                            </View>
                            <Pressable
                                onPress={() => handleDelete(item)}
                                style={{
                                    backgroundColor: "white",
                                    padding: 7,
                                    paddingHorizontal: 8,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    borderColor: "#c0c0c0",
                                    borderWidth: 0.6
                                }}>
                                <Text>Xóa khỏi giỏ hàng</Text>
                            </Pressable>
                        </Pressable>
                    </View>

                ))}
            </View>

        </ScrollView>

    )
}

export default CartScreen;