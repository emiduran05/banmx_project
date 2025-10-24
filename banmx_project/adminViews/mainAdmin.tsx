import { StyleSheet, Text, View, Image, Pressable, FlatList, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { db } from '../firebaseConn/config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Header from '../components/header';
import { auth } from '../firebaseConn/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MainAdmin({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const [data, setData] = useState<any[]>([]);

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

    const deleteProduct = async (id: string, title: string) => {
        Alert.alert(
            "Eliminar producto",
            `¿Seguro que deseas eliminar "${title}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "catalogue", id));
                            setData(prev => prev.filter(item => item.id !== id));
                            Alert.alert("Éxito", "Producto eliminado correctamente.");
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar el producto.");
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        getdata();
    }, []);

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
                                <Image style={{ width: 85, height: 85, borderRadius: 8 }} source={{ uri: item.image }} />
                                <View style={{ flex: 1, justifyContent: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.title}</Text>
                                    <Text style={{ fontSize: 16 }}>Precio: ${item.price} MXN</Text>
                                </View>

                                <Pressable onPress={() => deleteProduct(item.id, item.title)}>
                                    <Ionicons name="trash-outline" size={28} color="#FD5D5D" />
                                </Pressable>
                            </View>
                        )}
                    />
                </View>
            </View>

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

                    <Pressable onPress={() => navigation.navigate("EvidenciaScreen")}>
                        <Text style={styles.sidebarItem}>Historial de donaciones</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("adminBlog")}>
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
        alignItems: "center",
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
        bottom: 90,
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
