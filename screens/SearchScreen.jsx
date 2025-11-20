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
import { fetchSurahList } from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [allSurahs, setAllSurahs] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const data = await fetchSurahList();
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
    <View style={styles(theme).container}>
      <View style={styles(theme).searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles(theme).searchIcon}
        />
        <TextInput
          style={styles(theme).searchInput}
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
        <ActivityIndicator size="large" color={theme.primary} style={styles(theme).loader} />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={({ item, index }) => (
            <SurahCard item={item} index={index} />
          )}
          keyExtractor={(item) => item.surahNumber.toString()}
          contentContainerStyle={styles(theme).list}
        />
      ) : query.length > 0 ? (
        <View style={styles(theme).emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.textLight} />
          <Text style={styles(theme).emptyText}>No results found</Text>
        </View>
      ) : (
        <View style={styles(theme).emptyContainer}>
          <Ionicons name="search-outline" size={64} color={theme.textLight} />
          <Text style={styles(theme).emptyText}>Search for a Surah</Text>
        </View>
      )}
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.cardBackground,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textTertiary,
    marginTop: 16,
  },
});
