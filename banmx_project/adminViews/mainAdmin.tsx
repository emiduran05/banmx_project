import { StyleSheet, Text, View, Image, Pressable, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebaseConn/config';
import { collection, getDocs } from 'firebase/firestore';
import Header from '../components/header';

export default function MainAdmin({ navigation, route }: any) {
    const [menu, setMenu] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current; // posición inicial fuera de pantalla

    const name = route.params.name;
    const uid = route.params.data;
    const [data, setData] = useState([]);

    const toggleMenu = () => {
        setMenu(!menu);
    };

    const getdata = async () => {
        const catalogue = collection(db, "catalogue");
        const querySnapshot = await getDocs(catalogue);
        const dataArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setData(dataArray);
    };

    useEffect(() => {
        getdata();
    }, []);

    // 🎬 Animación del menú
    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [menu]);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.main}>
                <Header onMenuPress={toggleMenu} />

                <View style={styles.admin}>
                    <Text style={{ textAlign: "center", fontWeight: '600', fontSize: 20 }}>Mi catálogo:</Text>

                    <FlatList
                        data={data}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.admin_products}>
                                <Image style={{ width: 85, height: 85 }} source={{ uri: item.image }} />
                                <View style={{ gap: 15, justifyContent: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.title}</Text>
                                    <Text style={{ fontSize: 16 }}>Precio: ${item.price} MXN</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                <Pressable
                    style={{ position: "absolute", bottom: 70, right: 0, left: 0 }}
                    onPress={() => navigation.navigate("addProduct")}
                >
                    <Text style={{ textAlign: "center", padding: 8, backgroundColor: "#FD8721", width: "90%", margin: "auto", color: "#fff" }}>
                        + Añadir Producto
                    </Text>
                </Pressable>
            </View>

            {/* Menú lateral animado */}
            <Animated.View
                style={[
                    styles.sidebar,
                    { transform: [{ translateX: slideAnim }] }
                ]}
            >
                <SafeAreaView>
                    <Text style={{ padding: 20, fontSize: 18, fontWeight: '700', color: '#fff' }}>Menú Principal</Text>
                    <Pressable onPress={() => navigation.navigate("addProduct")}>
                        <Text style={styles.sidebarItem}>Añadir producto</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("profile")}>
                        <Text style={styles.sidebarItem}>Mi perfil</Text>
                    </Pressable>
                    <Pressable onPress={toggleMenu}>
                        <Text style={styles.sidebarItem}>Cerrar menú</Text>
                    </Pressable>
                </SafeAreaView>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#eee',
    },
    main: {
        flex: 1,
        gap: 20,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    admin: {
        padding: 35,
        gap: 15,
    },
    admin_products: {
        flexDirection: "row",
        gap: 20,
        backgroundColor: "#fff",
        elevation: 4,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        marginTop: 10,
    },
    sidebar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "70%",
        backgroundColor: '#FD8721',
        zIndex: 100,
        elevation: 10,
        paddingTop: 40,
    },
    sidebarItem: {
        color: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '500',
    },
});
