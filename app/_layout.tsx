import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const [loaded] = useFonts({
    // Galmuri
    Galmuri9: require("@/assets/fonts/Galmuri9.ttf"),
    Galmuri: require("@/assets/fonts/Galmuri11.ttf"),
    GalmuriBold: require("@/assets/fonts/Galmuri11-Bold.ttf"),

    // Pretendard
    PretendardThin: require("@/assets/fonts/Pretendard-Thin.otf"),
    PretendardExtraLight: require("@/assets/fonts/Pretendard-ExtraLight.otf"),
    PretendardLight: require("@/assets/fonts/Pretendard-Light.otf"),
    PretendardRegular: require("@/assets/fonts/Pretendard-Regular.otf"),
    PretendardMedium: require("@/assets/fonts/Pretendard-Medium.otf"),
    PretendardSemiBold: require("@/assets/fonts/Pretendard-SemiBold.otf"),
    PretendardBold: require("@/assets/fonts/Pretendard-Bold.otf"),
    PretendardExtraBold: require("@/assets/fonts/Pretendard-ExtraBold.otf"),
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
