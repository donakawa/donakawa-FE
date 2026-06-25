import { Image, StyleSheet, Text, View } from "react-native";
import type { OnboardingPageData } from "@/constants/onboarding";

interface OnboardingPageProps {
  data: OnboardingPageData;
  width: number;
}

export default function OnboardingPage({ data, width }: OnboardingPageProps) {
  return (
    <View style={[styles.container, { width }]}>
      <Text style={styles.description}>{data.description}</Text>
      <View style={styles.imageWrapper}>
        <Image source={data.image} style={styles.image} resizeMode="contain" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 120,
    paddingHorizontal: 32,
  },
  description: {
    fontFamily: "WantedSansSemiBold",
    fontSize: 20,
    lineHeight: 30,
    color: "#2D322E",
    textAlign: "center",
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
