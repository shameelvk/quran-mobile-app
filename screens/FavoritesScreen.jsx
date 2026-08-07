// screens/FavoritesScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { selectAllFavorites } from "../redux/favoritesSlice";
import AppHeader from "../components/AppHeader";
import SurahCard from "../components/SurahCard";
import { useTheme } from "../contexts/ThemeContext";

export default function FavoritesScreen({ navigation }) {
  const { theme } = useTheme();
  
  // REDUX HOOK: Get favorites from Redux store
  // No need for AsyncStorage or useFocusEffect - Redux updates automatically!
  const favorites = useSelector(selectAllFavorites);

  const renderFavorite = ({ item }) => (
    <SurahCard item={item} />
  );

  return (
    <View style={styles(theme).container}>
      <AppHeader />
      {favorites.length === 0 ? (
        <View style={styles(theme).emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={theme.textLight} />
          <Text style={styles(theme).emptyText}>No favorites yet</Text>
          <Text style={styles(theme).emptySubText}>
            Tap the heart icon in any Surah to add it to favorites
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
