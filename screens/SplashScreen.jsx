// screens/SplashScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Svg, { G, Rect, Path, Defs, ClipPath } from "react-native-svg";

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.arabicText}>
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
      </Text>
      <Text style={styles.title}>Quran App</Text>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.subTitle}>Learn Quran and</Text>
        <Text style={styles.subTitle}>Recite once everyday</Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <Svg
          width={314}
          height={450}
          viewBox="0 0 314 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <G clipPath="url(#a)">
            <Rect width={314} height={450} rx={30} fill="#672cbc" />
            <Path
              d="M-14 147.07H92.3s-7.6-23.3-20.4-19.9c-12.8 3.3-12.3 6.2-12.3 6.2s-3.8-19.9-20.9-17.1-20.9 16.6-20.9 16.6-10.9-4.3-15.7 0c-4.7 4.3-3.8 6.6-3.8 6.6s-10.4-4.7-12.3 7.6"
              fill="#fff"
              style={{ mixBlendMode: "soft-light" }}
              opacity={0.5}
            />
            <Path
              d="M267 104.216c-1.2-3.4-3.9-9.3-8.1-10.7-6-2-14.9 4.6-14.9 4.6s-4.3-15.5-18.7-16.1-11.8 15.8-11.8 15.8-3.7-1.1-11.2-3.4-10.1 4.6-10.1 4.6c-4.7-1.7-6.6 2.8-7.2 5.2z"
              fill="#fff"
              style={{ mixBlendMode: "soft-light" }}
              opacity={0.8}
            />
            <Path
              d="M43.7 4s-.2 2.6-2.7 2.9c2.5.3 2.7 2.9 2.7 2.9s.2-2.6 2.7-2.9C43.9 6.7 43.7 4 43.7 4m134 41s-.2 2.6-2.7 2.9c2.5.3 2.7 2.9 2.7 2.9s.2-2.6 2.7-2.9c-2.5-.2-2.7-2.9-2.7-2.9m-98-10s-.2 2.6-2.7 2.9c2.5.3 2.7 2.9 2.7 2.9s.2-2.6 2.7-2.9c-2.5-.2-2.7-2.9-2.7-2.9m220 69s-.2 2.6-2.7 2.9c2.5.3 2.7 2.9 2.7 2.9s.2-2.6 2.7-2.9c-2.6-.2-2.7-2.9-2.7-2.9m-116.4 59.6s-.2 2.6-2.7 2.9c2.5.3 2.7 2.9 2.7 2.9s.2-2.6 2.7-2.9c-2.6-.2-2.7-2.9-2.7-2.9M139.1 74s-.5 7-7.1 7.6c6.6.7 7.1 7.6 7.1 7.6s.5-7 7.1-7.6c-6.6-.6-7.1-7.6-7.1-7.6m-124-11.3s-.5 7-7.1 7.6c6.6.7 7.1 7.6 7.1 7.6s.5-7 7.1-7.6c-6.6-.6-7.1-7.6-7.1-7.6M132.2 4s-.4 5.1-5.2 5.6c4.8.5 5.2 5.6 5.2 5.6s.4-5.1 5.2-5.6c-4.8-.6-5.2-5.6-5.2-5.6M58.6 99s-.3 4.5-4.6 5c4.3.4 4.6 5 4.6 5s.3-4.5 4.6-5c-4.2-.5-4.6-5-4.6-5m40.9 99.9s-.3 4.5-4.6 5c4.3.4 4.6 5 4.6 5s.3-4.5 4.6-5c-4.3-.5-4.6-5-4.6-5"
              fill="#ffd08a"
            />
            <Path
              d="M237.8 172.5h106.3s-7.6-23.3-20.4-19.9c-12.8 3.3-12.3 6.2-12.3 6.2s-3.8-19.9-20.9-17.1-20.9 16.6-20.9 16.6-10.9-4.3-15.7 0c-4.7 4.3-3.8 6.6-3.8 6.6s-10.4-4.7-12.3 7.6"
              fill="#fff"
              style={{ mixBlendMode: "soft-light" }}
              opacity={0.5}
            />
            <Path
              opacity={0.25}
              d="M158.9 368.8c69.533 0 125.9-13.118 125.9-29.3s-56.367-29.3-125.9-29.3S33 323.318 33 339.5s56.367 29.3 125.9 29.3"
              fill="#042030"
            />
            <Path
              d="m257.5 198.1-98.6 33.7-98.7-33.7L13 266.7l145.9 49.9 145.8-49.9z"
              fill="#4e2999"
            />
            <Path
              opacity={0.45}
              d="m30.2 263.9 121 46.3-41.6-41.2s-68.3-16.5-79.4-5.1m257.4 0-121 46.3 41.6-41.2c-.1 0 68.2-16.5 79.4-5.1"
              fill="#240f4f"
            />
            <Path
              d="M158.9 316.6 13 266.7v6.5l145.9 49.9 145.8-49.9v-6.5z"
              fill="#994ef8"
            />
            <Path d="m81.2 346.6 16.9-44.3 54.4 18.6z" fill="#3b1e77" />
            <Path
              opacity={0.45}
              d="m85.9 333.8 66.6-12.9-54.4-18.6z"
              fill="#3b1e77"
            />
            <Path
              d="m158.9 318.6-77.7 28 5.8 6.1 71.9-25.6 71.8 25.6 5.9-6.1z"
              fill="#994ef8"
            />
            <Path d="m236.6 346.6-17-44.3-54.4 18.6z" fill="#3b1e77" />
            <Path
              opacity={0.45}
              d="m231.8 333.8-66.6-12.9 54.4-18.6z"
              fill="#3b1e77"
            />
            <Path
              d="M158.9 327.1a5.3 5.3 0 1 0 0-10.6 5.3 5.3 0 0 0 0 10.6"
              fill="#fff"
              fillOpacity={0.5}
            />
          </G>
          <Defs>
            <ClipPath id="a">
              <Path fill="#fff" d="M0 0h314v450H0z" />
            </ClipPath>
          </Defs>
        </Svg>
        <TouchableOpacity
          onPress={() => navigation.replace("MainTabs")}
          style={{ marginTop: -40 }}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D2233",
    gap: 20,
  },
  arabicText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "Poppins",
  },
  subTitle: {
    fontSize: 18,
    color: "#A19CC5",
    fontFamily: "Poppins",
  },
  loader: {},
  buttonText: {
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 40,
    backgroundColor: "#F9B091",
    fontWeight: "bold",
    fontSize: 18,
    color: "#091945",
  },
});
