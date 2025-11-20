// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import { LinearGradient } from "expo-linear-gradient";
import QuranIcon from "../assets/svg/Quran";
import { useTheme } from "../contexts/ThemeContext";

export default function HomeScreen({ navigation }) {
  const [lastRead, setLastRead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const { theme } = useTheme();

  useEffect(() => {
    loadLastRead();
    setGreetingMessage();
  }, []);

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };

  const loadLastRead = async () => {
    try {
      const lastReadData = await AsyncStorage.getItem("lastRead");
      if (lastReadData) {
        setLastRead(JSON.parse(lastReadData));
      }
    } catch (error) {
      console.error("Error loading last read:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles(theme).container}>
      <AppHeader showMenu={true} showThemeToggle={true} />

      <View style={styles(theme).greetingCard}>
        <Text style={styles(theme).greeting}>Assalamu Alaikum</Text>
        <Text style={styles(theme).subGreeting}>{greeting}</Text>
        <Text style={styles(theme).quote}>
          "And We have certainly made the Qur'an easy for remembrance, so is
          there any who will remember?"
        </Text>
        <Text style={styles(theme).quoteRef}>- Surah Al-Qamar (54:17)</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles(theme).loader} />
      ) : (
        <>
          {lastRead && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("SurahDetail", {
                  surahNumber: lastRead.surahNumber,
                  surahName: lastRead.surahName,
                })
              }
            >
              <LinearGradient
                colors={["#DF98FA", "#9055FF"]}
                style={styles(theme).lastReadCard}
              >
                <View>
                  <View style={styles(theme).lastReadHeader}>
                    <Ionicons name="book-outline" size={24} color="#FFFFFF" />
                    <Text style={styles(theme).lastReadTitle}>Last Read</Text>
                  </View>
                  <Text style={styles(theme).lastReadSurah}>{lastRead.surahName}</Text>
                  <Text style={styles(theme).lastReadAyah}>
                    Ayah No: {lastRead.ayahNumber} of {lastRead.totalAyahs}
                  </Text>
                </View>
                <View style={{ position: "absolute", bottom: -20, right: -50 }}>
                  <QuranIcon />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles(theme).quickActions}>
            <TouchableOpacity
              style={styles(theme).actionCard}
              onPress={() => navigation.navigate("Surahs")}
            >
              <Ionicons name="list" size={32} color={theme.primary} />
              <Text style={styles(theme).actionText}>All Surahs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles(theme).actionCard}
              onPress={() => navigation.navigate("Bookmarks")}
            >
              <Ionicons name="bookmark" size={32} color={theme.primary} />
              <Text style={styles(theme).actionText}>Bookmarks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles(theme).actionCard}
              onPress={() => navigation.navigate("Favorites")}
            >
              <Ionicons name="heart" size={32} color={theme.primary} />
              <Text style={styles(theme).actionText}>Favorites</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  greetingCard: {
    margin: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.greetingText,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: theme.greetingSubText,
    marginBottom: 16,
  },
  quote: {
    fontSize: 14,
    color: theme.quoteText,
    fontStyle: "italic",
    lineHeight: 20,
  },
  quoteRef: {
    fontSize: 12,
    color: theme.quoteRefText,
    marginTop: 8,
  },
  loader: {
    marginTop: 50,
  },
  lastReadCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    flexDirection: "row",
    gap: 20,
    position: "relative",
    zIndex: 100,
    overflow: "hidden",
  },
  lastReadHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  lastReadTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  lastReadSurah: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  lastReadAyah: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 12,
    fontWeight: "regular",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  actionCard: {
    backgroundColor: theme.cardBackground,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    width: "30%",
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: theme.primary,
    textAlign: "center",
  },
});
