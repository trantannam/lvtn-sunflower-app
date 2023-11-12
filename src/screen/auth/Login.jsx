import * as React from "react";
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, TextInput, Pressable } from "react-native";
import { useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import request from "../../utils/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";


const LoginScreen = () => {

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("")
    const navigation = useNavigation();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");

                if (token) {
                    navigation.navigate("Main")
                }
            } catch (error) {
                console.log("error", error)
            }
        };
        checkLoginStatus();
    }, []) 

    const handleLogin = async () => {
        await request.post('/customer/login', { phone_number: phone, password: password })
            .then(res => {
                if (res.data.success) {
                    const token = res.data.accessToken;
                    console.log("data", res.data.accessToken)
                    AsyncStorage.setItem("authToken", token);
                    navigation.navigate("Main");
                }
            })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white", alignItems: "center" }}>
            <View style={{ marginTop: 50 }} />
            <View>
                <Image
                    style={{ width: 150, height: 50, marginTop: 50 }}
                    source={require("./../../img/logo/sunFlower.png")}
                />
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: "center", marginTop: 50 }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", color: "#041E42" }}>
                        Đăng nhập
                    </Text>
                </View>
                <View
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        backgroundColor: "#D0D0D0",
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginTop: 50
                    }}>
                    <Ionicons
                        style={{
                            marginLeft: 8
                        }}
                        name="call-outline"
                        size={24}
                        color={"grey"} />
                    <TextInput
                        value={phone}
                        onChangeText={text => setPhone(text)}
                        style={{
                            color: "grey",
                            marginVertical: 8,
                            width: 300,
                            fontSize: phone ? 16 : 16
                        }}
                        placeholder="Số điện thoại" />
                </View>
                <View
                    style={{
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 5,
                        backgroundColor: "#D0D0D0",
                        paddingVertical: 5,
                        borderRadius: 5,
                        marginTop: 30
                    }}>
                    <Ionicons
                        style={{
                            marginLeft: 8
                        }}
                        name="lock-closed-outline"
                        size={24}
                        color={"grey"} />
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={true}
                        style={{
                            color: "grey",
                            marginVertical: 8,
                            width: 300,
                            fontSize: phone ? 16 : 16
                        }}
                        placeholder="Mật khẩu" />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 12,
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Text>Ghi nhớ đăng nhập</Text>
                    <Text style={{ color: "#007fff", fontWeight: "500" }}>Quên mật khẩu</Text>
                </View>
                <View style={{ marginTop: 80 }} />
                <Pressable
                    style={{
                        width: 200,
                        marginLeft: "auto",
                        marginRight: "auto",
                        padding: 15,
                        borderRadius: 6,
                        backgroundColor: "#febe10"
                    }}
                >
                    <Text
                        onPress={handleLogin}
                        style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: 16
                        }}
                    >Đăng nhập</Text>

                </Pressable>
                <Pressable onPress={() => navigation.navigate("Register")}>
                    <Text style={{ textAlign: "center", color: "gray", fontSize: 16, marginTop: 10 }}>Chưa có tài khoản? Đăng ký</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;