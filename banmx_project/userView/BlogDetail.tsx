import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BlogDetail({ route, navigation }: any) {
  const { id } = route?.params ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del blog</Text>
      <Text style={styles.subtitle}>ID: {id ?? "sin id"}</Text>
      <Text style={styles.help}>Aquí puedes cargar y mostrar el contenido del post.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 16,
  },
  help: {
    fontSize: 12,
    color: "#666",
  },
});
