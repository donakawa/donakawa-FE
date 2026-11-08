import InsetShadow from "@/components/common/InsetShadow";
import SpeechBubble from "@/components/common/SpeechBubble";
import { useChats, useDeleteChat } from "@/api/chats";
import BuyOrNotMenu from "@/components/buyOrNot/BuyOrNotMenu";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BuyOrNotStartScreen() {
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { data: chats } = useChats();
  const deleteChat = useDeleteChat();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar
        onBack={() => router.back()}
        rightVariant="menu"
        onRightPress={() => setIsMenuVisible(true)}
      />

      <View style={styles.mainPanel}>
        <WishFlowTitleBanner
          title="살말추천"
          subtitle="프리더햄톨의"
          topRadius
        />

        <View style={styles.body}>
          <View style={styles.bubbleWrap}>
            <SpeechBubble
              text={"위시템을 살지 말지\n고민이 되니?\n내가 한 번 봐주마"}
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
              onPress={() => router.push("/wish/buyornot-select")}
            >
              <InsetShadow
                style={styles.ctaButton}
                shadowColor="rgba(229, 153, 153, 0.80)"
                shadowOffset={{ width: -3, height: -4 }}
                shadowBlur={7}
                reflectedLightColor="#FFE7F1"
                reflectedLightOffset={{ width: 1, height: 3 }}
                reflectedLightBlur={4}
              >
                <Text style={styles.ctaText}>위시 선택</Text>
                <View style={styles.ctaBorder} />
              </InsetShadow>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <BuyOrNotMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        historyItems={(chats ?? []).map((chat) => ({ id: chat.id, name: chat.title }))}
        onDeleteHistory={(id) => deleteChat.mutateAsync(id)}
        onPressNewRecommendation={() => {
          setIsMenuVisible(false);
          router.push("/wish/buyornot-select");
        }}
      />
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
    width: 162,
    height: 51,
    backgroundColor: "#FFDBEB",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaBorder: {
    ...StyleSheet.absoluteFill,
    pointerEvents: "none",
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
  },
});
