import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Image, Pressable } from 'react-native';
import { useState, useEffect } from 'react';

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

//imports firestor
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


const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROHECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//inicializa base de datod

const db = getFirestore(app);

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Image
          source={require("./assets/images (3).png")}
        />

        <Pressable>
          <Text style={{textAlign: 'center', padding: 10, backgroundColor: "#FD8721", color: '#fff', borderRadius: 20}}>
            Iniciar Sesión
          </Text>

        </Pressable>

          <Pressable>
            <Text style={{textAlign: 'center', padding: 10, backgroundColor: "#FD8721", color: '#fff', borderRadius: 20}}>
              Registrate
            </Text>

          </Pressable>
        
        
       

        <View style={styles.info_container}>
          <Text style={{ color: '#fff', transform: [{rotate: '-45deg'}], fontSize: 10, textAlign: 'center' }}>Aproximadamente el 31.5% de la población
            en Jalisco sufre Inseguridad Alimenatria,
            ayudanos areducir este número donando.</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    gap: 20,

  },

  info_container: {
    padding: 20,
    width: 150,
    height: 150,
    backgroundColor: "#FCBC15",
    borderRadius: 55,          // bordes redondeados
    transform: [{ rotate: "45deg" }], 
    margin: 'auto',
    marginTop: 20,
    display: 'flex',
    justifyContent: 'center'
  }

 

});
