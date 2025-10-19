import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated, SafeAreaView } from 'react-native';
import { auth } from '../firebaseConn/config';
import { useState, useEffect } from 'react';
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
import { db } from '../firebaseConn/config';

interface SidebarProps {
  navigation: any;
  slideAnim: Animated.Value;
  toggleMenu: () => void;
}

export default function SidebarUser({ navigation, slideAnim, toggleMenu }: SidebarProps) {
  const user = auth.currentUser;
  const [role, setRole] = useState("");
  async function getUserRole(userUid: string) {
    const userRoles = collection(db, "userRoles");
    const userQuery = query(userRoles, where("uid", "==", userUid));
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach(currentDoc => {

      currentDoc.data().role == "admin" ? setRole("admin") : setRole("customer");

    })



  }

return (
 
    // --- Contenido si es admin ---
    <Animated.View
      style={[
        styles.sidebar,
        { transform: [{ translateX: slideAnim }] }
      ]}
    >
      <SafeAreaView>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" }}
            style={styles.avatar}
          />
          <Text style={styles.userText}>Hola, {user?.email || "Invitado"}</Text>
        </View>

        <Pressable onPress={() => navigation.navigate("mainUser")}>
          <Text style={styles.sidebarItem}>Inicio</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Catalogo")}>
          <Text style={styles.sidebarItem}>Catálogo de donaciones</Text>
        </Pressable>

        <Pressable onPress={() => {navigation.navigate("AboutUs")}}>
          <Text style={styles.sidebarItem}>Más de Banco de alimentos</Text>
        </Pressable>

        <Pressable onPress={() => {navigation.navigate("Donaciones")}}>
          <Text style={styles.sidebarItem}>Historial de donaciones</Text>
        </Pressable>
      </SafeAreaView>
    </Animated.View>

);

}

const styles = StyleSheet.create({
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
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 150,
  },
  userText: {
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
