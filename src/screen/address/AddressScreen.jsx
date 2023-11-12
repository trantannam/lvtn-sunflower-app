import { useContext } from "react";
import * as React from "react";
import { Pressable, ScrollView, Text, View, StyleSheet, TextInput, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderShow from "../../component/header/search";
import SelectDropdown from 'react-native-select-dropdown'
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { UserType } from "../../../UseContext";
import request from "../../utils/request";
import { useNavigation } from "@react-navigation/native";

const AddressScreen = () => {
    const navigation = useNavigation();
    const [division, setDivision] = useState([]);
    const [p, setP] = useState("");
    const [d, setD] = useState("");
    const [w, setW] = useState("");
    const [describe, setDescribe] = useState("");
    const [type, setType] = useState("");
    const [dArr, setDArr] = useState([]);
    const [wArr, setWArr] = useState([]);
    const [plist, setPlist] = useState([]);
    const [dlist, setDlist] = useState([]);
    const [wlist, setWlist] = useState([]);

    const { userId, setUserId } = useContext(UserType);

    const resetDRef = useRef();
    const resetWRef = useRef();

    const handleAddAddress = async () => {
        request.post("/delivery/addAddress", {
            customerID: userId,
            division: {
                province: p,
                district: d,
                ward: w,
                describe: describe,
                type: type
            }
        })
            .then(
                res => {
                    if (res.data.success === true) {
                        Alert.alert("Thành Công", "Thêm địa chỉ thành công");
                        setP("");
                        setD("");
                        setW("");
                        setTimeout(() => {
                            navigation.goBack();
                        }, 500);
                    }
                }
            )
            .catch(err => {
                Alert.alert("Thất bại", "Có lỗi trong quá trình thêm địa chỉ!");
                console.log("error", err)
            })
    }

    // console.log("user",AsyncStorage.getItem("authToken"))

    const getAddress = async () => {
        await axios.get("https://provinces.open-api.vn/api/?depth=3")
            .then(res => {
                setDivision(res.data);
            })
    }

    useEffect(() => {
        getAddress();
    }, [])
    useEffect(() => {
        var tempP = [];
        division.map((item, index) => {
            tempP.push(item.name)
        })
        setPlist(tempP)
    }, [division])


    //add district list
    const setDList = (e) => {
        setDArr(division.filter((item) => item.name === e))
    }
    useEffect(() => {
        var tempD = [];
        dArr[0]?.districts.map((item) => tempD.push(item.name))
        setDlist(tempD)
    }, [dArr])


    //add ward list
    const setWList = (e) => {
        setWArr(dArr[0].districts.filter((item) => item.name === e))
    }
    useEffect(() => {
        var tempW = [];
        wArr[0]?.wards.map((item) => tempW.push(item.name))
        setWlist(tempW)
    }, [wArr])

    return (

        <ScrollView >
            <View style={{
                height: 50,
                width: "100%",
                backgroundColor: "orange",
            }} />
            <HeaderShow />
            <Text style={{
                alignItems: "center",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 24,
                paddingTop: 20
            }}>Thêm địa chỉ mới</Text>

            <Pressable style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 20,
                }}>Thành phố/Tỉnh</Text>
                <SelectDropdown
                    data={plist}
                    onSelect={(selectedItem, index) => {
                        resetDRef.current.reset()
                        setD("")
                        setP(selectedItem)
                        setDList(selectedItem)
                        console.log(selectedItem, index)
                    }}
                    defaultButtonText={'Chọn thành phố/tỉnh'}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    renderDropdownIcon={isOpened => {
                        return <Ionicons name={isOpened ? 'chevron-up-outline' : 'chevron-down-outline'} color={'#444'} size={18} />;
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    selectedRowStyle={styles.dropdown1SelectedRowStyle}
                    search
                    searchInputStyle={styles.dropdown1searchInputStyleStyle}
                    searchPlaceHolder={'Search here'}
                    searchPlaceHolderColor={'darkgrey'}
                    renderSearchInputLeftIcon={() => {
                        return <Ionicons name={'search-outline'} color={'#444'} size={18} />;
                    }}
                />
            </Pressable>
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 20,
                }}>Quận/huyện</Text>
                <SelectDropdown
                    ref={resetDRef}
                    data={dlist ? dlist : []}
                    onSelect={(selectedItem, index) => {
                        resetWRef.current.reset()
                        setD(selectedItem)
                        setWList(selectedItem)
                        console.log(selectedItem, index)
                    }}
                    defaultButtonText={'Chọn quận/huyện'}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    renderDropdownIcon={isOpened => {
                        return <Ionicons name={isOpened ? 'chevron-up-outline' : 'chevron-down-outline'} color={'#444'} size={18} />;
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    selectedRowStyle={styles.dropdown1SelectedRowStyle}
                    search
                    searchInputStyle={styles.dropdown1searchInputStyleStyle}
                    searchPlaceHolder={'Search here'}
                    searchPlaceHolderColor={'darkgrey'}
                    renderSearchInputLeftIcon={() => {
                        return <Ionicons name={'search-outline'} color={'#444'} size={18} />;
                    }}
                />
            </View>
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 20,
                }}>Phường/xã</Text>
                <SelectDropdown
                    ref={resetDRef}
                    ref={resetWRef}
                    data={wlist}
                    onSelect={(selectedItem, index) => {
                        setW(selectedItem)
                        console.log(selectedItem, index)
                    }}
                    defaultButtonText={'Chọn phường/xã'}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={styles.dropdown1BtnStyle}
                    buttonTextStyle={styles.dropdown1BtnTxtStyle}
                    renderDropdownIcon={isOpened => {
                        return <Ionicons name={isOpened ? 'chevron-up-outline' : 'chevron-down-outline'} color={'#444'} size={18} />;
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdown1DropdownStyle}
                    rowStyle={styles.dropdown1RowStyle}
                    rowTextStyle={styles.dropdown1RowTxtStyle}
                    selectedRowStyle={styles.dropdown1SelectedRowStyle}
                    search
                    searchInputStyle={styles.dropdown1searchInputStyleStyle}
                    searchPlaceHolder={'Search here'}
                    searchPlaceHolderColor={'darkgrey'}
                    renderSearchInputLeftIcon={() => {
                        return <Ionicons name={'search-outline'} color={'#444'} size={18} />;
                    }}
                />
            </View>
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 20,
                }}>Mô tả</Text>
                <TextInput
                    value={describe}
                    onChangeText={e => setDescribe(e)}
                    style={{
                        padding: 10,
                        borderColor: "#444",
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        marginTop: 10,
                        borderRadius: 8
                    }}
                    placeholder="Số nhà, đường, ..." />
            </View>
            <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text style={{
                    fontWeight: "bold",
                    fontSize: 20,
                }}>Tên địa chỉ</Text>
                <TextInput
                    value={type}
                    onChangeText={(e) => setType(e)}
                    style={{
                        padding: 10,
                        borderColor: "#444",
                        backgroundColor: "#fff",
                        borderWidth: 1,
                        marginTop: 10,
                        borderRadius: 8
                    }}
                    placeholder="Nhà riêng, công ty, ..." />
            </View>
            <Pressable
                onPress={() => handleAddAddress()}
                style={{
                    backgroundColor: "#ffc72c",
                    padding: 19,
                    borderRadius: 6,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                    marginHorizontal: 20
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>Thêm địa chỉ</Text>
            </Pressable>

        </ScrollView>
    )
};

export default AddressScreen;

const styles = StyleSheet.create({
    dropdown1BtnStyle: {
        marginTop: 10,
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
    },
    dropdown1BtnTxtStyle: { color: '#444', textAlign: 'left' },
    dropdown1DropdownStyle: { backgroundColor: '#EFEFEF' },
    dropdown1RowStyle: { backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5' },
    dropdown1RowTxtStyle: { color: '#444', textAlign: 'left' },
    dropdown1SelectedRowStyle: { backgroundColor: 'rgba(0,0,0,0.1)' },
    dropdown1searchInputStyleStyle: {
        backgroundColor: '#EFEFEF',
        borderRadius: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
});