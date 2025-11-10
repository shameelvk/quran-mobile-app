import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SurahCard from "../components/SurahCard";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [allSurahs, setAllSurahs] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch(
          "https://quranapi.pages.dev/api/surah.json"
        );
        const data = await response.json();
        const withNumbers = data.map((surah, index) => ({
          ...surah,
          surahNumber: index + 1,
        }));
        setAllSurahs(withNumbers);
      } catch (error) {
        console.error("Error fetching surahs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  const handleSearch = (text) => {
    setQuery(text);

    if (!text.trim()) {
      setResults([]);
      return;
    }

    const filtered = allSurahs.filter(
      (surah) =>
        surah.surahName.toLowerCase().includes(text.toLowerCase()) ||
        surah.surahNameArabic.includes(text) ||
        surah.revelationPlace.toLowerCase().includes(text.toLowerCase()) ||
        surah.surahNumber.toString() === text
    );

    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Surah name or number..."
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setResults([]);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#A44AFF" style={styles.loader} />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={({ item, index }) => (
            <SurahCard item={item} index={index} />
          )}
          keyExtractor={(item) => item.surahNumber.toString()}
          contentContainerStyle={styles.list}
        />
      ) : query.length > 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Search for a Surah</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040C23",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  loader: {
    marginTop: 50,
  },
  list: {
    padding: 16,
  },
  resultCard: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
  },
});
