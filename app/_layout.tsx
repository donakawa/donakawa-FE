import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const [loaded] = useFonts({
    // Galmuri
    Galmuri9: require("@/assets/fonts/Galmuri9.ttf"),
    Galmuri: require("@/assets/fonts/Galmuri11.ttf"),
    GalmuriBold: require("@/assets/fonts/Galmuri11-Bold.ttf"),

    // WantedSans
    WantedSansBlack: require("@/assets/fonts/WantedSans-Black.otf"),
    WantedSansBold: require("@/assets/fonts/WantedSans-Bold.otf"),
    WantedSansExtraBlack: require("@/assets/fonts/WantedSans-ExtraBlack.otf"),
    WantedSansExtraBold: require("@/assets/fonts/WantedSans-ExtraBold.otf"),
    WantedSansMedium: require("@/assets/fonts/WantedSans-Medium.otf"),
    WantedSansRegular: require("@/assets/fonts/WantedSans-Regular.otf"),
    WantedSansSemiBold: require("@/assets/fonts/WantedSans-SemiBold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
