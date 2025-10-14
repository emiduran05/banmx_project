import { StyleSheet, Text, View, Image, Pressable, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
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

import { collection, getFirestore, addDoc } from "firebase/firestore";





//inicializa base de datod

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function Register({navigation}: any) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleForm = () => {

        if (!email || !password || !name) {
            setError("por favor, llena todos los campos")
        } else {
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    setUserRole(userCredential.user.email, userCredential.user.uid, name);
                    navigation.navigate('login', {data: true});


                })
                .catch(error => {
                    console.log("ERROR " + error.message + " " + error.doe);
                    setError("ERROR: ha ocurrido un error al intentar registrar al usuario")
                    setLoading(false);

                    if (error.code == "auth/missing-password") {
                        setError("contraseña requerida");
                    }

                    if(error.code == "auth/weak-password"){
                        setError("La contraseña debe de tener al menos 6 caracteres y un simbolo especial (*,/,@)")
                    }

                    if(error.code == "auth/invalid-email"){
                        setError("Correo electrónico invalido")
                    }
                });

        }

    }


    async function setUserRole(userEmail : any, userUid : any, userName : any){
        try {
            const docRef = await addDoc(collection(db, "userRoles"),{
                email: userEmail,
                name: userName,
                role: "customer",
                uid: userUid,
            })
        } catch (error) {
            console.log(error)
        }
    }

    function error_quit(){
        if(error){
            setTimeout(() => {
                setError("");
            }, 3000)
        }
    }

    error_quit();

    return (
        <View style={styles.main}>
            <View style={styles.r_container}>
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 600 }}>Registrate</Text>
                <View style={styles.form}>
                    <Text style={{ marginLeft: 5 }}>Nombre completo:</Text>
                    <TextInput
                        onChangeText={ text => {setName(text) }}
                        style={styles.input}
                    />
                </View>
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
                        handleForm();
                    }}
                    disabled={loading}
                >
                    <Text style={styles.button}>{loading ? "cargando..." : "Registrarme"}</Text>
                </Pressable>


                <View style={{ display: "flex", flexDirection: "row", minWidth: "100%", justifyContent: "space-around" }}>
                    <Text>¿Ya tienes cuenta?</Text>
                    <Pressable
                    onPress={() => {navigation.navigate("login", {data: false})}}
                    >
                        <Text style={{ color: "#00f" }}>Iniciar esión</Text>
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
