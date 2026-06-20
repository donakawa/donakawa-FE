import InsetShadow from "@/components/common/InsetShadow";
import SpeechBubble from "@/components/common/SpeechBubble";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TournamentIntroScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar
        onBack={() => router.back()}
        rightVariant="menu"
        onRightPress={() => {}}
      />

      {/* Rounded main panel */}
      <View style={styles.mainPanel}>
        <WishFlowTitleBanner
          title="토너먼트"
          subtitle="당신의 최종선택은?"
          topRadius
        />

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.noticeText}>*최대 16개의 위시템으로 비교할 수 있습니다.</Text>

          <View style={styles.bubbleWrap}>
            <SpeechBubble
              text={"여러 위시 중에서\n고민이 되니?\n토너먼트를 해 봐!"}
            />
          </View>

          <View style={styles.heroCircle}>
            <Image
              source={require("@/assets/images/tournament/hamster.png")}
              style={styles.heroImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.ctaArea}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.ctaTouchable}
              onPress={() => router.push("/wish/tournament-select")}
            >
              <InsetShadow
                style={styles.ctaButton}
                shadowColor="rgba(230, 153, 153, 0.80)"
                shadowOffset={{ width: -3, height: -4 }}
                shadowBlur={7}
                reflectedLightColor="#FFE7F1"
                reflectedLightOffset={{ width: 1, height: 3 }}
                reflectedLightBlur={4}
              >
                <View pointerEvents="none" style={styles.ctaBorder} />
                <Text style={styles.ctaText}>후보 선택</Text>
              </InsetShadow>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  mainPanel: {
    flex: 1,
    backgroundColor: "#F0FFE5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  noticeText: {
    textAlign: "right",
    color: "#AAAFAB",
    fontSize: 12,
    fontFamily: "Galmuri9",
    lineHeight: 18,
  },
  bubbleWrap: {
    marginTop: 44,
    alignItems: "center",
  },
  heroCircle: {
    alignSelf: "center",
    marginTop: 16,
    width: 209,
    height: 209,
    borderRadius: 209,
    backgroundColor: "#FBFBF5",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroImage: {
    width: 145,
    height: 182,
  },
  ctaArea: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 16,
  },
  ctaTouchable: {
    width: 162,
    height: 51,
  },
  ctaButton: {
    width: "100%",
    height: "100%",
    backgroundColor: "#FFDBEB",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#E67972",
  },
  ctaText: {
    textAlign: "center",
    color: "#7A5751",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    lineHeight: 24,
    textShadowColor: "#7A5751",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
});
