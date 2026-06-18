import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
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

    Roboto: require("@/assets/fonts/Roboto-Medium.ttf"),
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#FFFDF8" }}
        edges={["top"]}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 393,
            alignSelf: "center",
            backgroundColor: "#FBF9F5",
          }}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
