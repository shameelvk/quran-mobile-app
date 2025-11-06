import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Import screens
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import SurahListScreen from "./screens/SurahListScreen";
import BookmarksScreen from "./screens/BookmarksScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import SurahDetailScreen from "./screens/SurahDetailScreen";
import SearchScreen from "./screens/SearchScreen";
import SafeScreen from "./components/SafeScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <SafeScreen>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Home")
              iconName = focused ? "home" : "home-outline";
            else if (route.name === "Surahs")
              iconName = focused ? "book" : "book-outline";
            else if (route.name === "Bookmarks")
              iconName = focused ? "bookmark" : "bookmark-outline";
            else if (route.name === "Favorites")
              iconName = focused ? "heart" : "heart-outline";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#2E7D32",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Surahs" component={SurahListScreen} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
    </SafeScreen>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen
            options={{ headerShown: false }}
            name="Splash"
            component={SplashScreen}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SurahDetail"
            component={SurahDetailScreen}
            options={{
              title: "Surah",
              headerStyle: { backgroundColor: "#2E7D32" },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="Search"
            component={SearchScreen}
            options={{
              title: "Search",
              headerStyle: { backgroundColor: "#2E7D32" },
              headerTintColor: "#fff",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
