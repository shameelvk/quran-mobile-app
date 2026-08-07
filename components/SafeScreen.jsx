import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";

export default function SafeScreen({ children, withHeader = false }) {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.headerBackground }}
      edges={
        withHeader ? ["left", "right", "bottom"] : ["top", "left", "right"]
      }
    >
      {children}
    </SafeAreaView>
  );
}
