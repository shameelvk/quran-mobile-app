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

export default function HomeScreen({ navigation }) {
  const [lastRead, setLastRead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

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
    <ScrollView style={styles.container}>
      <AppHeader />

      <View style={styles.greetingCard}>
        <Text style={styles.greeting}>Assalamu Alaikum</Text>
        <Text style={styles.subGreeting}>{greeting}</Text>
        <Text style={styles.quote}>
          "And We have certainly made the Qur'an easy for remembrance, so is
          there any who will remember?"
        </Text>
        <Text style={styles.quoteRef}>- Surah Al-Qamar (54:17)</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={styles.loader} />
      ) : (
        <>
          {lastRead && (
            <TouchableOpacity
              style={styles.lastReadCard}
              onPress={() =>
                navigation.navigate("SurahDetail", {
                  surahNumber: lastRead.surahNumber,
                  surahName: lastRead.surahName,
                })
              }
            >
              <View style={styles.lastReadHeader}>
                <Ionicons name="book-outline" size={24} color="#2E7D32" />
                <Text style={styles.lastReadTitle}>Continue Reading</Text>
              </View>
              <Text style={styles.lastReadSurah}>{lastRead.surahName}</Text>
              <Text style={styles.lastReadAyah}>
                Ayah {lastRead.ayahNumber} of {lastRead.totalAyahs}
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (lastRead.ayahNumber / lastRead.totalAyahs) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Surahs")}
            >
              <Ionicons name="list" size={32} color="#2E7D32" />
              <Text style={styles.actionText}>All Surahs</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Bookmarks")}
            >
              <Ionicons name="bookmark" size={32} color="#2E7D32" />
              <Text style={styles.actionText}>Bookmarks</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate("Favorites")}
            >
              <Ionicons name="heart" size={32} color="#2E7D32" />
              <Text style={styles.actionText}>Favorites</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
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
    color: "#2E7D32",
  },
  greetingCard: {
    backgroundColor: "#2E7D32",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: "#E8F5E9",
    marginBottom: 16,
  },
  quote: {
    fontSize: 14,
    color: "#fff",
    fontStyle: "italic",
    lineHeight: 20,
  },
  quoteRef: {
    fontSize: 12,
    color: "#E8F5E9",
    marginTop: 8,
  },
  loader: {
    marginTop: 50,
  },
  lastReadCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  lastReadHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  lastReadTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginLeft: 8,
  },
  lastReadSurah: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  lastReadAyah: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2E7D32",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
  },
  actionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    width: "30%",
  },
  actionText: {
    marginTop: 8,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
});
