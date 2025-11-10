import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LOG } from "../utils/logHelper";

const SurahCard = ({ item, index }) => {
  const navigation = useNavigation();
  LOG({ item });
  return (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahNumber: item?.surahNumber || index + 1,
          surahName: item.surahName,
        })
      }
    >
      <View style={styles.surahNumber}>
        <Text style={styles.surahNumberText}>
          {item?.surahNumber || index + 1}
        </Text>
      </View>
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.surahName}</Text>
        <Text style={styles.surahNameArabic}>{item.surahNameArabic}</Text>
        <Text style={styles.surahMeta}>
          {item.revelationPlace} • {item.ayahCount} Ayahs
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );
};

export default SurahCard;

const styles = StyleSheet.create({
  surahCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A44AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  surahNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  surahNameArabic: {
    fontSize: 18,
    color: "#A44AFF",
    marginTop: 2,
  },
  surahMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
