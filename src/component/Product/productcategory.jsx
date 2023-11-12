import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { Image, Pressable, View, Text } from "react-native";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/CartReducer";
import { apiURL } from "../../utils/callAPI";
import request from "../../utils/request";


function ProductCategory({ item }) {

    const navigation = useNavigation();

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

        <Pressable style={{
            marginVertical: 25,
            marginHorizontal: 20,
        }}
            onPress={() => navigation.navigate("Detail", {
                price: item?.price,
                name: item?.product_name,
                description: item?.description,
                image: item?.image,
                item: item
            })}
        >
            <Image style={{
                width: 160,
                height: 160,
                resizeMode: "contain"
            }}
                source={{ uri: apiURL + item.image[0] }}
            />
            <Text
                numberOfLines={1}
                style={{
                    width: 160,
                    marginTop: 10
                }}>{item.product_name}</Text>
            <View style={{
                marginTop: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Text style={{
                    fontSize: 15,
                    fontWeight: "bold",
                }}>{item.price.toLocaleString()} đ</Text>
            </View>
            <Pressable style={{
                backgroundColor: "orange",
                padding: 10,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10
            }}
                onPress={() => addItemToCart(item)}
            >
                {addedToCart ? <Text>Đã thêm vào giỏ hàng</Text> : <Text>Thêm vào giỏ hàng</Text>}
            </Pressable>
        </Pressable>

    )
}

export default ProductCategory;
