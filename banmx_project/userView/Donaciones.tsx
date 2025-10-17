
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
import { db } from "../firebaseConn/config";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Donaciones({ navigation }: any) {
  const user = auth.currentUser ? auth.currentUser : {uid: "invitado"};
  const [loading, setLoading]  = useState(true);
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const toggleMenu = () => setMenu(!menu);

  async function getDonations(userUid: string) {
    const donations = collection(db, "donaciones");
    const donationsQuery = query(donations, where("uid", "==", userUid))
    const querySnapshot = await getDocs(donationsQuery);
    const dataArray = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setData(dataArray);
    setLoading(false);

  }


  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menu ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
    getDonations(user.uid);

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
      <Text
        style={{
          textAlign: "center",
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 10,
        }}
      >
        Historial de donaciones
      </Text>

       {loading ? (
            <Image source={{uri: "https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif"}} style={{height: 70, width: 70, margin: "auto"}} />
          ) : data.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 10 }}>
              Aún no hay donaciones...
            </Text>
          ) : (
            <FlatList
              data={data}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={styles.main}
              renderItem={({ item }) => (
                <View style={styles.last_moves}>
                  <Image
                    source={{
                      uri:
                        item.imagen ||
                        "https://www.laranitadelapaz.com.mx/images/thumbs/0005559_frijol-negro-jamapa-verde-valle-bolsa-de-1-kg_625.jpeg",
                    }}
                    style={{ height: 50, width: 50, borderRadius: 5 }}
                  />
      
                  <View>
                    <Text style={styles.bold}>{item.name || "Bolsa de frijoles"}</Text>
                    <Text>Cantidad: {item.cantidad || 2}</Text>
                  </View>
      
                  <View>
                    <Text style={styles.bold}>Donación:</Text>
                    <Text>${item.donacion || 299} mxn</Text>
                  </View>
      
                  <View>
                    <Text style={styles.bold}>Fecha:</Text>
                    <Text>{item.fecha || "11/11/2025"}</Text>
                  </View>
                </View>
              )}
            />
          )}
    </View>
  </SafeAreaView>
);

}


const styles = StyleSheet.create({

  main: {
    flex: 1,
    padding: 10,
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

  },

  mainText: {
    textAlign: "center",
    fontWeight: 600,
    fontSize: 18,
    color: "#fff",
  },

  button: {
    padding: 20,
    textAlign: "center",
    width: "50%",
    margin: "auto",
    marginBottom: 20,
    color: "#fff",
    fontWeight: 600,
    backgroundColor: "#FCBC15"
  },

  last_moves: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderBottomColor: "#000"

  },

  bold: {
    fontWeight: 600,
  },

  payment_info: {
    padding: 10,
  }


})