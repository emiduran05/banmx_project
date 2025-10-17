import SidebarUser from "../components/SideBarUser";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Animated,
    Switch,
    TextInput,
    Pressable,
} from "react-native";
import { getDocs, collection } from "firebase/firestore";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConn/config";

export default function Catalogo({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState<
        { id: string; title: string; image: string; quantity: number; price: number }[]
    >([]);
    const [total, setTotal] = useState(0);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);

    const getdata = async () => {
        const catalogue = collection(db, "catalogue");
        const querySnapshot = await getDocs(catalogue);
        const dataArray = querySnapshot.docs.map(doc => ({
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

    // Activar/desactivar productos
    const toggleSelection = (item: any) => {
        const existing = selected.find(p => p.id === item.id);
        if (existing) {
            // quitar producto
            setSelected(prev => prev.filter(p => p.id !== item.id));
            setTotal(prev => prev - existing.price * existing.quantity);
        } else {
            // agregar producto con cantidad inicial 1
            setSelected(prev => [
                ...prev,
                {
                    id: item.id,
                    title: item.title,
                    image: item.image,
                    quantity: 1,
                    price: Number(item.price),
                },
            ]);
            setTotal(prev => prev + Number(item.price));
        }
    };

    // Actualizar cantidad
    const updateQuantity = (id: string, quantity: number) => {
        setSelected(prev =>
            prev.map(p => {
                if (p.id === id) {
                    const oldTotal = p.price * p.quantity;
                    const newTotal = p.price * quantity;
                    setTotal(t => t - oldTotal + newTotal);
                    return { ...p, quantity };
                }
                return p;
            })
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header onMenuPress={toggleMenu} />
            <SidebarUser navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} />

            <View style={styles.main}>
                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
                    Catálogo
                </Text>
                <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 12 }}>
                    En este portal podrás ver los productos disponibles para donar, recuerda que todo apoyo es bueno. ¡Ayuda a la comunidad con tu granito de arena!
                </Text>
                <Text style={{ textAlign: "center", marginBottom: 20, fontSize: 12 }}>
                    Para donar, selecciona los productos y haz click en "ir a pagar" para continuar con el proceso
                </Text>

                <FlatList
                    style={{ flex: 1, paddingBottom: 30 }}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        const selectedItem = selected.find(p => p.id === item.id);
                        return (
                            <View style={styles.user_products}>
                                <Switch
                                    value={!!selectedItem}
                                    onValueChange={() => toggleSelection(item)}
                                />

                                <Image style={{ width: 70, height: 70 }} source={{ uri: item.image }} />

                                <View style={{ gap: 10, justifyContent: "space-around", flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>
                                    <Text style={{ fontSize: 16 }}>Precio: ${item.price} MXN</Text>

                                    {selectedItem && (
                                        <TextInput
                                            style={styles.quantityInput}
                                            keyboardType="numeric"
                                            value={selectedItem.quantity.toString()}
                                            onChangeText={text => {
                                                const num = parseInt(text) || 1;
                                                updateQuantity(item.id, num);
                                            }}
                                        />
                                    )}
                                </View>
                            </View>
                        );
                    }}
                />

                <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, marginBottom: 20, fontWeight: 600 }}>
                    Total seleccionado: ${total} MXN
                </Text>

                {selected.length > 0 && (
                    <Pressable
                        style={{ backgroundColor: "#FD8721" }}
                        onPress={() => {
                            navigation.navigate("paymentDetails", { data: selected });
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                padding: 10,
                                backgroundColor: "#FD8721",
                                color: "#fff",
                                fontWeight: 600,
                            }}
                        >
                            Ir a pagar
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
        padding: 30,
    },

    user_products: {
        marginBottom: 30,
        backgroundColor: "#fff",
        padding: 20,
        gap: 10,
        elevation: 4,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },

    quantityInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        width: 60,
        height: 35,
        paddingHorizontal: 8,
        marginTop: 5,
    },
});
