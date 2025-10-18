import SidebarUser from "../components/SideBarUser";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    FlatList,
    Animated,
} from "react-native";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebaseConn/config";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentDetails({ navigation, route }: any) {
    const user = auth.currentUser;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [menu, setMenu] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);
    const si = route.params.data;

    // 🔹 Obtener métodos de pago
    async function getPayInfo(userUid: string) {
        const payInfos = collection(db, "payment_methods");
        const payInfosQuery = query(payInfos, where("uid", "==", userUid));
        const querySnapshot = await getDocs(payInfosQuery);
        const dataArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setData(dataArray);
        setLoading(false);
    }

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();

        if (user?.uid) getPayInfo(user.uid);
    }, [menu]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header onMenuPress={toggleMenu} />
            <SidebarUser
                navigation={navigation}
                slideAnim={slideAnim}
                toggleMenu={toggleMenu}
            />

            <View style={styles.main}>
                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "600" }}>
                    Detalles finales
                </Text>

                {/* 🛒 Lista de productos */}
                <FlatList
                    data={si}
                    style={{ maxHeight: 200 }}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={styles.main}
                    renderItem={({ item }) => (
                        <View style={styles.last_moves}>
                            <Image
                                source={{
                                    uri:
                                        item.image ||
                                        "https://www.laranitadelapaz.com.mx/images/thumbs/0005559_frijol-negro-jamapa-verde-valle-bolsa-de-1-kg_625.jpeg",
                                }}
                                style={{ height: 50, width: 50, borderRadius: 5 }}
                            />
                            <View>
                                <Text style={styles.bold}>Producto:</Text>
                                <Text>{item.title}</Text>
                            </View>
                            <View>
                                <Text style={styles.bold}>Precio:</Text>
                                <Text>${item.price} mxn</Text>
                            </View>
                            <View>
                                <Text style={styles.bold}>Cantidad:</Text>
                                <Text style={{ textAlign: "center" }}>{item.quantity}</Text>
                            </View>
                        </View>
                    )}
                />

                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "600" }}>
                    Escoger método de pago:
                </Text>

                {/* 💳 Lista de métodos */}
                {loading ? (
                    <Image
                        source={{
                            uri: "https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif",
                        }}
                        style={{ height: 70, width: 70, alignSelf: "center" }}
                    />
                ) : data.length === 0 ? (
                    <Text style={{ textAlign: "center" }}>
                        No tienes métodos de pago agregados
                    </Text>
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        style={{ maxHeight: 200 }}
                        renderItem={({ item }) => (
                            <Pressable
                                style={[
                                    styles.methods,
                                    selectedMethod === item.id && {
                                        borderColor: "#FD8721",
                                        borderWidth: 2,
                                    },
                                ]}
                                onPress={() => setSelectedMethod(item.id)}
                            >
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <View
                                        style={[
                                            styles.radio,
                                            selectedMethod === item.id && styles.radioSelected,
                                        ]}
                                    />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.bold}>
                                            Tarjeta: **{item.card_number.slice(-4)}
                                        </Text>
                                        <Text>Titular: {item.titular}</Text>
                                        <Text>Expira: {item.exp_date}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                    />
                )}

                {/* ➕ Botón para agregar nuevo método */}
                <Pressable
                    style={styles.button}
                    onPress={() => {
                        navigation.navigate("addPayment", { origin: "details", data: si });
                    }}
                >
                    <Text style={{ textAlign: "center", color: "#fff" }}>
                        Agregar Método de pago
                    </Text>
                </Pressable>

                {/* 💰 Botón para proceder al pago */}
                <Pressable
                    style={[
                        styles.button,
                        {
                            backgroundColor: selectedMethod ? "#28A745" : "#ccc",
                        },
                    ]}
                    disabled={!selectedMethod}
                    onPress={() => {
                        if (!selectedMethod) {
                            alert("Selecciona un método de pago primero");
                            return;
                        }

                        const method = data.find((m: any) => m.id === selectedMethod);
                        console.log("Procediendo al pago con:", method);

                        // Aquí puedes implementar tu lógica de pago o redirección:
                        // navigation.navigate("PaymentProcessing", { method, products: si });
                    }}
                >
                    <Text style={{ textAlign: "center", color: "#fff" }}>Donar</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        padding: 15,
        gap: 10,
    },
    last_moves: {
        backgroundColor: "#fff",
        marginBottom: 15,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        elevation: 2,
        borderRadius: 8,
    },
    bold: {
        fontWeight: "600",
    },
    methods: {
        backgroundColor: "#fff",
        padding: 10,
        elevation: 3,
        borderRadius: 8,
        display: "flex",
        gap: 10,
        marginBottom: 10,
        borderColor: "transparent",
        borderWidth: 2,
    },
    radio: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#999",
    },
    radioSelected: {
        backgroundColor: "#FD8721",
        borderColor: "#FD8721",
    },
    button: {
        padding: 10,
        marginTop: 10,
        backgroundColor: "#FD8721",
        borderRadius: 8,
    },
});
