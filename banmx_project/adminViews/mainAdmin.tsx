import { StyleSheet, Text, View, Image, Pressable, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebaseConn/config';
import { collection, getDocs } from 'firebase/firestore';
import Header from '../components/header';
import { auth } from '../firebaseConn/config';

export default function MainAdmin({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current;

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
                    <Text style={styles.title}>Mi catálogo:</Text>

                    <FlatList
                        style={{ flex: 1, paddingBottom: 30 }}
                        contentContainerStyle={{ paddingBottom: 120 }}
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


            </View>

           

            {/* Menú lateral animado */}
            <Animated.View
                style={[
                    styles.sidebar,
                    { transform: [{ translateX: slideAnim }] }
                ]}
            >
                <SafeAreaView>
                    <View style={styles.sidebarHeader}>
                        <Image
                            source={{ uri: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" }}
                            style={{ width: 100, height: 100, borderRadius: 150 }}
                        />
                        <Text style={styles.sidebarGreeting}>Hola, {user?.email}</Text>
                    </View>

                    <Pressable onPress={() => navigation.navigate("mainAdmin")}>
                        <Text style={styles.sidebarItem}>Mi catálogo</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("adminInfo")}>
                        <Text style={styles.sidebarItem}>Información de administrador</Text>
                    </Pressable>

                    
                            <Pressable onPress={() => navigation.navigate("donacionesAdmin")}>
                              <Text style={styles.sidebarItem}>Mi lista de compras</Text>
                            </Pressable>

                    <Pressable onPress={
                        () => {
                            navigation.navigate("EvidenciaScreen");
                        }
                    }>
                        <Text style={styles.sidebarItem}>Historial de donaciones</Text>
                    </Pressable>

                    <Pressable onPress={() => {navigation.navigate("adminBlog")}}>
                        <Text style={styles.sidebarItem}>Blog</Text>
                    </Pressable>

                    
                </SafeAreaView>
            </Animated.View>


            <Pressable
    onPress={() => navigation.navigate("addProduct")}
    style={styles.floatingButton}
>
    <Text style={styles.floatingButtonText}>+ Añadir Producto</Text>
</Pressable>

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
    admin: {
        flex: 1,
        paddingHorizontal: 35,
        gap: 15,
    },
    title: {
        textAlign: "center",
        fontWeight: '600',
        fontSize: 20,
        marginBottom: 0,
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
        borderRadius: 10,
    },

    floatingButton: {
    position: "absolute",
    bottom: 90, // deja espacio sobre la barra de navegación
    right: 20,
    backgroundColor: "#FD8721",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 6,
    zIndex: 1000,
},
floatingButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
},

    addButton: {
        position: "absolute",
        bottom: 70,
        width: "100%",
        right: 0,
        left: 0,
        alignItems: "center",
    },
    addButtonText: {
        textAlign: "center",
        padding: 10,
        backgroundColor: "#FD8721",
        width: "90%",
        borderRadius: 8,
        color: "#fff",
        fontSize: 16,
        fontWeight: '600',
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
    sidebarHeader: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    sidebarGreeting: {
        padding: 20,
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: "center",
    },
    sidebarItem: {
        color: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginTop: 10,
        fontSize: 18,
        fontWeight: '700',
    },
});
