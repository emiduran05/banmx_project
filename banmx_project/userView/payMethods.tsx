
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

export default function PayMethods({ navigation }: any) {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const toggleMenu = () => setMenu(!menu);
  



  async function getPayInfo(userUid : string){
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
        <Text style={{textAlign: "center", fontSize: 18, fontWeight: 600}}>Metodos de pago</Text>
        {loading ? (      <Image source={{uri: "https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif"}} style={{height: 70, width: 70, margin: "auto"}} />
) : data.length == 0 ? (<Text style={{textAlign: "center"}}>No tienes metodos de pago agregados</Text>) : (
            <FlatList
                      data={data}
                      keyExtractor={(_, i) => i.toString()}
                      contentContainerStyle={styles.main}

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
        )}
        
                    
    </View>

    <Pressable style={styles.floatingButtonText}
        onPress={() => {navigation.navigate("addPayment")}}
    >
        <Text style={{color: "#fff"}}>+ Añadir método de pago</Text>

    </Pressable>


    
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
    main: {
        padding: 20,
        flex: 1,
        gap: 20,
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
    zIndex: 1000,
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


