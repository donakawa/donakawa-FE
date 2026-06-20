import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ONBOARDING_STORAGE_KEY } from "@/constants/onboarding";

export default function Layout() {
  const pathname = usePathname();
  const router = useRouter();
  const isWishItemPage = pathname === "/wish/item";
  const [loaded] = useFonts({
    Galmuri9: require("@/assets/fonts/Galmuri9.ttf"),
    Galmuri: require("@/assets/fonts/Galmuri11.ttf"),
    GalmuriBold: require("@/assets/fonts/Galmuri11-Bold.ttf"),

    WantedSansBlack: require("@/assets/fonts/WantedSans-Black.otf"),
    WantedSansBold: require("@/assets/fonts/WantedSans-Bold.otf"),
    WantedSansExtraBlack: require("@/assets/fonts/WantedSans-ExtraBlack.otf"),
    WantedSansExtraBold: require("@/assets/fonts/WantedSans-ExtraBold.otf"),
    WantedSansMedium: require("@/assets/fonts/WantedSans-Medium.otf"),
    WantedSansRegular: require("@/assets/fonts/WantedSans-Regular.otf"),
    WantedSansSemiBold: require("@/assets/fonts/WantedSans-SemiBold.otf"),
  });

  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const seen = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (cancelled) return;
      if (seen !== "true") {
        router.replace("/onboarding");
      }
      setOnboardingChecked(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!loaded || !onboardingChecked) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView
        edges={isWishItemPage ? ["left", "right", "bottom"] : undefined}
        style={{ flex: 1, backgroundColor: "#FFFDF8" }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 393,
            alignSelf: "center",
            backgroundColor: "#FFFDF8",
          }}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
