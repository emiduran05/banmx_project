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
} from "react-native";
import { getDocs, collection } from "firebase/firestore";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/Sidebar";

export default function DonacionesAdmin({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);

    const getdata = async () => {
        const catalogue = collection(db, "donaciones");
        const querySnapshot = await getDocs(catalogue);
        const dataArray = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setData(dataArray);
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

    const handleContinue = () => {
        const selectedItems = data.filter((item) => selected.includes(item.id));
        navigation.navigate("EvidenciaScreen", { selectedItems });
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
                                <Text style={styles.detail}>Fecha: {item.fecha}</Text>
                                <Text style={styles.detail}>
                                    Cantidad: {item.cantidad}
                                </Text>
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

                {selected.length > 0 && (
                    <Pressable style={styles.button} onPress={handleContinue}>
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
