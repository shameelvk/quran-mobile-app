// screens/SurahDetailScreen.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite, selectIsFavorite } from "../redux/favoritesSlice";
import { fetchSurahMetadata, fetchAyah } from "../utils/api";
import { useTheme } from "../contexts/ThemeContext";

const BATCH_SIZE = 10;

// Memoized AyahCard component for better performance
const AyahCard = React.memo(({ 
  item, 
  theme, 
  playingAyah, 
  isBookmarked, 
  onPlayPress, 
  onBookmarkPress 
}) => {
  return (
    <View style={styles(theme).ayahCard}>
      <View style={styles(theme).ayahHeader}>
        <View style={styles(theme).ayahNumber}>
          <Text style={styles(theme).ayahNumberText}>{item.ayahNo}</Text>
        </View>
        <View style={styles(theme).ayahActions}>
          <TouchableOpacity
            onPress={onPlayPress}
            style={styles(theme).actionButton}
          >
            <Ionicons
              name={playingAyah === item.ayahNo ? "stop" : "play"}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onBookmarkPress}
            style={styles(theme).actionButton}
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles(theme).ayahText}>{item.arabic1}</Text>
      {item.english && (
        <Text style={styles(theme).translationText}>{item.english}</Text>
      )}
    </View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if these props change
  return (
    prevProps.item.ayahNo === nextProps.item.ayahNo &&
    prevProps.item.arabic1 === nextProps.item.arabic1 &&
    prevProps.item.english === nextProps.item.english &&
    prevProps.playingAyah === nextProps.playingAyah &&
    prevProps.isBookmarked === nextProps.isBookmarked &&
    prevProps.theme === nextProps.theme
  );
});


export default function SurahDetailScreen({ route, navigation }) {
  const { surahNumber, surahName, surahNameArabic, revelationPlace, ayahCount } = route.params;

  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [sound, setSound] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [surahMetadata, setSurahMetadata] = useState(null);
  const { theme } = useTheme();

  // REDUX HOOKS: Connect to Redux store
  const dispatch = useDispatch(); // Hook to dispatch actions
  const isFavorite = useSelector(selectIsFavorite(surahNumber)); // Hook to read from store

  const totalAyahCount = useRef(0);
  const currentBatchEnd = useRef(0);

  useEffect(() => {
    loadInitialData();
    loadBookmarks();
    
    // Configure navigation header with favorite button
    navigation.setOptions({
      title: surahName,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={{ marginRight: 15, opacity: canToggleFavorite() ? 1 : 0.5 }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      ),
    });
  }, [isFavorite, surahName, surahMetadata]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleToggleFavorite = () => {
    // Use route params if available (immediate), otherwise use loaded metadata (fallback)
    const metadata = {
      surahNumber,
      surahName,
      surahNameArabic: surahNameArabic || surahMetadata?.surahNameArabic,
      revelationPlace: revelationPlace || surahMetadata?.revelationPlace,
      ayahCount: ayahCount || surahMetadata?.totalAyah,
    };

    // Only dispatch if we have all required data
    if (metadata.surahNameArabic && metadata.revelationPlace && metadata.ayahCount) {
      dispatch(toggleFavorite(metadata));
    } else {
      // Data not ready yet - show feedback to user
      console.log("Waiting for surah metadata to load...");
    }
  };

  // Check if we have enough data to enable favorite button
  const canToggleFavorite = () => {
    return (surahNameArabic && revelationPlace && ayahCount) || surahMetadata;
  };

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
      const metaData = await fetchSurahMetadata(surahNumber);
      totalAyahCount.current = metaData.totalAyah;
      setSurahMetadata(metaData); // Store metadata for favorites
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
    // Prevent multiple simultaneous loads or retry after error
    if (loadingMore || currentBatchEnd.current >= totalAyahCount.current || hasError) {
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
        ayahPromises.push(fetchAyah(surahNumber, ayahNo));
      }

      const newAyahs = await Promise.all(ayahPromises);

      // Append to existing ayahs
      setAyahs((prevAyahs) => [...prevAyahs, ...newAyahs]);
      currentBatchEnd.current = endAyah;
      setHasError(false); // Clear error on success
    } catch (error) {
      console.error("Error loading batch:", error);
      setHasError(true); // Set error state to prevent infinite retries
      Alert.alert(
        "Error", 
        "Failed to load more Ayahs. Please check your connection and try again.",
        [
          {
            text: "OK",
            onPress: () => {
              // Error state remains true until user manually triggers retry
            }
          }
        ]
      );
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
        surahNameArabic: surahNameArabic || surahMetadata?.surahNameArabic,
        revelationPlace: revelationPlace || surahMetadata?.revelationPlace,
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
    // Don't auto-retry if there was a previous error
    if (
      !loading &&
      !loadingMore &&
      !hasError &&
      currentBatchEnd.current < totalAyahCount.current
    ) {
      loadNextBatch();
    }
  };

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <View style={styles(theme).footerLoader}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={styles(theme).footerText}>
            Loading more Ayahs... ({currentBatchEnd.current}/
            {totalAyahCount.current})
          </Text>
        </View>
      );
    }

    // Show retry button if there was an error and more ayahs are available
    if (hasError && currentBatchEnd.current < totalAyahCount.current) {
      return (
        <View style={styles(theme).footerLoader}>
          <TouchableOpacity
            style={styles(theme).retryButton}
            onPress={() => {
              setHasError(false);
              loadNextBatch();
            }}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles(theme).retryButtonText}>Retry Loading</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderAyah = useCallback(({ item }) => (
    <AyahCard
      item={item}
      theme={theme}
      playingAyah={playingAyah}
      isBookmarked={isBookmarked(item.ayahNo)}
      onPlayPress={() => playingAyah === item.ayahNo ? stopAudio() : playAudio(item)}
      onBookmarkPress={() => {
        toggleBookmark(item);
        saveLastRead(item);
      }}
    />
  ), [playingAyah, bookmarks, theme]);

  const keyExtractor = useCallback((item) => `${item.surahNo}-${item.ayahNo}`, []);

  if (loading) {
    return (
      <View style={styles(theme).loaderContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles(theme).loadingText}>Loading Surah...</Text>
      </View>
    );
  }

  return (
    <View style={styles(theme).container}>
      <FlatList
        data={ayahs}
        renderItem={renderAyah}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles(theme).list}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        updateCellsBatchingPeriod={50}
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.textSecondary,
  },
  list: {
    padding: 16,
  },
  ayahCard: {
    backgroundColor: theme.cardBackground,
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
    backgroundColor: theme.primary,
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
    color: theme.textSecondary,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});


