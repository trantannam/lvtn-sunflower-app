import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image } from "react-native";
import HeaderShow from "../../component/header/search";
import axios from "axios"
import { Camera, CameraType } from "expo-camera";
import { Button } from "react-native-elements/dist/buttons/Button";
import Btn from "./Button";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

const DetectScreen = () => {


    const cameraRef = useRef();
    const formData = new FormData()
    const [image, setImage] = useState()
    const { width, height } = Dimensions.get('window');

    const [result, setResult] = useState([]);
    const [showCanvas, setShowCanvas] = useState(false);

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Cho phép Sunflower truy cập camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const sendToServer = async () => {

        formData.append("image_file", image.base64, "image_file")

        await axios.post("http://172.20.10.14:8080/detect-flower", { image: image.base64 }, {
            headers: {
                "Access-Control-Allow-Origin": '*',
                "Content-Type": 'multipart/form-data'
            }
        })
            .then((res) => {
                setResult(res.data);
                setShowCanvas(true);
            })
    }

    const handlleImageCreate = async (canvas) => {
        if (canvas === null) {
            return;
        }

        const img = new CanvasImage(canvas);
        img.src = `data:image/jpg;base64,${image.base64}`;
        img.addEventListener("load", async () => {
            const ctx =await canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height-180;
            var xFactor = canvas.width/img.width;
            var yFactor = canvas.height/img.height
            await ctx.drawImage(img, 0, 0, img.width, img.height,
                0, 0, canvas.width, canvas.height)
            ctx.strokeStyle = "#00FF00";
            ctx.lineWidth = 3;
            ctx.font = '14px serif';
            result ? result.forEach(([x1, y1, x2, y2, label]) => {
                ctx.strokeRect(x1*xFactor, y1*yFactor, (x2 - x1)*xFactor, (y2 - y1)*yFactor);
                ctx.fillStyle = "#00ff00";
                const width = (x2 - x1)*xFactor*0.94;
                ctx.fillRect(x1*xFactor, y1*yFactor, width + 10, 25);
                ctx.fillStyle = "#000000";
                ctx.fillText(label, x1*xFactor, y1*yFactor + 18);
            }) : "";
        })
    }

    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync({ base64: true });
                setImage(data);
                setShowCanvas(false);
            } catch (error) {
                console.log(error)
            }
        }
    }

    const reTake = () => {
        setImage(null);
        setResult(false);
    }

    return (
        <View>
            <View style={{
                height: 50,
                width: "100%",
                backgroundColor: "orange",
            }} />
            <HeaderShow />
            <ScrollView>
                {image ?
                    <View>
                        <View style={{ flex: 1, paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
                            <Canvas ref={handlleImageCreate} style={{ flex: 1, height:height-180 }} />
                        </View>
                    </View>
                    :
                    <Camera
                        style={styles.camera}
                        type={type}
                        ref={cameraRef}
                    >
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                                <Ionicons name="repeat-outline" size={40} style={styles.text} />
                            </TouchableOpacity>
                        </View>
                    </Camera>
                }
                {image ?
                    <View style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingHorizontal: 50
                    }}>
                        <Btn icon="repeat-outline" title="Chụp lại" onPress={() => reTake()} />
                        <Btn icon="arrow-up-outline" title="Tìm Hoa" onPress={() => sendToServer()} />
                    </View> :
                    <View>
                        <Btn icon='camera' onPress={takePicture} />
                    </View>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        height: 600,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 15,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-start',
        alignItems: 'flex-end',
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
    },
    example: {
        paddingBottom: 5,
        flex: 1,
        flexDirection: 'row',
    },
    exampleLeft: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exampleRight: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});


export default DetectScreen;