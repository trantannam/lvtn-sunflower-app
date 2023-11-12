import * as React from "react";
import { Dimensions, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native"
import { apiURL } from "../../utils/callAPI";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/CartReducer";
import { useState } from "react";
import HeaderShow from "../../component/header/search";

const DetailScreen = () => {

    const product = useRoute();
    const { width } = Dimensions.get('window');
    const height = (width * 100) / 100;
    const [addedToCart, setAddedToCart] = useState(false);
    const dispatch = useDispatch();

    const addItemToCart = (item) => {
        setAddedToCart(true);
        dispatch(addToCart(item));
        setTimeout(() => {
            setAddedToCart(false);
        }, 60000)
    }

    return (
        <ScrollView style={{
            flex: 1,
            backgroundColor: "white"
        }}
            showsVerticalScrollIndicator={false}
        >
            <View style={{
                height: 50,
                width: "100%",
                backgroundColor: "orange",
            }} />
            <HeaderShow />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {product.params.image.map((item, index) => (
                    <ImageBackground style={{
                        width, height, marginTop: 25, resizeMode: "contain"
                    }} source={{ uri: apiURL + item }} key={index}>
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "#E0E0E0",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                            marginTop: "auto",
                            marginLeft: 10,
                            marginBottom: 20,
                        }}>
                            <Ionicons name="heart-outline" size={24} color={"black"} />
                        </View>
                    </ImageBackground>
                ))}
            </ScrollView>
            <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: "500" }}>{product.params?.name}</Text>
                <Text style={{ fontSize: 13, paddingLeft: 10, paddingTop: 10, fontWeight: "300" }}>{product.params?.description}</Text>
                <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 6 }}>{product.params?.price}</Text>
            </View>
            <Text style={{ height: 1, borderColor: "#D0D0D0", borderWidth: 1 }} />
            <Pressable
                onPress={() => addItemToCart(product.params?.item)}
                style={{
                    backgroundColor: "#FFC72C",
                    padding: 10,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 10,
                    marginVertical: 10
                }}>
                {addedToCart ? <Text>Đã thêm vào giỏ hàng</Text> : <Text>Thêm vào giỏ hàng</Text>}

            </Pressable>
            <Pressable
                style={{
                    backgroundColor: "#FFAC1C",
                    padding: 10,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 10,
                    marginVertical: 10
                }}>
                <Text>Mua ngay</Text>
            </Pressable>
        </ScrollView>
    )
};

export default DetailScreen;