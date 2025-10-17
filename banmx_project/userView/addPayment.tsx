
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

export default function addPayment({ navigation }: any) {
    const user = auth.currentUser;
    const [titular, setTitular] = useState("");
    const [card, setCard] = useState("");
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(false);
    const [name, setName] = useState("");
    const [data, setData] = useState([]);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);
    const [expDate, setExpDate] = useState('');

    const handleChange = (text: string) => {
        // Eliminar cualquier caracter que no sea número
        let cleaned = text.replace(/\D/g, '');

        // Agregar "/" después de los primeros 2 dígitos
        if (cleaned.length > 2) {
        cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }

        setExpDate(cleaned);
    };




    async function getPayInfo(userUid: string) {
        const payInfos = collection(db, "payment_methods");
        const payInfosQuery = query(payInfos, where("uid", "==", userUid))
        
        

        const querySnapshot = await getDocs(payInfosQuery);
        const dataArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setLoading(false);
        setData(dataArray);

    }


    async function publish(titular : any, card : any, expDate : any, uid : any){
        try {
            const docRef = await addDoc(collection(db, "payment_methods"),{
                card_number: card,
                titular: titular,
                exp_date: expDate,
                uid: uid,
                imagen: "",
            })
        } catch (error) {
            console.log(error)
        }
    }




    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();

        getPayInfo(user.uid);

    }, [menu]);



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header onMenuPress={toggleMenu} />
            <SidebarUser
                navigation={navigation}
                slideAnim={slideAnim}
                toggleMenu={toggleMenu}
            />
            <View style={styles.main}>
                <Text style={styles.title}>Agregar método de pago</Text>
                <View>
                    <Text>Titular de la tarjeta: </Text>
                    <TextInput
                    onChangeText={text => {setTitular(text) }}
                    style={styles.input}
                />
                </View>
                <View>
                    <Text>Número de tarjeta: </Text>
                    <TextInput
                    onChangeText={text => {setCard(text)}}
                    style={styles.input}
                />
                </View>

                <View style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                    <View>
                        <Text>Fecha de expiración: </Text>
                        <TextInput
                            value={expDate}
                            onChangeText={handleChange}
                            keyboardType="number-pad"
                            maxLength={5} // MM/AA
                            placeholder="MM/AA"
                            style={{
                            height: 50,
                            borderWidth: 1,

                            borderColor: '#000',
                            paddingHorizontal: 10,
                            marginTop: 5,
                            borderRadius: 5,
                            }}
                        />
                    </View>
                    
                    <View style={{width: 100}}>
                        <Text>CVV:</Text>

                        <TextInput 
                            keyboardType="number-pad"
                            maxLength={3}
                            style={{height: 50,
                                borderWidth: 1,

                                borderColor: '#000',
                                paddingHorizontal: 10,
                                marginTop: 5,
                                borderRadius: 5,}}
                            onChangeText={(text) => {console.log(text)}}


                        
                        />

                    </View>

                    
                </View>

                <Pressable
                    onPress={() => {
                        if(titular == "" || card == "" || expDate == ""){
                            alert("llena todos los campos")
                        }else{
                            publish(titular,card,expDate, user.uid);
                            navigation.navigate("payMethods")
                        }
                    }}
                
                >
                    <Text style={{textAlign: "center", padding: 10, backgroundColor: "#FD8721", color: "#fff"}}>Agregar método de pago</Text>
                </Pressable>
                
            </View>

        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    main: {
        padding: 30,
        flex: 1,
        gap: 20,
    },

    title: {
        textAlign: "center",
        fontWeight: 600,
        fontSize: 18,
        marginBottom: 20,
    },

    input: {
        height: 50,             // alto visible
        borderWidth: 1,         // borde
        borderColor: "#000",    // color del borde
        paddingHorizontal: 10,  // espacio interno
        marginTop: 10,          // separación del título
        borderRadius: 5,  
        width: "100%"
    },

    floatingButtonText: {
        color: "#fff",
        position: "absolute",
        bottom: 90, // deja espacio sobre la barra de navegación
        right: 20,
        backgroundColor: "#FD8721",
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 6,
        zIndex: 2,
    },

    methods: {
        backgroundColor: "#fff",
        padding: 10,
        elevation: 4,
        display: "flex",
        gap: 20,
    },

    bold: {
        fontWeight: 600,
    }
}
)


