import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    FlatList,
    Animated,
    Alert,
} from "react-native";
import {
    collection,
    getDocs,
    doc,
    deleteDoc
} from 'firebase/firestore';
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from "../firebaseConn/config";
import { useNavigation } from "@react-navigation/native";
import Sidebar from "../components/Sidebar";
import Ionicons from "react-native-vector-icons/Ionicons"; // 🧩 asegúrate de tenerlo instalado

export default function Blog({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const nav = useNavigation();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);

    const getPosts = async () => {
        try {
            const blogCollection = collection(db, "blog");
            const querySnapshot = await getDocs(blogCollection);
            const dataArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(dataArray);
        } catch (error) {
            console.error("Error al cargar publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🗑️ Función para borrar publicaciones
    const deletePost = async (id: string, title: string) => {
        Alert.alert(
            "Eliminar publicación",
            `¿Seguro que deseas eliminar "${title}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "blog", id));
                            setPosts(prev => prev.filter(item => item.id !== id));
                            Alert.alert("Eliminado", "La publicación fue eliminada correctamente.");
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar la publicación.");
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();

        getPosts();
    }, [menu]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header onMenuPress={toggleMenu} />
            <Sidebar navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} />

            <View style={styles.main}>
                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
                    Blog
                </Text>

                <FlatList
                    style={{ flex: 1, paddingBottom: 30 }}
                    contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}
                    data={posts}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Pressable
                                onPress={() => nav.navigate("BlogDetail", { id: item.id })}
                                style={({ pressed }) => [styles.user_blog, pressed && { opacity: 0.6 }]}
                            >
                                {item.imagen ? (
                                    <Image
                                        style={{ width: 70, height: 70, borderRadius: 8 }}
                                        source={{ uri: item.imagen }}
                                    />
                                ) : null}

                                <View style={{ gap: 10, justifyContent: "space-around", flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "700" }} numberOfLines={1}>
                                        {item.titulo || "Publicación"}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: "#444" }} numberOfLines={2}>
                                        {item.texto || "Toca para leer más…"}
                                    </Text>
                                    {item.fecha ? (
                                        <Text style={{ fontSize: 12, color: "#666" }} numberOfLines={1}>
                                            {item.fecha}
                                        </Text>
                                    ) : null}
                                </View>
                            </Pressable>

                            {/* Botón de borrar */}
                            <Pressable onPress={() => deletePost(item.id, item.titulo || "esta publicación")}>
                                <Ionicons name="trash-outline" size={26} color="#FD5D5D" />
                            </Pressable>
                        </View>
                    )}
                />
            </View>

            <Pressable
                onPress={() => navigation.navigate("addBlog")}
                style={styles.floatingButton}
            >
                <Text style={styles.floatingButtonText}>+ Añadir Blog</Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 30,
    },
    user_blog: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 3,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
});
