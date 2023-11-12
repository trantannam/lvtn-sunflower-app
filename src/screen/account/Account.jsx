import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import HeaderShow from "../../component/header/search";


const AccountScreen = ({ navigation, route }) => {

    const logout = () => {
        clearAuthToken();
    }
    const clearAuthToken = async () => {
        await AsyncStorage.removeItem("authToken");
        navigation.replace("Login");
    }
    return (
        <View>
            <ScrollView>
                <View style={{
                    height: 50,
                    width: "100%",
                    backgroundColor: "orange",
                }} />
                <HeaderShow />
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 12
                }}>
                    <Pressable style={{
                        padding: 10,
                        backgroundColor: "#E0E0E0",
                        borderRadius: 25,
                        flex: 1
                    }}>
                        <Text>
                            Đơn đặt hàng
                        </Text>
                    </Pressable>
                    <Pressable style={{
                        padding: 10,
                        backgroundColor: "#E0E0E0",
                        borderRadius: 25,
                        flex: 1
                    }}>
                        <Text>
                            Thông tin tài khoản
                        </Text>
                    </Pressable>
                </View>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginTop: 12
                }}>
                    <Pressable style={{
                        padding: 10,
                        backgroundColor: "#E0E0E0",
                        borderRadius: 25,
                        flex: 1
                    }}>
                        <Text>
                            Đơn đặt hàng
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => logout()}
                        style={{
                            padding: 10,
                            backgroundColor: "#E0E0E0",
                            borderRadius: 25,
                            flex: 1
                        }}>
                        <Text>
                            Đăng xuất
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
};

export default AccountScreen;