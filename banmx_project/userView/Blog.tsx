import SidebarUser from "../components/SideBarUser";
import {
    StyleSheet,
    Text,
    View,
    Image,
    Pressable,
    TextInput,
    Button,
    FlatList,
    SafeAreaViewBase,
    Animated,
    ScrollView
} from "react-native";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    onSnapshot,
    QuerySnapshot

} from 'firebase/firestore';
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from 'react-native-safe-area-context';


import { db } from "../firebaseConn/config";
import { useNavigation } from "@react-navigation/native";

export default function Blog({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const nav = useNavigation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);

    const getPosts = async () => {
            const blogCollection = collection(db, "blog");
            const querySnapshot = await getDocs(blogCollection);
            const dataArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(dataArray);
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
                <SidebarUser navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} />
    
                <View style={styles.main}>
                    <Text style={{ textAlign: "center", fontSize: 18, fontWeight: "600", marginBottom: 20 }}>
                        Blog
                    </Text>
                    
    
                    <FlatList
                        style={{ flex: 1, paddingBottom: 30 }}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        data={posts}
                        keyExtractor={item => item.id}
                        contentContainerStyle={{ padding: 16, gap: 12 }}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => nav.navigate("BlogDetail", { id: item.id })}
                                style={({ pressed }) => [styles.card, pressed && { opacity: 0.6 }]}
                            >
                                <View style={styles.user_blog}>
                                    <Image style={{ width: 70, height: 70 }} source={{ uri: item.image }} />
    
                                    <View style={{ gap: 10, justifyContent: "space-around", flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "700" }} numberOfLines={1}>
                                            {item.title || "Publicación"}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: "#444" }} numberOfLines={2}>
                                            {item.excerpt || "Toca para leer más…"}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        ListEmptyComponent={<Text style={{ textAlign: "center" }}>No hay publicaciones aún…</Text>}
                    />
                </View>
            </SafeAreaView>
        );
    }
    
    const styles = StyleSheet.create({
        main: {
            flex: 1,
            padding: 30,
        },
    
        user_blog: {
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

        card: {
            backgroundColor: "#fff",
            borderRadius: 8,
            elevation: 2,
            padding: 12,
        },
    });