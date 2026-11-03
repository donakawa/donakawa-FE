import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";

import { useChats, useDeleteChat } from "@/api/chats";
import { useWishItem, type WishItemType } from "@/api/wishlist";
import BuyOrNotCharacter from "@/components/buyOrNot/BuyOrNotCharacter";
import BuyOrNotMenu from "@/components/buyOrNot/BuyOrNotMenu";
import ChoiceButton from "@/components/buyOrNot/ChoiceButton";
import SpeechBubble from "@/components/buyOrNot/SpeechBubble";
import SimpleModal from "@/components/common/SimpleModal";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";

import { useBuyOrNotFlow } from "@/hooks/useBuyOrNotFlow";

type BuyOrNotParams = {
  chatId?: string;
  wishItemId?: string;
  type?: WishItemType;
};

export default function BuyOrNotPage() {
  const { chatId: chatIdParam, wishItemId = "", type = "AUTO" } =
    useLocalSearchParams<BuyOrNotParams>();
  const chatId = Number(chatIdParam);

  const {
    phase,
    currentQuestion,
    result,
    isResultFinalStep,
    isWaitingForTap,
    bubbleMessage,
    selectOption,
    goNext,
  } = useBuyOrNotFlow(chatId);

  const { data: wishItem } = useWishItem(wishItemId, type, { enabled: !!wishItemId });
  const { data: chats } = useChats();
  const deleteChat = useDeleteChat();

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setIsExitModalVisible(true);
      return true;
    });
    return () => sub.remove();
  }, []);

  const isResult = phase === "RESULT";
  const isQuestion = phase === "QUESTION";

  const exitFlow = () => {
    setIsExitModalVisible(false);
    if (!isResult && Number.isFinite(chatId)) deleteChat.mutate(chatId);
    router.navigate("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <WishFlowTopBar
        onBack={() => setIsExitModalVisible(true)}
        rightVariant="menu"
        onRightPress={() => setIsMenuVisible(true)}
      />

      <WishFlowTitleBanner title="살말추천" subtitle="프리더햄톨의" />

      <View style={styles.mainArea}>
        <View style={styles.itemInfo}>
          {!isResult && wishItem && (
            <Text style={styles.itemText}>
              {wishItem.name} ·{" "}
              <Text style={styles.itemPrice}>
                {wishItem.price.toLocaleString()}
              </Text>
            </Text>
          )}
        </View>

        <View style={styles.content}>
          <BuyOrNotCharacter
            itemPosition={
              isResult
                ? "none"
                : (currentQuestion?.step ?? 1) === 1
                  ? "center"
                  : "right"
            }
            itemImageUri={wishItem?.photoUrl ?? undefined}
          />

          <Pressable
            disabled={!isWaitingForTap}
            onPress={goNext}
            style={styles.bubbleArea}
          >
            <SpeechBubble
              segments={bubbleMessage}
              showNextIcon={isWaitingForTap}
              typewriter={!isQuestion}
            />
          </Pressable>

          {isWaitingForTap && (
            <Text style={styles.helperText}>
              *말풍선을 터치해 대화를 이어가세요.
            </Text>
          )}

          {isQuestion && currentQuestion && (
            <View style={styles.answerArea}>
              {currentQuestion.options.map((option) => (
                <ChoiceButton
                  key={option.id}
                  text={option.label}
                  onPress={() => selectOption(option)}
                />
              ))}
            </View>
          )}

          {isResult && result && isResultFinalStep && (
            <View style={styles.answerArea}>
              <ChoiceButton
                text={result.primaryButtonText}
                onPress={() => router.back()}
              />

              <ChoiceButton
                text={result.secondaryButtonText}
                onPress={() => router.push("/wish/buyornot-select")}
              />
            </View>
          )}
        </View>
      </View>

      <SimpleModal
        visible={isExitModalVisible}
        title="종료하시겠습니까?"
        description={"현재 단계에서 나가면\n진행사항이 모두 취소됩니다."}
        confirmText="네"
        onCancel={() => setIsExitModalVisible(false)}
        onConfirm={exitFlow}
      />

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
    backgroundColor: "#FBFAF4",
  },

  mainArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  itemInfo: {
    height: 38,
    marginBottom: 30,
    justifyContent: "center",
  },

  itemText: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#787D79",
  },

  itemPrice: {
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#464B47",
  },

  content: {
    flex: 1,
    alignItems: "center",
  },

  bubbleArea: {
    marginTop: -2,
    zIndex: 20,
  },

  answerArea: {
    marginTop: 24,
    gap: 12,
  },

  helperText: {
    width: 335,
    marginTop: 9,
    fontFamily: "Galmuri9",
    fontSize: 12,
    color: "#AAAFAB",
    textAlign: "right",
  },
});
