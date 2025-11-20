import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../contexts/ThemeContext";

const SurahCard = ({ item, index }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={styles(theme).surahCard}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahNumber: item?.surahNumber || index + 1,
          surahName: item.surahName,
        })
      }
    >
      <View style={styles(theme).surahNumber}>
        <Text style={styles(theme).surahNumberText}>
          {item?.surahNumber || index + 1}
        </Text>
      </View>
      <View style={styles(theme).surahInfo}>
        <Text style={styles(theme).surahName}>{item.surahName}</Text>
        <Text style={styles(theme).surahNameArabic}>{item.surahNameArabic}</Text>
        <Text style={styles(theme).surahMeta}>
          {item.revelationPlace} • {item.ayahCount} Ayahs
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
    </TouchableOpacity>
  );
};

export default SurahCard;

const styles = (theme) => StyleSheet.create({
  surahCard: {
    flexDirection: "row",
    backgroundColor: theme.cardBackground,
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
    backgroundColor: theme.primary,
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
    color: theme.primary,
    marginTop: 2,
  },
  surahMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
