
import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";

import {
    initializeAuth,
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    UserCredential,
    sendPasswordResetEmail
} from 'firebase/auth';

import { collection, getFirestore, addDoc } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyCvdWPNzYrILu7QQ0-2UrcBNsypCiGBycA",
    authDomain: "banmx-app.firebaseapp.com",
    projectId: "banmx-app",
    storageBucket: "banmx-app.firebasestorage.app",
    messagingSenderId: "1085011434157",
    appId: "1:1085011434157:web:ade7d8eeeb865875ae8424",
    measurementId: "G-4G2NW5DZDX"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app)