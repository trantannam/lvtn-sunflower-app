import * as React from "react";
import { View, Text, Image, SafeAreaView, KeyboardAvoidingView, TextInput, Pressable } from "react-native";
import { useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import request from "./../../utils/request"




const RegisterScreen = () => {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState(false);
    const navigation = useNavigation();
    
    const [cname, setCName] = useState(false);
    const [cphone, setCPhone] = useState(false);
    const [cpassword, setCPassword] = useState(false);

    const handleResgister = async () => {
        const info = {
            customer_name: name,
            phone_number: phone,
            gender: gender,
            password: password
        }
        console.log("info", info)

        if (name === "") {
            setCName(true)
        } else setCName(false)
        if (phone === "") {
            setCPhone(true)
        } else setCPhone(false)
        if(password === ""){
            setCPassword(true)
        } else setCPassword(false)
        
        if(name!=="" && phone!=="" && password!==""){
            await request.post("/customer/register", info)
                .then(res=>{
                    if(res.data.success===true){
                        showLoginPopup();
                        NotificationManager.success('Đăng ký thành công');
                    }
                })
        }
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
                        Đăng ký tài khoản
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
                        name="person-outline"
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
                        placeholder="Họ và tên" />
                </View>
                    {cname?<Text style={{color:"red", fontSize:12, paddingTop:5}}>Chưa nhập họ và tên</Text>:""}
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
                        name="call-outline"
                        size={24}
                        color={"grey"} />
                    <TextInput
                        value={name}
                        onChangeText={text => setName(text)}
                        style={{
                            color: "grey",
                            marginVertical: 8,
                            width: 300,
                            fontSize: phone ? 16 : 16
                        }}
                        placeholder="Số điện thoại" />
                </View>
                {cphone?<Text style={{color:"red", fontSize:12, paddingTop:5}}>Chưa nhập số điện thoại</Text>:""}

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
                {cpassword?<Text style={{color:"red", fontSize:12, paddingTop:5}}>Chưa nhập mật khẩu</Text>:""}

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
                onPress={handleResgister}
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
                        style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: 16
                        }}
                    >Đăng ký</Text>

                </Pressable>
                <Pressable onPress={() => navigation.navigate("Login")}>
                    <Text style={{ textAlign: "center", color: "gray", fontSize: 16, marginTop:10 }}>Bạn đã có tài khoản? Đăng nhập</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;