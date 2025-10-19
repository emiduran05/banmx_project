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
    ActivityIndicator,
} from "react-native";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";
import Sidebar from "../components/Sidebar";

export default function ListaCompras({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);

    const getData = async () => {
        try {
            const catalogue = collection(db, "donaciones"); // puedes cambiarlo a "compras" si es otra colección
            const querySnapshot = await getDocs(catalogue);
            const dataArray = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(dataArray);
        } catch (error) {
            console.error("Error al obtener datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();
        getData();
    }, [menu]);

    // ✅ Cambiar el estado del campo "comprado"
    const toggleComprado = async (item: any) => {
        try {
            const ref = doc(db, "donaciones", item.id);
            await updateDoc(ref, { comprado: !item.comprado });

            // Actualiza el estado local sin tener que recargar todo
            setData((prevData) =>
                prevData.map((d) =>
                    d.id === item.id ? { ...d, comprado: !item.comprado } : d
                )
            );
        } catch (error) {
            console.error("Error al actualizar:", error);
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
                <Text style={styles.title}>Lista de compras </Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#FD8721" />
                ) : data.length == 0 ? (<Text>No tienes donados</Text>) : (
                    <FlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View
                                style={[
                                    styles.card,
                                    item.comprado && { opacity: 0.6 },
                                ]}
                            >
                                <Image
                                    style={styles.image}
                                    source={{ uri: item.imagen }}
                                />
                                <View style={styles.info}>
                                    <Text
                                        style={[
                                            styles.name,
                                            item.comprado && {
                                                textDecorationLine: "line-through",
                                                color: "#666",
                                            },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                    <Text style={styles.detail}>
                                        ${item.donacion} MXN
                                    </Text>
                                    <Text style={styles.detail}>
                                        Fecha: {item.fecha}
                                    </Text>
                                    <Text style={styles.detail}>
                                        Cantidad: {item.cantidad}
                                    </Text>
                                    <Text
                                        style={{
                                            color: item.comprado
                                                ? "#4CAF50"
                                                : "#f00",
                                            fontWeight: "600",
                                            marginTop: 5,
                                        }}
                                    >
                                        {item.comprado
                                            ? "Comprado"
                                            : "Pendiente"}
                                    </Text>
                                </View>

                                <Switch
                                    value={item.comprado}
                                    onValueChange={() => toggleComprado(item)}
                                    trackColor={{ false: "#ccc", true: "#4CAF50" }}
                                    thumbColor={
                                        item.comprado ? "#fff" : "#f4f3f4"
                                    }
                                />
                            </View>
                        )}
                    />
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
});
