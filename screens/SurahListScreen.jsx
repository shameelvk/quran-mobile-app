// screens/SurahListScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AppHeader from "../components/AppHeader";
import SurahCard from "../components/SurahCard";
import { useTheme } from "../contexts/ThemeContext";
import { fetchSurahList } from "../utils/api";

export default function SurahListScreen({ navigation }) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      const data = await fetchSurahList();
      setSurahs(data);
    } catch (error) {
      console.error("Error loading surahs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles(theme).loaderContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      <AppHeader />
      <FlatList
        data={surahs}
        renderItem={({ item, index }) => (
          <SurahCard item={item} index={index} />
        )}
        keyExtractor={(item) => item.surahName}
        contentContainerStyle={styles(theme).list}
      />
    </View>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.background,
  },
  list: {
    padding: 16,
  },
});
