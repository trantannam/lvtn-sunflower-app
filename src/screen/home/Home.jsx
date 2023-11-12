import * as React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { Pressable, ScrollView, TextInput, View, Text } from "react-native";
import { useState } from "react";
import slider1 from "./../../img/slider/slider1.jpg";
import slider2 from "./../../img/slider/slider2.jpg";
import slider3 from "./../../img/slider/slider3.jpg";
import slider4 from "./../../img/slider/slider4.jpg";
import slider5 from "./../../img/slider/slider5.jpg";
import ProductCategory from "../../component/Product/productcategory";
import request from "../../utils/request";
import HeaderShow from "../../component/header/search";
import { useSelector } from "react-redux";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BottomModal, ModalContent, SlideAnimation } from "react-native-modals";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { UserType } from "../../../UseContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";



const HomeScreen = ({ navigation }) => {
    const [image, setImage] = useState([
        slider1,
        slider2,
        slider3,
        slider4,
        slider5
    ])
    const { userId, setUserId } = useContext(UserType);

    const [productList, setProductList] = useState([]);
    const [address, setAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState("");

    const cart = useSelector(state => state.cart.cart);

    const [modalVisible, setModalVisible] = useState(false);

    // const navigation = useNavigation();

    const getAllProduct = async () => {
        await request.get('/product')
            .then((res) => {
                setProductList(res.data.data)
            })
    }

    const getAddressById = async () => {
        const res = await request.post("/delivery/getAddress", { customerID: userId })
        const addresses = res.data.data.division;
        if (res.data.success) {
            setAddress(addresses);
        }
    }

    React.useEffect(() => {
        if (userId) {
            getAddressById();
        }
    }, [userId, modalVisible])

    React.useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem("authToken");
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.id;
            setUserId(userId);
        }
        fetchUser();
    }, []);

    React.useEffect(() => {
        getAllProduct();
    }, [])
    return (
        <>
            <View style={{ alignItems: 'center' }}>
                <View style={{
                    height: 50,
                    width: "100%",
                    backgroundColor: "orange",
                }} />
                <ScrollView>
                    <HeaderShow />
                    <Pressable
                        onPress={() => setModalVisible(!modalVisible)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                            padding: 10,
                            backgroundColor: "orange"
                        }}>
                        <Ionicons name="location-outline" size={24} />
                        <Pressable>
                            {
                                selectedAddress
                                    ? <Text style={{ fontSize: 13, fontWeight: "500" }}>Vận chuyển đến {selectedAddress?.describe} - {selectedAddress?.province}</Text>
                                    : <Text style={{ fontSize: 13, fontWeight: "500" }}>Thêm địa chỉ vận chuyển</Text>
                            }
                        </Pressable>
                        <Ionicons name="chevron-down-outline" size={20} />
                    </Pressable>
                    <View style={{
                        backgroundColor: "orange",
                        paddingBottom: 5,
                        borderBottomLeftRadius: 8,
                        borderBottomRightRadius: 8
                    }}>
                        <SliderBox
                            images={image}
                            autoplay
                            circleLoop
                            sliderBoxHeight={200}
                            dotColor="#13274f"
                            inactiveDotColor="#90A4AE"
                            onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                            paginationBoxVerticalPadding={20}
                            ImageComponentStyle={{ borderRadius: 15, width: '97%', marginTop: 5 }}
                        />
                    </View>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        marginTop: 10,
                        marginLeft: 5
                    }}>Danh sách sản phẩm</Text>

                    <View style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flexWrap: "wrap"
                    }}>

                        {productList.map((item, index) =>
                            <ProductCategory item={item} key={index} />
                        )}
                    </View>
                    <Text style={{
                        height: 1,
                        borderColor: "#D0D0D0",
                        borderWidth: 2,
                        marginTop: 15
                    }} />
                </ScrollView>
            </View>
            <BottomModal
                onBackdropPress={() => setModalVisible(!modalVisible)}
                swipeDirection={["up", "down"]}
                swipeThreshold={200}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: "bottom"
                    })
                }
                visible={modalVisible}
                onHardwareBackPress={() => setModalVisible(!modalVisible)}
                onTouchOutside={() => setModalVisible(!modalVisible)}
            >
                <ModalContent style={{
                    width: "100%",
                    height: 400
                }}>
                    <View style={{
                        marginBottom: 8
                    }}>
                        <Text>Chọn địa chỉ giao hàng</Text>
                        <Text style={{
                            marginTop: 5,
                            fontSize: 16,
                            color: "gray"
                        }}>Chọn địa chỉ để xem sản phẩm và phương thức vận chuyển</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {address.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    setSelectedAddress(item)
                                }}
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderColor: "#D0D0D0",
                                    marginTop: 10,
                                    borderWidth: 1,
                                    padding: 10,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 15,
                                    backgroundColor: selectedAddress === item ? "#FBCEB1" : "white"
                                }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.type}</Text>
                                    <Ionicons name="location" size={20} color={"red"}></Ionicons>
                                </View>
                                <Text numberOfLines={1} style={{ fontSize: 15, color: "#181818" }}>{item.describe}</Text>
                                <Text numberOfLines={1} style={{ fontSize: 15, color: "#181818" }}>{`${item.ward}, ${item.district}, ${item.province}`}</Text>
                            </Pressable>))}
                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate("Address")
                            }}
                            style={{
                                width: 140,
                                height: 140,
                                borderColor: "#D0D0D0",
                                marginTop: 10,
                                borderWidth: 1,
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                            <Text style={{
                                textAlign: "center",
                                color: "#0066b2",
                                fontWeight: 500
                            }}>Thêm địa chỉ hoặc chọn địa chỉ đã có sẵn</Text>
                        </Pressable>
                    </ScrollView>
                </ModalContent>

            </BottomModal>
        </>
    );
};

export default HomeScreen;
