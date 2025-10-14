import { StyleSheet, Text, View, Image, Pressable, TextInput, Button } from 'react-native';
import { Platform } from 'react-native';


import { useState } from 'react';

import { db, auth } from '../firebaseConn/config';

import { initializeApp } from 'firebase/app';
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

export default function Login({navigation, route}: any){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState("");

    

    const handleLogin = () => {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            getUserRole(userCredential.user.uid);
          })
          .catch(error => {
            setLoading(false);
            console.log("ERROR " + error)
          });
          
        
        }


        
            async function getUserRole(userUid : string){
                const userRoles = collection(db, "userRoles");
                const userQuery = query(userRoles, where("uid", "==", userUid) );
                const querySnapshot = await getDocs(userQuery);
        
                querySnapshot.forEach(currentDoc => {
                    
                    currentDoc.data().role == "admin" ? navigation.navigate("mainAdmin", {data: userUid, name: currentDoc.data().name}) : navigation.navigate("mainUser");

                })
        
                
        
            }


            

        

    return(
        <View style={styles.main}>

            <Text>{Platform.Version < "23" ? "se necesita version mayor para entrar a la app" : ""}</Text>
           
            <Text style={{padding: route.params.data? 8 : 0, backgroundColor: "#ad0", color: "#fff", fontWeight: 600}}>{route.params.data ? "¡Ahora puedes iniciar sesión! " : ""}</Text>
                    <View style={styles.r_container}>
                        <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 600 }}>Iniciar Sesión</Text>

                        
                        <View style={styles.form}>
                            <Text style={{ marginLeft: 5 }}>Correo electrónico:</Text>
                            <TextInput
                                onChangeText={text => { setEmail(text) }}
                                style={styles.input}
                            />
                        </View>
        
                        <View style={styles.form}>
                            <Text style={{ marginLeft: 5 }}>Contraseña</Text>
                            <TextInput
                                onChangeText={text => { setPassword(text) }}
                                secureTextEntry={true}
                                style={styles.input}
                            />
                        </View>
        
                        <Pressable
                            onPress={() => {
                                handleLogin();
                            }}
                            disabled={loading}
                        >
                            <Text style={styles.button}>{loading ? "cargando..." : "Iniciar Sesión"}</Text>
                        </Pressable>
        
        
                        <View style={{ display: "flex", flexDirection: "row", minWidth: "100%", justifyContent: "space-around" }}>
                            <Text>¿No tienes cuenta?</Text>
                            <Pressable
                            onPress={() => {navigation.navigate("register")}}
                            >
                                <Text style={{ color: "#00f" }}>Registrate</Text>
                            </Pressable>
                        </View>
        
        
                    </View>
        
                    <Text style={{textAlign: "center", padding: error ? 5 : 0, backgroundColor: "#f00", color: "#fff"}}>{error ? error : ""}</Text>
                </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        gap: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: "#fff",
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,

    },


    r_container: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#FD8721",





    },


    input: {
        backgroundColor: "#f0f0f0ff",
        minWidth: '100%',
        padding: 10,
    },

    button: {
        padding: 10,
        backgroundColor: "#FD8721",
        color: "#fff",
        textAlign: "center",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
    }
})
