// screens/SurahDetailScreen.js
import React, { useState, useEffect, useRef } from "react";
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

const BATCH_SIZE = 10;

export default function SurahDetailScreen({ route, navigation }) {
  const { surahNumber, surahName } = route.params;

  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [sound, setSound] = useState(null);

  const totalAyahCount = useRef(0);
  const currentBatchEnd = useRef(0);

  useEffect(() => {
    loadInitialData();
    loadBookmarks();
    navigation.setOptions({ title: surahName });
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadInitialData = async () => {
    try {
      // Get total ayah count first
      const metaResponse = await fetch(
        `https://quranapi.pages.dev/api/${surahNumber}.json`
      );
      const metaData = await metaResponse.json();
      totalAyahCount.current = metaData.totalAyah;
      console.log("Total Ayahs:", totalAyahCount.current);

      // Load first batch
      await loadNextBatch();
    } catch (error) {
      console.error("Error loading initial data:", error);
      Alert.alert("Error", "Failed to load Surah data");
    } finally {
      setLoading(false);
    }
  };

  const loadNextBatch = async () => {
    // Prevent multiple simultaneous loads
    if (loadingMore || currentBatchEnd.current >= totalAyahCount.current) {
      return;
    }

    setLoadingMore(true);

    try {
      const startAyah = currentBatchEnd.current + 1;
      const endAyah = Math.min(
        currentBatchEnd.current + BATCH_SIZE,
        totalAyahCount.current
      );

      // Fetch batch in parallel
      const ayahPromises = [];
      for (let ayahNo = startAyah; ayahNo <= endAyah; ayahNo++) {
        ayahPromises.push(
          fetch(
            `https://quranapi.pages.dev/api/${surahNumber}/${ayahNo}.json`
          ).then((res) => res.json())
        );
      }

      const newAyahs = await Promise.all(ayahPromises);

      // Append to existing ayahs
      setAyahs((prevAyahs) => [...prevAyahs, ...newAyahs]);
      currentBatchEnd.current = endAyah;
    } catch (error) {
      console.error("Error loading batch:", error);
      Alert.alert("Error", "Failed to load more Ayahs");
    } finally {
      setLoadingMore(false);
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
    const bookmarkKey = `${surahNumber}-${ayah.ayahNo}`;
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
          ayahNumber: ayah.ayahNo,
          text: ayah.arabic1,
        },
      ];
    }

    setBookmarks(newBookmarks);
    await AsyncStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const isBookmarked = (ayahNumber) => {
    return bookmarks.some((b) => b.key === `${surahNumber}-${ayahNumber}`);
  };

  const playAudio = async (ayah, reciterKey = "1") => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const audioUrl = ayah.audio[reciterKey]?.url;

      if (!audioUrl) {
        Alert.alert("Error", "Audio not available for this Ayah");
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      console.log(newSound);

      setSound(newSound);
      setPlayingAyah(ayah.ayahNo);

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
        ayahNumber: ayah.ayahNo,
        totalAyahs: totalAyahCount.current,
      };
      await AsyncStorage.setItem("lastRead", JSON.stringify(lastReadData));
    } catch (error) {
      console.error("Error saving last read:", error);
    }
  };

  const handleEndReached = () => {
    // Load more when user scrolls near the end
    if (
      !loading &&
      !loadingMore &&
      currentBatchEnd.current < totalAyahCount.current
    ) {
      loadNextBatch();
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#2E7D32" />
        <Text style={styles.footerText}>
          Loading more Ayahs... ({currentBatchEnd.current}/
          {totalAyahCount.current})
        </Text>
      </View>
    );
  };

  const renderAyah = ({ item }) => (
    <View style={styles.ayahCard}>
      <View style={styles.ayahHeader}>
        <View style={styles.ayahNumber}>
          <Text style={styles.ayahNumberText}>{item.ayahNo}</Text>
        </View>
        <View style={styles.ayahActions}>
          <TouchableOpacity
            onPress={() =>
              playingAyah === item.ayahNo ? stopAudio() : playAudio(item)
            }
            style={styles.actionButton}
          >
            <Ionicons
              name={playingAyah === item.ayahNo ? "stop" : "play"}
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
              name={isBookmarked(item.ayahNo) ? "bookmark" : "bookmark-outline"}
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.ayahText}>{item.arabic1}</Text>
      {item.english && (
        <Text style={styles.translationText}>{item.english}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading Surah...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={ayahs}
        renderItem={renderAyah}
        keyExtractor={(item) => `${item.surahNo}-${item.ayahNo}`}
        contentContainerStyle={styles.list}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
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
    fontFamily: "NotoNaskhArabic-Regular",
  },
  translationText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    lineHeight: 24,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
});
