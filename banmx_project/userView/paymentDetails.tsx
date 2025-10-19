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
    addDoc,
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

    async function postDonation(donacion: number, cantidad: number, imagen: string, name: string, uid: string, card: string) {
        const fechaPost = new Date();

        const dia = fechaPost.getDate();          // Día (1–31)
        const mes = fechaPost.getMonth() + 1;     // Mes (0–11, por eso sumamos 1)
        const año = fechaPost.getFullYear();      // Año completo (ej. 2025)



        try {
            const docRef = await addDoc(collection(db, "donaciones"), {
                fecha: `${dia}/${mes}/${año}`,
                cantidad: cantidad,
                donacion: donacion,
                imagen: imagen,
                name: name,
                uid: uid,
                card: "**" + card.slice(-4),
                evidenciaIMG: "",

            })
        } catch (error) {
            console.log(error)
        }
    };


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

                <Pressable
                    style={[
                        styles.button,
                        {
                            backgroundColor: selectedMethod ? "#28A745" : "#ccc",
                        },
                    ]}
                    disabled={!selectedMethod}
                    onPress={async () => {
                        if (!selectedMethod) {
                            alert("Selecciona un método de pago primero");
                            return;
                        }

                        const method = data.find((m: any) => m.id === selectedMethod);

                        try {
                            for (const item of si) {
                                await postDonation(
                                    item.price * item.quantity, 
                                    item.quantity,              
                                    item.image,                 
                                    item.title,                 
                                    user.uid,                  
                                    method.card_number          
                                );
                            }

                            alert("¡Donaciones registradas correctamente!");
                            navigation.navigate("Donaciones"); // o a donde quieras redirigir
                        } catch (error) {
                            console.error("Error al registrar las donaciones:", error);
                            alert("Hubo un error al registrar las donaciones");
                        }
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
