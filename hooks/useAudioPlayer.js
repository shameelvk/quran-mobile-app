import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { Audio } from "expo-av";

export function useAudioPlayer() {
  const [playingAyah, setPlayingAyah] = useState(null);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    // Cleanup audio on unmount or when a new sound is loaded
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playAudio = async (ayah, reciterKey = "1") => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const audioUrl = ayah.audio[reciterKey]?.url;

      if (!audioUrl) {
        Alert.alert("Error", "Audio not available for this Ayah");
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );

      setSound(newSound);
      setPlayingAyah(ayah.ayahNo);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingAyah(null);
        }
      });
    } catch (error) {
      Alert.alert("Error", "Could not play audio");
      console.error("Error playing audio:", error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      await sound.stopAsync();
      setPlayingAyah(null);
    }
  };

  return {
    playingAyah,
    playAudio,
    stopAudio,
  };
}
