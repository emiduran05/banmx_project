import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, Animated, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConn/config";
import Header from "../components/header";
import SidebarUser from "../components/SideBarUser";

type BlogPost = {
  id: string;
  titulo?: string;
  imagen?: string;
  texto?: string;
  fecha?: string;
};

export default function BlogDetail({ route, navigation }: any) {
  const postId: string | undefined = route?.params?.id;
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const toggleMenu = () => setMenu(!menu);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menu ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menu]);

  useEffect(() => {
    let cancelled = false;
    async function fetchPost() {
      if (!postId) {
        setError("Falta el id de la publicación");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const ref = doc(db, "blog", String(postId));
        const snap = await getDoc(ref);
        if (!cancelled) {
          if (snap.exists()) {
            const data = snap.data() as Omit<BlogPost, "id">;
            setPost({ id: snap.id, ...data });
          } else {
            setPost(null);
            setError("La publicación no existe");
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error al cargar el detalle");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPost();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator color="#FD8721" size="large" />
          <Text style={{ marginTop: 8 }}>Cargando…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.container, styles.center]}>
          <Text style={{ color: "#b00" }}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }



  if (!post) {
    return (
     <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, styles.center]}>
         <Text>No se encontró la publicación.</Text>
       </View>
     </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header onMenuPress={toggleMenu} />
      <SidebarUser navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backTxt}>← Volver</Text>
        </Pressable>
        
        {post.imagen ? (
          <Image source={{ uri: post.imagen }} style={styles.cover} />
        ) : null}
        <Text style={styles.title}>{post.titulo || "Publicación"}</Text>
        {post.fecha ? <Text style={styles.date}>{post.fecha }</Text> : null}
        <Text style={styles.body}>{post.texto || "Sin contenido"}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cover: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  date: {
    fontSize: 10,
    color: "#666",
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  backBtn: { 
    paddingVertical: 6, 
    marginBottom: 10, 
    alignSelf: "flex-start" 
  },
  backTxt: { 
    fontSize: 18, 
    color: "#FD8721", 
    fontWeight: "600" 
  },
});
