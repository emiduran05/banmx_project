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
} from "react-native";
import { getDocs, collection } from "firebase/firestore";
import Header from "../components/header";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebaseConn/config";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebaseConn/config";

export default function Base({ navigation }: any) {
    const user = auth.currentUser;
    const [menu, setMenu] = useState(false);
    const [data, setData] = useState([]);
    const slideAnim = useRef(new Animated.Value(-300)).current;
    const toggleMenu = () => setMenu(!menu);

    

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: menu ? 0 : -300,
            duration: 300,
            useNativeDriver: true,
        }).start();

    }, [menu]);

    // Activar/desactivar productos
 

    // Actualizar cantidad
    

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header onMenuPress={toggleMenu} />
            <SidebarUser navigation={navigation} slideAnim={slideAnim} toggleMenu={toggleMenu} />

           

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding: 30,
    },


});
