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
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConn/config";

export default function Profile({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const [data, setData] = useState([]);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const [name, setName] = useState("")
    const toggleMenu = () => setMenu(!menu);

    async function getUserName(userUid: any) {
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
            <Header onMenuPress={toggleMenu} />
            <SidebarUser navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} />
            <View style={styles.main}>
                <Text style={{textAlign: "center", fontSize: 18, fontWeight: 600}}>Mi Perfil:</Text>

                <Image
                    source={{uri: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}}
                    style={{height: 100, width: 100, borderRadius: 150}}
                
                />
                
                <Text>{name}</Text>
                <Text style={{textAlign: "center", fontSize: 16, }}>Correo: {user?.email}</Text>

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

                            <Pressable style={styles.changePassContainer}
                                onPress={() => {
                                    navigation.navigate("Home");
                                    auth.signOut();
                                }}
                            >
                                <Text style={styles.changePass}>Cerrar Sesión</Text>
                            </Pressable>


            </View>
            </View>
           

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 40,
        padding: 30,
    },

    changePassContainer: {
    display: "flex",
    gap: 10,
  },

  changePass: {
    
    textAlign: "center",

    padding: 10,
    backgroundColor: "#FD8721",
    color: "#fff",
    fontWeight: 600,

  }

});
