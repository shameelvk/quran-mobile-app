import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text, StatusBar } from "react-native";
import { Provider } from "react-redux";
import store, { initializeStore } from "./redux/store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import SurahListScreen from "./screens/SurahListScreen";
import BookmarksScreen from "./screens/BookmarksScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import SurahDetailScreen from "./screens/SurahDetailScreen";
import SearchScreen from "./screens/SearchScreen";
import SafeScreen from "./components/SafeScreen";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useTheme } from "./contexts/ThemeContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { theme } = useTheme();

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

          tabBarLabel: ({ focused }) =>
            focused ? (
              <Text style={{ color: theme.primary, fontSize: 10 }}>
                {route.name}
              </Text>
            ) : null,
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: "gray",
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.tabBarBackground,
            borderTopColor: theme.tabBarBackground,
          },
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

function RootNavigator() {
  const { theme } = useTheme();

  return (
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
            headerStyle: { backgroundColor: theme.headerBackground },
            headerTintColor: theme.text,
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            title: "Search",
            headerStyle: { backgroundColor: theme.headerBackground },
            headerTintColor: theme.text,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
});

export default function App() {
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider>
          <SafeAreaProvider>
            <RootNavigator />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
