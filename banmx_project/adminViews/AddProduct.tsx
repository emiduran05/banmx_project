import React, { useState } from "react";
import { View, Button, Image, Text, ActivityIndicator, TextInput, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, getFirestore, addDoc } from "firebase/firestore";

import { db } from "../firebaseConn/config";

export default function AddProduct({navigation}: any) {
  const [image, setImage] = useState(null);  // URI local
  const [url, setUrl] = useState(null);      // URL pública en Cloudinary
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  // Elegir imagen desde galería
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Subir imagen a Cloudinary
  const uploadImage = async () => {


  if (!image) return;
  setLoading(true);


  try {
    const data = new FormData();
    data.append("file", {
      uri: image,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    data.append("upload_preset", "ml_default"); // tu preset unsigned

    const res = await fetch("https://api.cloudinary.com/v1_1/dzra5elov/image/upload", {
      method: "POST",
      body: data,
    });

    const json = await res.json();
    console.log("Respuesta completa de Cloudinary:", json); // 🔍 mira qué devuelve

    if (json.secure_url) {
      setUrl(json.secure_url);
      setProduct(title, price, json.secure_url);
      setLoading(false);
      navigation.navigate("mainAdmin", ({data: null, name: null}))
      console.log("Imagen subida a Cloudinary:", json.secure_url);
    } else {
      console.error("No se recibió secure_url. Revisa el preset y la imagen.");
    }
  } catch (error) {
    console.error("Error al subir imagen:", error);
  } finally {
    {/**/}
  }

  

};


async function setProduct(productTitle : any, productPrice : any, productImage : any){
        try {
            const docRef = await addDoc(collection(db, "catalogue"),{
                image: productImage,
                price: productPrice,
                title: productTitle,
            })
        } catch (error) {
            console.log(error)
        }
    }

  const saveProduct = async () => {
    if (!title || !price || !url) {
      alert("Llena todos los campos y sube una imagen");
      return;
    }

    // Aquí puedes guardar en Firestore, Supabase o tu backend
    console.log("Producto listo para guardar:", { title, price, url });
  };

  return (
    <View style={{ padding: 30, flex: 1, justifyContent: "center", gap: 10, }}>
      <Text style={{textAlign: "center", fontWeight: 600}}>Agregar Producto:</Text>
      <Text>Titulo:</Text>  
      <TextInput
        placeholder="Nombre del producto"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: "#FD8721", marginBottom: 10, padding: 8 }}
      />

      <Text>Precio:</Text>
      <TextInput
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderColor: "#FD8721", marginBottom: 10, padding: 8 }}
      />

      <Button title="Seleccionar imagen" onPress={pickImage} disabled={loading} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 10 }} />
      )}

      <Pressable onPress={() => {

        if(!title || !price || !image){
            alert("llena todos los campos")
        }else{
            uploadImage()

        }
        
        }} disabled={loading}>
        <Text style={{textAlign: "center", padding: 8, backgroundColor: "#FD8721", color: "#fff"}}>Subir Producto</Text>
      </Pressable>
      {loading && <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />}

      

    </View>
  );
}
