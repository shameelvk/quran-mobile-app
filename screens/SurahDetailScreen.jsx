// screens/SurahDetailScreen.js
import React, { useEffect, useLayoutEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite, selectIsFavorite } from "../redux/favoritesSlice";
import { useTheme } from "../contexts/ThemeContext";

import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useBookmarks } from "../hooks/useBookmarks";
import { useSurahFetcher } from "../hooks/useSurahFetcher";

// Memoized AyahCard component for better performance
const AyahCard = React.memo(
  ({
    item,
    theme,
    playingAyah,
    isBookmarked,
    onPlayPress,
    onBookmarkPress,
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
  },
  (prevProps, nextProps) => {
    // Custom comparison function - only re-render if these props change
    return (
      prevProps.item.ayahNo === nextProps.item.ayahNo &&
      prevProps.item.arabic1 === nextProps.item.arabic1 &&
      prevProps.item.english === nextProps.item.english &&
      prevProps.playingAyah === nextProps.playingAyah &&
      prevProps.isBookmarked === nextProps.isBookmarked &&
      prevProps.theme === nextProps.theme
    );
  },
);

export default function SurahDetailScreen({ route, navigation }) {
  const {
    surahNumber,
    surahName,
    surahNameArabic,
    revelationPlace,
    ayahCount,
  } = route.params;

  const { theme } = useTheme();

  // 1. Data Fetching Hook
  const {
    ayahs,
    loading,
    loadingMore,
    hasError,
    surahMetadata,
    totalAyahCount,
    currentBatchEnd,
    loadInitialData,
    loadNextBatch,
    retryLoading,
  } = useSurahFetcher(surahNumber);

  // 2. Bookmarks Hook
  const {
    loadBookmarks,
    toggleBookmark,
    isBookmarked,
    saveLastRead,
  } = useBookmarks(surahNumber, surahName, surahNameArabic, revelationPlace, totalAyahCount);

  // 3. Audio Player Hook
  const { playingAyah, playAudio, stopAudio } = useAudioPlayer();

  // Redux Hook for Favorites
  const dispatch = useDispatch();
  const isFavorite = useSelector(selectIsFavorite(surahNumber));

  // Initialize data on mount
  useEffect(() => {
    loadBookmarks();
  }, [surahNumber]);

  // Configure Navigation Header
  useLayoutEffect(() => {
    const handleToggleFavorite = () => {
      const metadata = {
        surahNumber,
        surahName,
        surahNameArabic: surahNameArabic || surahMetadata?.surahNameArabic,
        revelationPlace: revelationPlace || surahMetadata?.revelationPlace,
        ayahCount: ayahCount || surahMetadata?.totalAyah,
      };

      if (metadata.surahNameArabic && metadata.revelationPlace && metadata.ayahCount) {
        dispatch(toggleFavorite(metadata));
      } else {
        console.log("Waiting for surah metadata to load...");
      }
    };

    const isDataReady = (surahNameArabic && revelationPlace && ayahCount) || surahMetadata;

    navigation.setOptions({
      title: surahName,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={{ marginRight: 15, opacity: isDataReady ? 1 : 0.5 }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite, surahName, surahMetadata, surahNumber, surahNameArabic, revelationPlace, ayahCount, dispatch]);

  const handleEndReached = useCallback(() => {
    if (!loading && !loadingMore && !hasError && currentBatchEnd.current < totalAyahCount.current) {
      loadNextBatch();
    }
  }, [loading, loadingMore, hasError, currentBatchEnd, totalAyahCount, loadNextBatch]);

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

    if (hasError && currentBatchEnd.current < totalAyahCount.current) {
      return (
        <View style={styles(theme).footerLoader}>
          <TouchableOpacity
            style={styles(theme).retryButton}
            onPress={retryLoading}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles(theme).retryButtonText}>Retry Loading</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const renderAyah = useCallback(
    ({ item }) => (
      <AyahCard
        item={item}
        theme={theme}
        playingAyah={playingAyah}
        isBookmarked={isBookmarked(item.ayahNo)}
        onPlayPress={() =>
          playingAyah === item.ayahNo ? stopAudio() : playAudio(item)
        }
        onBookmarkPress={() => {
          toggleBookmark(item);
          saveLastRead(item, surahMetadata);
        }}
      />
    ),
    [playingAyah, theme, isBookmarked, stopAudio, playAudio, toggleBookmark, saveLastRead, surahMetadata],
  );

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

const styles = (theme) =>
  StyleSheet.create({
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
