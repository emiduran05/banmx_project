
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

export default function MainUser({ navigation }: any) {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
    setData(dataArray);

  }


  async function getUserName(userUid: string) {
    const userRoles = collection(db, "userRoles");
    const userQuery = query(userRoles, where("uid", "==", userUid));
    const querySnapshot = await getDocs(userQuery);

    querySnapshot.forEach(currentDoc => {


      setName(currentDoc.data().name);



    })



  }

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menu ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();

    getUserName(user.uid);
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

    <View style={styles.userInfo}>
      <Image
        source={{
          uri: "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        }}
        style={{ height: 90, width: 90, alignSelf: "center", borderRadius: 150 }}
      />

      <Text style={styles.mainText}>{name}</Text>
      <Text style={styles.mainText}>{user.email}</Text>
    </View>

    <Pressable
      onPress={() => {navigation.navigate("payMethods")}}
    >
      <Text style={styles.button}>Métodos de pago:</Text>
    </Pressable>

    <Pressable>
      <Text style={styles.button}>Editar perfil:</Text>
    </Pressable>

    <Text style={styles.title}>Últimos movimientos:</Text>

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
  </SafeAreaView>
);

}


const styles = StyleSheet.create({

  main: {
    height: 400,
    padding: 20,
    overflow: "scroll"
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

  userInfo: {
    width: "100%",
    backgroundColor: "#FD8721",
    display: "flex",
    gap: 20,
    padding: 20,
    marginBottom: 20,
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
  }


})