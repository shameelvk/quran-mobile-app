// screens/SurahDetailScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export default function SurahDetailScreen({ route, navigation }) {
  const { surahNumber, surahName } = route.params;
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    loadSurahData();
    loadBookmarks();
    navigation.setOptions({ title: surahName });

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadSurahData = async () => {
    try {
      const response = await fetch(
        `https://quranapi.pages.dev/api/${surahNumber}.json`
      );
      const data = await response.json();
      setAyahs(data.arabic);
    } catch (error) {
      console.error("Error loading surah:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const toggleBookmark = async (ayah) => {
    const bookmarkKey = `${surahNumber}-${ayah.ayahNumber}`;
    const existingIndex = bookmarks.findIndex((b) => b.key === bookmarkKey);

    let newBookmarks;
    if (existingIndex >= 0) {
      newBookmarks = bookmarks.filter((b) => b.key !== bookmarkKey);
    } else {
      newBookmarks = [
        ...bookmarks,
        {
          key: bookmarkKey,
          surahNumber,
          surahName,
          ayahNumber: ayah.ayahNumber,
          text: ayah.text,
        },
      ];
    }

    setBookmarks(newBookmarks);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (ayahNumber) => {
    return bookmarks.some((b) => b.key === `${surahNumber}-${ayahNumber}`);
  };

  const playAudio = async (ayah) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const paddedSurah = String(surahNumber).padStart(3, "0");
      const paddedAyah = String(ayah.ayahNumber).padStart(3, "0");
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${paddedSurah}${paddedAyah}.mp3`;

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      setSound(newSound);
      setPlayingAyah(ayah.ayahNumber);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingAyah(null);
        }
      });
    } catch (error) {
      Alert.alert("Error", "Could not play audio");
      console.error("Error playing audio:", error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setPlayingAyah(null);
    }
  };

  const saveLastRead = async (ayah) => {
    try {
      const lastReadData = {
        surahNumber,
        surahName,
        ayahNumber: ayah.ayahNumber,
        totalAyahs: ayahs.length,
      };
      await AsyncStorage.setItem("lastRead", JSON.stringify(lastReadData));
    } catch (error) {
      console.error("Error saving last read:", error);
    }
  };

  const renderAyah = ({ item }) => (
    <View style={styles.ayahCard}>
      <View style={styles.ayahHeader}>
        <View style={styles.ayahNumber}>
          <Text style={styles.ayahNumberText}>{item.ayahNumber}</Text>
        </View>
        <View style={styles.ayahActions}>
          <TouchableOpacity
            onPress={() =>
              playingAyah === item.ayahNumber ? stopAudio() : playAudio(item)
            }
            style={styles.actionButton}
          >
            <Ionicons
              name={playingAyah === item.ayahNumber ? "stop" : "play"}
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              toggleBookmark(item);
              saveLastRead(item);
            }}
            style={styles.actionButton}
          >
            <Ionicons
              name={
                isBookmarked(item.ayahNumber) ? "bookmark" : "bookmark-outline"
              }
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.ayahText}>{item.text}</Text>
    </View>
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
      <FlatList
        data={ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => item.ayahNumber.toString()}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
  ayahCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  ayahHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ayahNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },
  ayahNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  ayahActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 16,
  },
  ayahText: {
    fontSize: 24,
    color: "#333",
    textAlign: "right",
    lineHeight: 40,
  },
});
