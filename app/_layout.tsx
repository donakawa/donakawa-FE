import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { setOnAuthExpired } from "@/api/client";
import { queryClient } from "@/api/queryClient";
import { ONBOARDING_STORAGE_KEY } from "@/constants/onboarding";

type OnboardingState = "loading" | "seen" | "unseen";

export default function Layout() {
  const pathname = usePathname();
  const isWishItemPage = pathname === "/wish/item";
  const [loaded] = useFonts({
    Galmuri9: require("@/assets/fonts/Galmuri9.ttf"),
    Galmuri: require("@/assets/fonts/Galmuri11.ttf"),
    GalmuriBold: require("@/assets/fonts/Galmuri11-Bold.ttf"),

    RobotoMedium: require("@/assets/fonts/Roboto-Medium.ttf"),

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

  const router = useRouter();
  useEffect(() => {
    setOnAuthExpired(() => router.replace("/login"));
    return () => setOnAuthExpired(null);
  }, [router]);

  if (!loaded || onboardingState === "loading") return null;
  if (onboardingState === "unseen" && pathname !== "/onboarding") {
    return <Redirect href="/onboarding" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
