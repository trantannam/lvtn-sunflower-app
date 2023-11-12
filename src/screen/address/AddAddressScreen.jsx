import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState, useContext } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { UserType } from "../../../UseContext";
import HeaderShow from "../../component/header/search";
import request from "../../utils/request";

const AddAddressScreen = () => {


    const navigation = useNavigation();
    const [address, setAddress] = useState([]);
    const { userId, setUserId } = useContext(UserType);

    const getAddressById = async () => {
        const res = await request.post("/delivery/getAddress", { customerID: userId })
        const addresses = res.data.data.division;
        if (res.data.success) {
            setAddress(addresses);
        }
    }
    
    useEffect(() => {
        getAddressById();
    }, [])

    useFocusEffect(
        useCallback(() => {
            getAddressById();
        },[])
    )

    return (
        <>
            <View style={{
                height: 50,
                width: "100%",
                backgroundColor: "orange",
            }} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <HeaderShow />
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Địa chỉ</Text>
                    <Pressable
                        onPress={() => navigation.navigate("Add")}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 10,
                            borderColor: "#D0D0D0",
                            borderWidth: 1,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            paddingVertical: 7,
                            paddingHorizontal: 5
                        }}>
                        <Text>Thêm địa chỉ mới</Text>
                        <Ionicons name="chevron-forward-outline" size={20} />
                    </Pressable>
                    <Pressable >
                        {address?.map((item, index) => (
                            <Pressable
                                key={index}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "#D0D0D0",
                                    padding: 10,
                                    flexDirection: "column",
                                    gap: 5,
                                    marginVertical: 10
                                }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
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
                            </Pressable>
                        ))}
                    </Pressable>
                </View>
            </ScrollView>
        </>
    )
};

export default AddAddressScreen;