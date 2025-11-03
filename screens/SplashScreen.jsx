// screens/SplashScreen.js
import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.arabicText}>
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
      </Text>
      <Text style={styles.title}>Quran App</Text>
      <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  arabicText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2E7D32",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  loader: {
    marginTop: 20,
  },
});
