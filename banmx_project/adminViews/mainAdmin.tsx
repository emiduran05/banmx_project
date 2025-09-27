import { StyleSheet, Text, View, Image, Pressable, TextInput, Button, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

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


export default function MainAdmin({ navigation, route }: any) {

    const name = route.params.name;
    const uid = route.params.data;
    const [data, setData] = useState([]);

    const getdata = async () => {
        const catalogue = collection(db, "catalogue");
        const querySnapshot = await getDocs(catalogue);

        const dataArray = querySnapshot.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));


        setData(dataArray);
    }

    useEffect(() => {
        getdata();
    }, [])

    return (
        <View style={styles.main}>
            <Text style={{ textAlign: "center", fontWeight: 600, fontSize: 20 }}>Mi catálogo:</Text>
            <View style={styles.admin}>
                {/* inicio del for */}
                <FlatList
                    data={data}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.admin_products}>
                                <Image
                                    style={{ width: 100, height: 100, }}
                                    source={{ uri: item["image"] }}
                                />
                                <View style={{ display: "flex", gap: 15, justifyContent: "center" }}>
                                    <Text style={{ fontSize: 18, fontWeight: 600, }} >{item["title"]}</Text>
                                    <Text style={{ fontSize: 16, }} >Precio: ${item["price"]} MXN</Text>
                                </View>
                            </View>
                        )

                    }}
                
                />



                {/* fin del for */}

            </View>
            <Pressable style={{ position: "absolute", bottom: 70, right: 0, left: 0 }}
                onPress={() => {
                    navigation.navigate("addProduct")
                }}
            >
                <Text style={{ textAlign: "center", padding: 8, backgroundColor: "#FD8721", width: "90%", margin: "auto", color: "#fff", borderRadius: 15, }}>+ Añadir Producto</Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    main: {
        flex: 1,
        display: "flex",
        padding: 30,
        gap: 20,

    },

    admin: {
        padding: 5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 15,

    },

    admin_products: {
        minWidth: "100%",
        marginTop: 10,
        gap: 20,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        padding: 10,
        // Sombra Android
        elevation: 4,
    }
})