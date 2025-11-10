import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AppHeader({
  title = "Quran App",
  showSearch = true,
  showMenu = false,
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showMenu ? (
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#A19CC5" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      <Text style={styles.headerTitle}>{title}</Text>
      {showSearch ? (
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={24} color="#A19CC5" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} /> // keeps spacing consistent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1D2233",
    // elevation: 4,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
