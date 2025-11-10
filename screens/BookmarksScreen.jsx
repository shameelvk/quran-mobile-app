// screens/BookmarksScreen.js
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

export default function BookmarksScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const loadBookmarks = async () => {
    try {
      const bookmarksData = await AsyncStorage.getItem("bookmarks");
      if (bookmarksData) {
        setBookmarks(JSON.parse(bookmarksData));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  };

  const removeBookmark = async (key) => {
    const newBookmarks = bookmarks.filter((b) => b.key !== key);
    setBookmarks(newBookmarks);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const renderBookmark = ({ item }) => (
    <TouchableOpacity
      style={styles.bookmarkCard}
      onPress={() =>
        navigation.navigate("SurahDetail", {
          surahNumber: item.surahNumber,
          surahName: item.surahName,
        })
      }
    >
      <View style={styles.bookmarkInfo}>
        <Text style={styles.surahName}>{item.surahName}</Text>
        <Text style={styles.ayahNumber}>Ayah {item.ayahNumber}</Text>
        <Text style={styles.ayahText} numberOfLines={2}>
          {item.text}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removeBookmark(item.key)}>
        <Ionicons name="trash-outline" size={24} color="#d32f2f" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmark}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
        />
      )}
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
    color: "#A44AFF",
  },
  list: {
    padding: 16,
  },
  bookmarkCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
  },
  bookmarkInfo: {
    flex: 1,
    marginRight: 12,
  },
  surahName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ayahNumber: {
    fontSize: 14,
    color: "#A44AFF",
    marginTop: 4,
  },
  ayahText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
    marginTop: 16,
  },
});
