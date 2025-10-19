import SidebarUser from "../components/SideBarUser";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Animated,
    Switch,
    TextInput,
    Pressable,
    ScrollView,
    Linking,
} from "react-native";
import { getDocs, collection } from "firebase/firestore";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConn/config";

export default function AboutUs({ navigation }: any) {
  const user = auth.currentUser;
      const [menu, setMenu] = useState(false);
      const [data, setData] = useState([]);
      const slideAnim = useRef(new Animated.Value(-300)).current;
      const toggleMenu = () => setMenu(!menu);
      const handlePress = () => {
        Linking.openURL('https://bdalimentos.org/');
      }
  
      
  
      useEffect(() => {
          Animated.timing(slideAnim, {
              toValue: menu ? 0 : -300,
              duration: 300,
              useNativeDriver: true,
          }).start();
  
      }, [menu]);
      
  
    return (
      <SafeAreaView>
      <SidebarUser navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} />

        
    <View >
      <Header onMenuPress={toggleMenu} />

      <ScrollView contentContainerStyle={styles.main}>
        <Text style={styles.title}>¿Qué es Banco de Alimentos?</Text>
        <Text style={styles.text}>
          Banco de Alimentos Guadalajara es una organización sin fines de lucro con la misión de generar acceso a una alimentación digna para personas en situación vulnerable en nuestra comunidad. Nuestro objetivo es contribuir a la reducción de la inseguridad alimentaria que afecta a más de un millón doscientas mil personas en el Estado de Jalisco.
        </Text>
        <Text style={styles.title}>Nuestra Misión</Text>
        <Text style={styles.text}>
          Generar acceso a una alimentación digna para personas en situación vulnerable en nuestra comunidad.
        </Text>
        <Text style={styles.link}
        onPress={handlePress}>Sitio Oficial</Text>
        <View style={styles.logoContainer}>
          <Pressable onPress={() => Linking.openURL('https://www.facebook.com/BDAGDL/')}>
         <Image
            source={require('../assets/FaceLog.png')}
            style={styles.logo}
          />
          </Pressable>
          <Pressable onPress={() => Linking.openURL('https://x.com/BDAGDL')}>
          <Image
            source={require('../assets/LogTweet.png')}
            style={styles.logo}
          />
          </Pressable>
          <Pressable onPress={() => Linking.openURL('https://www.instagram.com/bda_guadalajara/')}>
          <Image
            source={require('../assets/InstLog.png')}
            style={styles.logo}
          />
          </Pressable>
        </View>
        <Image
          source={require('../assets/ImagenSinFondo.png')}
          style={{ width: '100%', height: 400, marginBottom: 20, resizeMode: 'contain' }}
        />
      </ScrollView>
    </View>
      </SafeAreaView>

  );

}

const styles = StyleSheet.create({
    main: {
        padding: 30,
    },
    title: {
        textAlign: "center",
        fontWeight: 600,
        fontSize: 24,
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
        fontWeight: 400,
    },
    link: {
      color: 'blue',
      textDecorationLine: 'underline',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },
    logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 15,
    },
    logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },



});