import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Redirect, Stack, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ONBOARDING_STORAGE_KEY } from "@/constants/onboarding";

type OnboardingState = "loading" | "seen" | "unseen";

export default function Layout() {
  const pathname = usePathname();
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

  const [onboardingState, setOnboardingState] = useState<OnboardingState>("loading");

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_STORAGE_KEY)
      .then((seen) => setOnboardingState(seen === "true" ? "seen" : "unseen"))
      .catch((e) => {
        console.warn("[layout] onboarding check failed", e);
        setOnboardingState("seen");
      });
  }, []);

  if (!loaded || onboardingState === "loading") return null;
  if (onboardingState === "unseen" && pathname !== "/onboarding") {
    return <Redirect href="/onboarding" />;
  }

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
