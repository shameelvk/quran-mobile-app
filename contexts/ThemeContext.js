import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';
import { COLORS } from '../constants/colors';

const ThemeContext = createContext();

export const lightTheme = {
  ...COLORS.light,
  primary: COLORS.primary,
  primaryLight: COLORS.primaryLight,
  isDark: false,
};

export const darkTheme = {
  ...COLORS.dark,
  primary: COLORS.primary,
  primaryLight: COLORS.primaryLight,
  isDark: true,
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    // Update status bar when theme changes
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    // For Android, set the background color
    if (StatusBar.setBackgroundColor) {
      StatusBar.setBackgroundColor(isDarkMode ? '#1D2233' : '#FFFFFF', true);
    }
  }, [isDarkMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
