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

export default function SurahListScreen({ navigation }) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log(surahs[0]);

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

  const renderSurah = ({ item }) => (
    <TouchableOpacity
      style={styles.surahCard}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahNumber: item.surahNumber,
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
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="search" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quran App</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={surahs}
        renderItem={renderSurah}
        keyExtractor={(item) => item.surahName}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    color: "#2E7D32",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
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
    backgroundColor: "#2E7D32",
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
    color: "#2E7D32",
    marginTop: 2,
  },
  surahMeta: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
});
