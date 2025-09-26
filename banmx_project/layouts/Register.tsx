import { StyleSheet, Text, View, Image, Pressable, TextInput, Button } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

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



const firebaseConfig = {
    apiKey: "AIzaSyCvdWPNzYrILu7QQ0-2UrcBNsypCiGBycA",
    authDomain: "banmx-app.firebaseapp.com",
    projectId: "banmx-app",
    storageBucket: "banmx-app.firebasestorage.app",
    messagingSenderId: "1085011434157",
    appId: "1:1085011434157:web:ade7d8eeeb865875ae8424",
    measurementId: "G-4G2NW5DZDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//inicializa base de datod

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function Register({navigation}: any) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForm = () => {

        if (!email || !password) {
            alert("llena todos los campos")
        } else {
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password)
                .then(userCredential => {
                    console.log("USUARIO REGISTRADO " + userCredential.user.email);
                    navigation.navigate('Home');


                })
                .catch(error => {
                    console.log("ERROR " + error.message + " " + error.doe);
                    alert("ERROR: ha ocurrido un error al intentar registrar al usuario")
                    setLoading(false);

                    if (error.code == "auth/missing-password") {
                        alert("PONLE PASSWORD");
                    }
                });

        }

    }


    return (
        <View style={styles.main}>
            <View style={styles.r_container}>
                <Text style={{ textAlign: "center", fontSize: 20, fontWeight: 600 }}>Registrate</Text>
                <View style={styles.form}>
                    <Text style={{ marginLeft: 5 }}>Nombre completo:</Text>
                    <TextInput
                        onChange={() => { }}
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
                    onPress={() => {navigation.navigate("login")}}
                    >
                        <Text style={{ color: "#00f" }}>Iniciar esión</Text>
                    </Pressable>
                </View>


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
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
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "#FD8721",





    },


    input: {
        borderRadius: 20,
        backgroundColor: "#f0f0f0ff",
        minWidth: '100%',
        padding: 10,
    },

    button: {
        padding: 10,
        backgroundColor: "#FD8721",
        borderRadius: 15,
        color: "#fff",
        textAlign: "center",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
    }
})
