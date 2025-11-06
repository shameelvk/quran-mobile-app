import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeScreen({ children, withHeader = false }) {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={
        withHeader ? ["left", "right", "bottom"] : ["top", "left", "right"]
      }
    >
      {children}
    </SafeAreaView>
  );
}
