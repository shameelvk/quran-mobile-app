import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://quranapi.pages.dev/api";

const CACHE_KEYS = {
  SURAH_LIST: "cached_surah_list",
  SURAH_METADATA: (surahNumber) => `cached_surah_${surahNumber}_metadata`,
  AYAH: (surahNumber, ayahNumber) => `cached_ayah_${surahNumber}_${ayahNumber}`,
};

/**
 * Fetch Surah List with caching
 */
export const fetchSurahList = async () => {
  try {
    // Try to get from cache first
    const cachedData = await AsyncStorage.getItem(CACHE_KEYS.SURAH_LIST);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    // If no cache, fetch from API
    const response = await fetch(`${BASE_URL}/surah.json`);
    if (!response.ok) throw new Error("Network response was not ok");
    
    const data = await response.json();
    

    await AsyncStorage.setItem(CACHE_KEYS.SURAH_LIST, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error("Error fetching surah list:", error);
    // If fetch fails and we have no cache (already checked above), re-throw or return empty
    // But if we had cache we would have returned it. 
    // So here we might want to check cache one last time if we want to support "stale-while-revalidate" logic later
    // For now, just throw if we can't get data
    throw error;
  }
};

/**
 * Fetch Surah Metadata (total ayahs, etc)
 */
export const fetchSurahMetadata = async (surahNumber) => {
  const cacheKey = CACHE_KEYS.SURAH_METADATA(surahNumber);
  try {
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/${surahNumber}.json`);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(`Error fetching metadata for surah ${surahNumber}:`, error);
    throw error;
  }
};

/**
 * Fetch single Ayah
 */
export const fetchAyah = async (surahNumber, ayahNumber) => {
  const cacheKey = CACHE_KEYS.AYAH(surahNumber, ayahNumber);
  try {
    const cachedData = await AsyncStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(`${BASE_URL}/${surahNumber}/${ayahNumber}.json`);
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error(`Error fetching ayah ${surahNumber}:${ayahNumber}:`, error);
    throw error;
  }
};

/**
 * Clear all app cache (useful for settings/debugging)
 */
export const clearCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith("cached_"));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};
