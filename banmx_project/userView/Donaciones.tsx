import SidebarUser from "../components/SideBarUser";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Animated,
  Linking,
} from "react-native";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConn/config";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Donaciones({ navigation }: any) {
  const user = auth.currentUser ? auth.currentUser : { uid: "invitado" };
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const [data, setData] = useState([]);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const toggleMenu = () => setMenu(!menu);

  // 🔹 Obtener donaciones
  async function getDonations(userUid: string) {
    const donations = collection(db, "donaciones");
    const donationsQuery = query(donations, where("uid", "==", userUid));
    const querySnapshot = await getDocs(donationsQuery);
    const dataArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setData(dataArray);
    setLoading(false);
  }

  // 🔹 Compartir en X (Twitter)
  const compartirEnX = (item: any) => {
    const mensaje = encodeURIComponent(
      `🍎💚 ¡Mira mi donación al Banco de Alimentos!  
Producto: ${item.name || "Donación"}  
Monto: $${item.donacion || 0} MXN  
¡Únete tú también a donar! 🙌`
    );

    const imagenURL = encodeURIComponent(item.evidenciaIMG || item.imagen);
    const tweetURL = `https://twitter.com/intent/tweet?text=${mensaje}&url=${imagenURL}`;

    Linking.openURL(tweetURL).catch((err) =>
      console.error("Error abriendo X:", err)
    );
  };

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
          <ActivityIndicator size="large" color="#FD8721" />
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
              <ScrollView>
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
                    <Text style={styles.bold}>
                      {item.name || "Bolsa de frijoles"}
                    </Text>
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

                <View
                  style={{
                    backgroundColor: "#fff",
                    padding: 5,
                    marginBottom: 10,
                  }}
                >
                  <Text>Pagado con: {item.card}</Text>
                </View>

                {item.evidenciaIMG != "" ? (
                  <View style={{ display: "flex", gap: 20 }}>
                    <Text style={{ textAlign: "center" }}>
                      ¡Muchas gracias por la donación! Att: Banco de Alimentos
                    </Text>
                    <Image
                      source={{ uri: item.evidenciaIMG }}
                      style={{
                        height: 200,
                        width: "100%",
                        alignSelf: "center",
                        marginBottom: 10,
                      }}
                    />

                    {/* 🔹 Botón para compartir en X */}
                    <Pressable
                      onPress={() => compartirEnX(item)}
                      style={styles.xButton}
                    >
                      <Text style={styles.xText}>Compartir en X </Text>
                    </Pressable>
                  </View>
                ) : (
                  ""
                )}
              </ScrollView>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    overflow: "scroll",
    padding: 10,
  },
  last_moves: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#000",
  },
  bold: {
    fontWeight: "600",
  },
  xButton: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 8,
    alignSelf: "center",
    marginBottom: 10,
  },
  xText: {
    color: "#fff",
    fontWeight: "600",
  },
});
