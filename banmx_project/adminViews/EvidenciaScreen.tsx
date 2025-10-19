import SidebarUser from "../components/SideBarUser";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Animated,
    Switch,
    Pressable,
    Alert,
    ActivityIndicator
} from "react-native";
import { getDocs, collection, doc, updateDoc, query,where } from "firebase/firestore";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/Sidebar";
import * as ImagePicker from "expo-image-picker";

export default function DonacionesAdmin({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<any[]>([]);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);

    // Cloudinary config
    const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dzra5elov/image/upload";
    const UPLOAD_PRESET = "ml_default";

    const getdata = async () => {
    try {
        const catalogue = collection(db, "donaciones");
        // 🔹 Solo obtener los que ya están comprados
        const q = query(catalogue, where("comprado", "==", true));
        const querySnapshot = await getDocs(q);

        const dataArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setData(dataArray);
    } catch (error) {
        console.error("Error al obtener los productos comprados:", error);
    }
            setLoading(false)

};

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();
        getdata();
    }, [menu]);

    const handleSelect = (item: any) => {
        if (selected.includes(item.id)) {
            setSelected(selected.filter((id) => id !== item.id));
        } else {
            setSelected([...selected, item.id]);
        }
    };

    const handleTakeEvidence = async () => {
        if (selected.length === 0) {
            Alert.alert("Selecciona productos", "Primero selecciona al menos un producto.");
            return;
        }

        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permiso denegado", "Necesitas dar permiso para usar la cámara.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const image = result.assets[0];
            const uri = image.uri;

            const formData = new FormData();
            formData.append("file", {
                uri,
                type: "image/jpeg",
                name: "evidencia.jpg",
            } as any);
            formData.append("upload_preset", UPLOAD_PRESET);

            try {
                const res = await fetch(CLOUDINARY_URL, {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                const imageUrl = data.secure_url;

                if (!imageUrl) {
                    Alert.alert("Error", "No se pudo subir la foto a Cloudinary.");
                    return;
                }

                // Actualizar en Firebase todos los productos seleccionados
                for (const id of selected) {
                    const ref = doc(db, "donaciones", id);
                    await updateDoc(ref, { evidenciaIMG: imageUrl });
                }

                Alert.alert("¡Evidencia Lista!.");
                setSelected([]);
                getdata();
            } catch (error) {
                console.error(error);
                Alert.alert("Error", "Ocurrió un error al subir la evidencia.");
            }
        }

    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header onMenuPress={toggleMenu} />
            <Sidebar
                navigation={navigation}
                slideAnim={slideAnim}
                toggleMenu={toggleMenu}
            />
            <View style={styles.main}>
                <Text style={styles.title}>Donaciones</Text>
                
                {loading ? (<ActivityIndicator size="large" color="#FD8721" />) : data.length == 0 ? (<Text style={{textAlign: "center"}}>No hay productos listos para tomar evidencia</Text>) : (
                    <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.imagen }}
                            />
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.detail}>
                                    ${item.donacion} MXN
                                </Text>
                                <Text style={styles.detail}>{item.fecha}</Text>
                                <Text style={styles.detail}>
                                    Cantidad: {item.cantidad}
                                </Text>
                                {item.evidenciaIMG && (
                                    <Text style={{ color: "#4CAF50", fontSize: 13 }}>
                                        Evidencia registrada
                                    </Text>
                                )}
                            </View>
                            <Switch
                                value={selected.includes(item.id)}
                                onValueChange={() => handleSelect(item)}
                                trackColor={{ false: "#ccc", true: "#00f" }}
                                thumbColor={
                                    selected.includes(item.id)
                                        ? "#fff"
                                        : "#f4f3f4"
                                }
                            />
                        </View>
                    )}
                />
                )}
                

                {selected.length > 0 && (
                    <Pressable style={styles.button} onPress={handleTakeEvidence}>
                        <Text style={styles.buttonText}>
                            Tomar evidencia ({selected.length})
                        </Text>
                    </Pressable>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
    },
    title: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
        color: "#333",
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 15,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    name: {
        fontSize: 17,
        fontWeight: "600",
        color: "#222",
    },
    detail: {
        fontSize: 14,
        color: "#555",
    },
    button: {
        backgroundColor: "#00f",
        marginTop: 10,
        padding: 15,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
});
