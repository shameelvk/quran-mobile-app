import { useState, useRef, useCallback } from "react";
import { Alert } from "react-native";
import { fetchSurahMetadata, fetchAyah } from "../utils/api";

const BATCH_SIZE = 10;

export function useSurahFetcher(surahNumber) {
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [surahMetadata, setSurahMetadata] = useState(null);

  const totalAyahCount = useRef(0);
  const currentBatchEnd = useRef(0);

  const loadNextBatch = useCallback(async () => {
    if (loadingMore || currentBatchEnd.current >= totalAyahCount.current || hasError) {
      return;
    }

    setLoadingMore(true);

    try {
      const startAyah = currentBatchEnd.current + 1;
      const endAyah = Math.min(
        currentBatchEnd.current + BATCH_SIZE,
        totalAyahCount.current,
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
            },
          },
        ],
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasError, surahNumber]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      // Get total ayah count first
      const metaData = await fetchSurahMetadata(surahNumber);
      totalAyahCount.current = metaData.totalAyah;
      setSurahMetadata(metaData); // Store metadata for favorites
      
      // Load first batch
      await loadNextBatch();
    } catch (error) {
      console.error("Error loading initial data:", error);
      Alert.alert("Error", "Failed to load Surah data");
    } finally {
      setLoading(false);
    }
  }, [surahNumber, loadNextBatch]);

  const retryLoading = useCallback(() => {
    setHasError(false);
    loadNextBatch();
  }, [loadNextBatch]);

  return {
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
  };
}
