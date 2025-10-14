import { StyleSheet, Text, View, Image, Pressable, FlatList, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';


export default function sidebar(){
    const slideAnim = useRef(new Animated.Value(-300)).current; // posición inicial fuera de pantalla


    return(
        <Animated.View
                style={[
                    styles.sidebar,
                    { transform: [{ translateX: slideAnim }] }
                ]}
            >
                <SafeAreaView>
                    <Text style={{ padding: 20, fontSize: 18, fontWeight: '700', color: '#fff' }}>Menú Principal</Text>
                    <Pressable onPress={() => navigation.navigate("addProduct")}>
                        <Text style={styles.sidebarItem}>Añadir producto</Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("profile")}>
                        <Text style={styles.sidebarItem}>Mi perfil</Text>
                    </Pressable>
                    <Pressable onPress={toggleMenu}>
                        <Text style={styles.sidebarItem}>Cerrar menú</Text>
                    </Pressable>
                </SafeAreaView>
            </Animated.View>
    )
}

const styles = StyleSheet.create({
        sidebar: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "70%",
        backgroundColor: '#FD8721',
        zIndex: 100,
        elevation: 10,
        paddingTop: 40,
    },
    sidebarItem: {
        color: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '500',
    },
})