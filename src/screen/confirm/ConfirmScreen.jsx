import { useContext, useEffect, useState } from "react"
import { Alert, Pressable, Text, View, ScrollView, TextInput } from "react-native"
import { UserType } from "../../../UseContext"
import HeaderShow from "../../component/header/search"
import request from "../../utils/request"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import WebView from "react-native-webview"
import { useNavigation } from "@react-navigation/native"
import { cleanCart } from "../../redux/CartReducer"

const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;

const Confirm = () => {
    const step = [
        { title: "TT người nhận", content: "Thông tin người nhận" },
        { title: "Địa chỉ", content: "Địa điểm nhận hàng" },
        { title: "Vận chuyển", content: "Phương thức vận chuyển" },
        { title: "Thanh toán", content: "Phương thức thanh toán" },
        { title: "Đặt hàng", content: "Đơn hàng" },
    ]
    const { userId } = useContext(UserType);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    var regex = /[?&]([^=#]+)=([^&#]*)/g,
        params = {},
        match;

    const [currentStep, setCurrentStep] = useState(0);
    const [address, setAddress] = useState([]);
    const [deliveryOption, setDeliveryOption] = useState(false);
    const [paymentOption, setPaymentOption] = useState('')
    const [urlVnpay, setUrlVnpay] = useState("");
    const [returnUrl, setReturnUrl] = useState("");
    const [userRec, setUserRec] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState("")
    const [receiver, setReceiver] = useState({
        name: "",
        phone: "",
        ortherPhone: "",
        gender: false
    })

    const getAddressById = async () => {
        const res = await request.post("/delivery/getAddress", { customerID: userId })
        const addresses = res.data.data.division;
        if (res.data.success) {
            setAddress(addresses);
        }
    }

    const cart = useSelector(state => state.cart.cart)
    const total = cart?.map(item => item.price * item.quantity).reduce((curr, prev) => curr + prev, 0)

    const createUrlVnpay = async () => {
        await request.post("/payment/create-url", {
            total: total,
            bankCode: "NCB",
            description: "thanh toan hoa don"
        }).then(res => setUrlVnpay(res.data.data))
        console.log("url", urlVnpay)
    }

    const tranCodeCOD = () => {
        let time = new Date();
        return time.getTime().toString() + Math.floor(Math.random() * 100);
    }

    // console.log("address",`${selectedAddress.describe}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`)
    const handlePlaceOrder = () => {
        console.log("cart", cart)
        if (paymentOption === "cod") {
            request.post("/purchase-order/create", {
                tranCode: tranCodeCOD(),
                customer: userId,
                receiveAddress: `${selectedAddress.describe}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`,
                receiver: {
                    name: receiver.name,
                    gender: receiver.gender,
                    phone: receiver.phone,
                    ortherphone: receiver.ortherPhone
                },
                totalEstimate: total,
                products: cart || [],
                deliveryStatus: "waiting for progressing",
                paymentStatus: "cod"
            }).then(
                res => {
                    if (res.data.success) {
                        return (
                            Alert.alert("Thông báo", "Đặt hàng thành công", [
                                {
                                    text: "OK",
                                    onPress: () => { navigation.navigate("Trang chủ"), dispatch(cleanCart()) }
                                }
                            ])
                        )
                    }
                }
            )

        } else if (paymentOption === "vnpay") {
            return (
                Alert.alert("Thông báo", "Xác nhận thanh toán VnPay", [
                    {
                        text: "Hủy",
                        onPress: () => console.log("Cancel payment")
                    },
                    {
                        text: "Đồng ý",
                        onPress: () => createUrlVnpay()
                    }
                ])
            )
        }
    }

    const receivedUrlVnpayReturn = (data) => {
        while (match = regex.exec(data)) {
            params[match[1]] = match[2];
        }
        if (params["vnp_ResponseCode"] === "00") {
            setUrlVnpay('');
            request.post("/purchase-order/create", {
                tranCode: tranCodeCOD(),
                customer: userId,
                receiveAddress: `${selectedAddress.describe}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.province}`,
                receiver: {
                    name: receiver.name,
                    gender: receiver.gender,
                    phone: receiver.phone,
                    ortherphone: receiver.ortherPhone
                },
                totalEstimate: total,
                products: cart || [],
                deliveryStatus: "waiting for progressing",
                paymentStatus: "paid"
            }).then(
                res => {
                    if (res.data.success) {
                        return (
                            Alert.alert("Thông báo", "Đặt hàng thành công", [
                                {
                                    text: "OK",
                                    onPress: () => { navigation.navigate("Trang chủ"), dispatch(cleanCart()) }
                                },

                            ])
                        )
                    }
                }
            )
        }
    }

    useEffect(() => {
        if (userRec) {
            request.get(`/customer/${userId}`)
                .then(res => {
                    setReceiver({
                        name: res.data.user.customer_name,
                        phone: res.data.user.phone_number,
                        ortherPhone: "",
                        gender: true
                    })
                })
        } else {
            setReceiver({
                name: "",
                phone: "",
                ortherPhone: "",
                gender: false
            })
        }
    }, [userRec])

    useEffect(() => {
        getAddressById();
    }, [])

    return (
        <View>
            <View style={{
                height: 50,
                width: "100%",
                backgroundColor: "orange",
            }} />
            <HeaderShow />
            <ScrollView>
                {urlVnpay !== ""
                    ?
                    <View style={{ flex: 1, width: "100%", height: 700 }}>
                        <WebView
                            source={{ uri: urlVnpay }}
                            injectedJavaScript={runFirst}
                            setSupportMultipleWindows={false}
                            onMessage={(e) => receivedUrlVnpayReturn(e.nativeEvent.url)}
                        />
                    </View>
                    :
                    <View>
                        <View style={{
                            flexDirection: "row",
                            alignItems: 'center',
                            marginBottom: 30,
                            justifyContent: "space-around",
                            paddingTop: 20,
                            paddingHorizontal: 20
                        }}>
                            {
                                step?.map((step, index) => (
                                    <View key={index} style={{ justifyContent: "center", alignItems: "center" }}>
                                        <View style={[{
                                            width: 30,
                                            height: 30,
                                            borderRadius: 15,
                                            backgroundColor: index < currentStep ? 'green' : '#ccc',
                                            justifyContent: 'center',
                                            alignItems: "center"
                                        }]}
                                        >
                                            {index < currentStep
                                                ? <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>{" "}&#10003;</Text>
                                                : <Text style={{ fontSize: 16, fontWeight: "bold", color: "white" }}>{index + 1}</Text>}
                                        </View>
                                        <Text style={{
                                            alignItems: "center",
                                            marginTop: 8
                                        }}>{step.title}</Text>
                                    </View>
                                ))
                            }
                        </View>
                        {currentStep == 0 && (
                            <View style={{ marginHorizontal: 20 }}>

                                <View style={{ flexDirection: "row" }}>
                                    {userRec
                                        ? <Ionicons onPress={() => setUserRec(!userRec)} size={24} name="checkbox-outline" color={"green"} />
                                        : <Ionicons onPress={() => setUserRec(!userRec)} size={24} name="square-outline" />
                                    }
                                    <Text style={{
                                        alignItems: "center",
                                        marginTop: 4,
                                        fontSize: 16,
                                        marginLeft: 6
                                    }} >Tôi là người nhận hàng</Text>
                                </View>

                                <View style={{
                                    gap: 2,
                                    marginVertical: 10
                                }}>
                                    <Text style={{ fontSize: 16 }}>Họ tên người nhận</Text>
                                    <TextInput
                                        value={receiver.name}
                                        onChangeText={(e) => setReceiver({ ...receiver, name: e })}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#D0D0D0",
                                            padding: 5,
                                            marginTop: 10
                                        }}
                                        placeholder="Nhập họ và tên"
                                    />
                                </View>
                                <View style={{
                                    gap: 2,
                                    marginVertical: 10
                                }}>
                                    <Text style={{ fontSize: 16 }}>Số điện thoại</Text>
                                    <TextInput
                                        value={receiver.phone}
                                        onChangeText={(e) => setReceiver({ ...receiver, phone: e })}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#D0D0D0",
                                            padding: 5,
                                            marginTop: 10
                                        }}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </View>
                                <View style={{
                                    gap: 2,
                                    marginVertical: 10
                                }}>
                                    <Text style={{ fontSize: 16 }}>Số khác</Text>
                                    <TextInput
                                        value={receiver.ortherPhone}
                                        onChangeText={(e) => setReceiver({ ...receiver, ortherPhone: e })}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: "#D0D0D0",
                                            padding: 5,
                                            marginTop: 10
                                        }}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    justifyContent: "space-around",
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: "center",
                                    }}>
                                        {receiver.gender
                                            ? <Ionicons
                                                color={"grey"}
                                                size={24}
                                                name="radio-button-on-outline"
                                            />
                                            : <Ionicons
                                                onPress={() => setReceiver({ ...receiver, gender: !receiver.gender })}
                                                color={"grey"}
                                                size={24}
                                                name="radio-button-off-outline"
                                            />
                                        }
                                        <Text style={{}}>
                                            Nam
                                        </Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: "center"
                                    }}>
                                        {!receiver.gender
                                            ? <Ionicons
                                                color={"grey"}
                                                size={24}
                                                name="radio-button-on-outline"
                                            />
                                            : <Ionicons
                                                onPress={() => setReceiver({ ...receiver, gender: !receiver.gender })}
                                                color={"grey"}
                                                size={24}
                                                name="radio-button-off-outline"
                                            />
                                        }
                                        <Text style={{}}>
                                            Nữ
                                        </Text>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() => setCurrentStep(1)}
                                    style={{
                                        backgroundColor: "orange",
                                        padding: 10,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10
                                    }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 16
                                    }}>Tiếp tục</Text>
                                </Pressable>
                            </View>
                        )}
                        {currentStep == 1 && (
                            <View >
                                <Text style={{
                                    fontWeight: "bold",
                                    paddingLeft: 20,
                                    fontSize: 18
                                }}>Chọn địa chỉ nhận hàng</Text>
                                <Pressable >
                                    {address?.map((item, index) => (
                                        <Pressable
                                            key={index}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: "#D0D0D0",
                                                padding: 10,
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 5,
                                                paddingBottom: 10,
                                                marginHorizontal: 10,
                                                marginTop: 10
                                            }}>
                                            {selectedAddress && selectedAddress._id === item?._id
                                                ? <Ionicons color={"grey"} size={24} name="radio-button-on-outline" />
                                                : <Ionicons onPress={() => setSelectedAddress(item)} color={"grey"} size={24} name="radio-button-off-outline" />
                                            }
                                            <View style={{ marginLeft: 6 }}>
                                                <View style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 3
                                                }}>
                                                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.type}</Text>
                                                    <Ionicons name="location" size={20} color={"red"}></Ionicons>
                                                </View>
                                                <Text style={{ fontSize: 15, color: "#181818" }}>{item.describe}</Text>
                                                <Text style={{ fontSize: 15, color: "#181818" }}>{`${item.ward}, ${item.district}, ${item.province}`}</Text>
                                                <View style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 10,
                                                    marginTop: 7
                                                }}>
                                                    <Pressable style={{
                                                        backgroundColor: "#F5F5F5",
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 6,
                                                        borderRadius: 5,
                                                        borderWidth: 0.9,
                                                        borderColor: "#D0D0D0"
                                                    }}>
                                                        <Text>Chỉnh sửa</Text>
                                                    </Pressable>
                                                    <Pressable style={{
                                                        backgroundColor: "#F5F5F5",
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 6,
                                                        borderRadius: 5,
                                                        borderWidth: 0.9,
                                                        borderColor: "#D0D0D0"
                                                    }}>
                                                        <Text>Xóa</Text>
                                                    </Pressable>
                                                    <Pressable style={{
                                                        backgroundColor: "#F5F5F5",
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 6,
                                                        borderRadius: 5,
                                                        borderWidth: 0.9,
                                                        borderColor: "#D0D0D0"
                                                    }}>
                                                        <Text>Chọn làm mặc định</Text>
                                                    </Pressable>
                                                </View>
                                                <View>
                                                    {selectedAddress && selectedAddress._id === item?._id && (
                                                        <Pressable
                                                            onPress={() => setCurrentStep(2)}
                                                            style={{
                                                                backgroundColor: "orange",
                                                                padding: 10,
                                                                borderRadius: 20,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                marginTop: 10
                                                            }}>
                                                            <Text style={{
                                                                textAlign: 'center',
                                                                color: 'white',
                                                                fontSize: 16
                                                            }}>Chọn làm địa chỉ nhận hàng</Text>
                                                        </Pressable>
                                                    )}
                                                </View>
                                            </View>
                                        </Pressable>
                                    ))}
                                </Pressable>
                            </View>
                        )}
                        {currentStep == 2 && (
                            <View style={{ marginHorizontal: 20 }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontSize: 18
                                }}>Phương thức vận chuyển</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    padding: 8,
                                    gap: 7,
                                    borderColor: "#d0d0d0",
                                    borderWidth: 1,
                                    marginTop: 10
                                }}>
                                    {deliveryOption
                                        ? <Ionicons
                                            color={"grey"}
                                            size={24}
                                            name="radio-button-on-outline"
                                        />
                                        : <Ionicons
                                            onPress={() => setDeliveryOption(!deliveryOption)}
                                            color={"grey"}
                                            size={24}
                                            name="radio-button-off-outline"
                                        />
                                    }
                                    <Text style={{ flex: 1 }}>
                                        <Text style={{ color: "green", fontWeight: '500' }}>
                                            Nhận hàng trong 2h
                                        </Text>{' '}
                                        - Miễn phí vận chuyển
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => setCurrentStep(3)}
                                    style={{
                                        backgroundColor: "orange",
                                        padding: 10,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10
                                    }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 16
                                    }}>Tiếp tục</Text>
                                </Pressable>
                            </View>
                        )}
                        {currentStep == 3 && (
                            <View style={{ marginHorizontal: 20 }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontSize: 18
                                }}>Phương thức thanh toán</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    padding: 8,
                                    gap: 7,
                                    borderColor: "#d0d0d0",
                                    borderWidth: 1,
                                    marginTop: 10
                                }}>
                                    {paymentOption === 'cod'
                                        ? <Ionicons
                                            color={"grey"}
                                            size={24}
                                            name="radio-button-on-outline"
                                        />
                                        : <Ionicons
                                            onPress={() => setPaymentOption("cod")}
                                            color={"grey"}
                                            size={24}
                                            name="radio-button-off-outline"
                                        />
                                    }
                                    <Text style={{ flex: 1 }}>
                                        Thanh toán khi nhận hàng
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    padding: 8,
                                    gap: 7,
                                    borderColor: "#d0d0d0",
                                    borderWidth: 1,
                                    marginTop: 10
                                }}>
                                    {paymentOption === 'vnpay'
                                        ? <Ionicons
                                            color={"grey"}
                                            size={24}
                                            name="radio-button-on-outline"
                                        />
                                        : <Ionicons
                                            onPress={() => {
                                                setPaymentOption("vnpay")

                                            }}
                                            color={"grey"}
                                            size={24}
                                            name="radio-button-off-outline"
                                        />
                                    }
                                    <Text style={{ flex: 1 }}>
                                        Thanh toán VnPay
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => setCurrentStep(4)}
                                    style={{
                                        backgroundColor: "orange",
                                        padding: 10,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 10
                                    }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 16
                                    }}>Tiếp tục</Text>
                                </Pressable>
                            </View>
                        )}
                        {currentStep == 4 && (
                            <View style={{ marginHorizontal: 20 }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontSize: 18
                                }}>Xác nhận thông tin đơn hàng</Text>
                                <View style={{
                                    backgroundColor: "white",
                                    padding: 8,
                                    borderColor: '#d0d0d0',
                                    borderWidth: 1,
                                    marginTop: 10
                                }}>
                                    <Text style={{ fontSize: 16 }}>Vận chuyển đến {selectedAddress?.province}</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: 8,
                                        alignItems: 'center',
                                        justifyContent: "space-between"
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: "500",
                                            color: "gray"
                                        }}>Đơn hàng</Text>
                                        <Text style={{
                                            fontSize: 16,
                                            color: "gray"
                                        }}>{total.toLocaleString()} đ</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: 8,
                                        alignItems: 'center',
                                        justifyContent: "space-between"
                                    }}>
                                        <Text style={{
                                            fontSize: 16,
                                            fontWeight: "500",
                                            color: "gray"
                                        }}>Phí vận chuyển</Text>
                                        <Text style={{
                                            fontSize: 16,
                                            color: "gray"
                                        }}>0</Text>
                                    </View>
                                    <View style={{
                                        flexDirection: 'row',
                                        marginTop: 8,
                                        alignItems: 'center',
                                        justifyContent: "space-between"
                                    }}>
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                        }}>Đơn hàng</Text>
                                        <Text style={{
                                            fontSize: 18,
                                            color: "red",
                                            fontWeight: 'bold'
                                        }}>{total.toLocaleString()} đ</Text>
                                    </View>
                                </View>
                                <View style={{
                                    backgroundColor: "white",
                                    padding: 8,
                                    borderColor: '#d0d0d0',
                                    borderWidth: 1,
                                    marginTop: 10
                                }}>
                                    <Text style={{ fontSize: 16, color: 'gray' }}>Phương thức thanh toán</Text>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        marginTop: 7
                                    }}>
                                        {paymentOption === "cod"
                                            ? "Thanh toán khi nhận hàng (COD)"
                                            : "Thanh toán VnPay"
                                        }
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => handlePlaceOrder()}
                                    style={{
                                        backgroundColor: "orange",
                                        padding: 10,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 15
                                    }}>
                                    <Text style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 16
                                    }}>Đặt hàng</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                }
            </ScrollView>
        </View>

    )
}

export default Confirm;