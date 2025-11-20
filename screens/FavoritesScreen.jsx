// screens/FavoritesScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../components/AppHeader";
import { useTheme } from "../contexts/ThemeContext";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const { theme } = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem("favorites");
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles(theme).favoriteCard}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahNumber: item.surahNumber,
          surahName: item.surahName,
        })
      }
    >
      <View style={styles(theme).favoriteInfo}>
        <Text style={styles(theme).surahName}>{item.surahName}</Text>
        <Text style={styles(theme).surahMeta}>
          {item.revelationPlace} • {item.ayahCount} Ayahs
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles(theme).container}>
      <AppHeader />
      {favorites.length === 0 ? (
        <View style={styles(theme).emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={theme.textLight} />
          <Text style={styles(theme).emptyText}>No favorites yet</Text>
          <Text style={styles(theme).emptySubText}>
            Long press on any surah to add it to favorites
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavorite}
          keyExtractor={(item) => item.surahNumber.toString()}
          contentContainerStyle={styles(theme).list}
        />
      )}
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  list: {
    padding: 16,
  },
  favoriteCard: {
    flexDirection: "row",
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  favoriteInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  surahMeta: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textTertiary,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: theme.textLight,
    marginTop: 8,
    textAlign: "center",
  },
});
