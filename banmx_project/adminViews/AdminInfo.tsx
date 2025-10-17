import { StyleSheet, Text, View, Animated, Image, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/header';
import { auth } from '../firebaseConn/config';
import Sidebar from '../components/Sidebar';
import { Auth } from 'firebase/auth';
import { db } from '../firebaseConn/config';


import {
  initializeAuth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  UserCredential,
  sendPasswordResetEmail
} from 'firebase/auth';

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
import SidebarUser from '../components/SideBarUser';


export default function AdminInfo({ navigation }: any) {

  const user = auth.currentUser;
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState("");
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const toggleMenu = () => setMenu(!menu);

  async function getUserName(userUid: string) {
    const userRoles = collection(db, "userRoles");
    const userQuery = query(userRoles, where("uid", "==", userUid));
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach(currentDoc => {

      setName(currentDoc.data().name)
    })

  }



  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menu ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
    getUserName(user.uid);

  }, [menu]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View >
        <Header onMenuPress={toggleMenu} />
        <View style={styles.main}>
          <Text style={styles.title}>Información de Administrador: </Text>

          <View style={styles.main_profile_view}>
            <Image
              source={{ uri: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" }}
              style={{ height: 70, width: 70, borderRadius: 160 }}
            />

            <Text>{name}</Text>
          </View>

          <Text style={styles.title}>Organización:</Text>
          <Image
            source={{ uri: "https://bamx.org.mx/wp-content/uploads/2023/10/RED-BAMX.png" }}
            style={{ height: 110, width: "80%", margin: "auto" }}

          />
          <Text style={{ textAlign: "center", fontSize: 16, }}>Banco de alimentos</Text>

          <View style={styles.changePassContainer}>
            <Pressable
              onPress={async () => {
                try {
                  if (!user?.email) {
                    alert("No hay un correo asociado al usuario actual.");
                    return;
                  }

                  await sendPasswordResetEmail(auth, user.email);
                  alert("Te enviamos un correo para restablecer tu contraseña.");
                } catch (error: any) {
                  console.log(error);
                  if (error.code === "auth/invalid-email") {
                    alert("El correo no es válido.");
                  } else if (error.code === "auth/user-not-found") {
                    alert("No se encontró un usuario con ese correo.");
                  } else {
                    alert("Ocurrió un error al enviar el correo de recuperación.");
                  }
                }
              }}
            >
              <Text style={styles.changePass}>Cambiar Contraseña</Text>
            </Pressable>

            <Text style={{ textAlign: "center" }}>(Se enviará un correo a "{user.email}")</Text>

          </View>


          <Pressable
            onPress={() => {
              navigation.navigate("Home");
              auth.signOut();
            }}
          >
            <Text style={{ textAlign: "center", padding: 8, backgroundColor: "#FCBC15", color: "#fff", width: "50%", margin: "auto" }}>Cerrar Sesión</Text>
          </Pressable>

        </View>
      </View>

      <Sidebar navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} ></Sidebar>
    

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({


  main: {
    padding: 25,
    display: "flex",
    gap: 25,
  },

  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 600,
  },

  main_profile_view: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,

  },

  changePassContainer: {
    display: "flex",
    gap: 10,
  },

  changePass: {
    textAlign: "center",
    padding: 8,
    backgroundColor: "#FD8721",
    color: "#fff",
    fontWeight: 600,

  }


})