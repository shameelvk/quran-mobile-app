// screens/SurahListScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import SurahCard from "../components/SurahCard";

export default function SurahListScreen({ navigation }) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      const response = await fetch("https://quranapi.pages.dev/api/surah.json");
      const data = await response.json();
      setSurahs(data);
    } catch (error) {
      console.error("Error loading surahs:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSurah = ({ item, index }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahNumber: index + 1,
          surahName: item.surahName,
        })
      }
    >
      <View style={styles.surahNumber}>
        <Text style={styles.surahNumberText}>{item.surahNumber}</Text>
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#A44AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader />
      <FlatList
        data={surahs}
        renderItem={({ item, index }) => (
          <SurahCard item={item} index={index} />
        )}
        keyExtractor={(item) => item.surahName}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D2233",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#A44AFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
});
