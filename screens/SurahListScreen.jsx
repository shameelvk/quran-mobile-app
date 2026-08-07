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

import { useQuery } from '@tanstack/react-query';

export default function SurahListScreen({ navigation }) {
  const { theme } = useTheme();

  const { data: surahs = [], isLoading: loading } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahList,
  });

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
