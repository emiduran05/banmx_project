
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

export default function PaymentDetails({ navigation, route }: any) {
    const user = auth.currentUser;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [menu, setMenu] = useState(false);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);



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


    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();
        getPayInfo(user.uid)

        // console.log(route.params.data)


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
                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}>Detalles finales</Text>
                <FlatList
                    data={route.params.data}
                    style={{maxHeight: 200}}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={styles.main}
                    renderItem={({ item }) => (
                        <View style={styles.last_moves}>
                            <Image
                                source={{
                                    uri:
                                        item.image ||
                                        "https://www.laranitadelapaz.com.mx/images/thumbs/0005559_frijol-negro-jamapa-verde-valle-bolsa-de-1-kg_625.jpeg",
                                }}
                                style={{ height: 50, width: 50, borderRadius: 5 }}
                            />

                            <View>
                                <Text style={styles.bold}>Producto:</Text>
                                <Text >{item.title || "Bolsa de frijoles"}</Text>
                            </View>

                            <View>
                                <Text style={styles.bold}>Precio:</Text>
                                <Text>${item.price || 299} mxn</Text>
                            </View>

                            <View>
                                <Text style={styles.bold}>Cantidad:</Text>
                                <Text style={{ textAlign: "center" }}>{item.quantity || "11/11/2025"}</Text>
                            </View>
                        </View>
                    )}
                />

                <Text style={{ textAlign: "center", fontSize: 18, fontWeight: 600 }}>Escoger metodo de pago: </Text>

                <FlatList
                    data={data}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={styles.main}
                    style={{ maxHeight: 200}}

                    renderItem={({ item }) => (
                        <View style={styles.methods}>


                            <View>
                                <Text style={styles.bold}>Tarjeta con terminación: </Text>
                                <Text>**{item.card_number.slice(-4) || "Bolsa de frijoles"}</Text>
                            </View>

                            <View>
                                <Text style={styles.bold}>Exp date: </Text>
                                <Text>{item.exp_date || 2}</Text>
                            </View>

                            <View>
                                <Text style={styles.bold}>Titular:</Text>
                                <Text>{item.titular || 2}</Text>
                            </View>


                        </View>
                    )}
                />

                <Pressable style={styles.button}>
                    <Text style={{textAlign: "center", color: "#fff"}}>Aggregar Método de pago</Text>
                </Pressable>

                <Pressable style={styles.button}>
                    <Text style={{textAlign: "center", color: "#fff"}}>Donar</Text>
                </Pressable>





            </View>





        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    main: {
        padding: 15,
        gap: 10
    },

    last_moves: {
        backgroundColor: "#fff",
        marginBottom: 15,
        padding: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        elevation: 2,
    },

    bold: {
        fontWeight: 600,
    },


    methods: {

        backgroundColor: "#fff",
        padding: 10,
        elevation: 4,
        display: "flex",
        gap: 20,
        marginBottom: 10,
    },

    button: {
        padding: 10,
        marginTop: 10,
        backgroundColor: "#FD8721"
    },



}
)


