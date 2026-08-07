import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useBookmarks(surahNumber, surahName, surahNameArabic, revelationPlace, totalAyahCountRef) {
  const [bookmarks, setBookmarks] = useState([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const bookmarksData = await AsyncStorage.getItem("bookmarks");
      if (bookmarksData) {
        setBookmarks(JSON.parse(bookmarksData));
      }
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    }
  }, []);

  const toggleBookmark = useCallback(async (ayah) => {
    const bookmarkKey = `${surahNumber}-${ayah.ayahNo}`;
    
    setBookmarks((prevBookmarks) => {
      const existingIndex = prevBookmarks.findIndex((b) => b.key === bookmarkKey);
      let newBookmarks;
      
      if (existingIndex >= 0) {
        newBookmarks = prevBookmarks.filter((b) => b.key !== bookmarkKey);
      } else {
        newBookmarks = [
          ...prevBookmarks,
          {
            key: bookmarkKey,
            surahNumber,
            surahName,
            ayahNumber: ayah.ayahNo,
            text: ayah.arabic1,
          },
        ];
      }
      
      // Save asynchronously without blocking UI update
      AsyncStorage.setItem("bookmarks", JSON.stringify(newBookmarks)).catch((err) => 
        console.error("Failed to save bookmark:", err)
      );
      
      return newBookmarks;
    });
  }, [surahNumber, surahName]);

  const isBookmarked = useCallback((ayahNumber) => {
    return bookmarks.some((b) => b.key === `${surahNumber}-${ayahNumber}`);
  }, [bookmarks, surahNumber]);

  const saveLastRead = useCallback(async (ayah, loadedMetadata) => {
    try {
      const lastReadData = {
        surahNumber,
        surahName,
        surahNameArabic: surahNameArabic || loadedMetadata?.surahNameArabic,
        revelationPlace: revelationPlace || loadedMetadata?.revelationPlace,
        ayahNumber: ayah.ayahNo,
        totalAyahs: totalAyahCountRef.current,
      };
      await AsyncStorage.setItem("lastRead", JSON.stringify(lastReadData));
    } catch (error) {
      console.error("Error saving last read:", error);
    }
  }, [surahNumber, surahName, surahNameArabic, revelationPlace, totalAyahCountRef]);

  return {
    bookmarks,
    loadBookmarks,
    toggleBookmark,
    isBookmarked,
    saveLastRead,
  };
}
