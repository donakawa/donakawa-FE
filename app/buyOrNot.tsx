import { router } from "expo-router";
import { useEffect, useState } from "react";
import { BackHandler, Pressable, StyleSheet, Text, View } from "react-native";

import BuyOrNotCharacter from "@/components/buyOrNot/BuyOrNotCharacter";
import BuyOrNotMenu from "@/components/buyOrNot/BuyOrNotMenu";
import ChoiceButton from "@/components/buyOrNot/ChoiceButton";
import SpeechBubble from "@/components/buyOrNot/SpeechBubble";
import SimpleModal from "@/components/common/SimpleModal";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";

import { BUY_OR_NOT_MOCK_SESSION } from "@/constants/buyOrNot.mock";
import { useBuyOrNotFlow } from "@/hooks/useBuyOrNotFlow";

export default function BuyOrNotPage() {
  const {
    phase,
    currentQuestion,
    result,
    isResultFinalStep,
    bubbleMessage,
    selectOption,
    goNext,
    restart,
  } = useBuyOrNotFlow(BUY_OR_NOT_MOCK_SESSION);

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
  const isLoading = phase === "LOADING";
  const isQuestion = phase === "QUESTION";
  const isWaitingForTap = isLoading || (isResult && !isResultFinalStep);

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
          {!isResult && (
            <Text style={styles.itemText}>
              {BUY_OR_NOT_MOCK_SESSION.wishItem.name} ·{" "}
              <Text style={styles.itemPrice}>
                {BUY_OR_NOT_MOCK_SESSION.wishItem.price.toLocaleString()}
              </Text>
            </Text>
          )}
        </View>

        <View style={styles.content}>
          <BuyOrNotCharacter
            itemPosition={
              isResult
                ? "none"
                : currentQuestion.order === 1
                  ? "center"
                  : "right"
            }
            itemImageUri={BUY_OR_NOT_MOCK_SESSION.wishItem.imageUrl}
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

          {isQuestion && (
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
        onConfirm={() => {
          setIsExitModalVisible(false);
          router.navigate("/(tabs)");
        }}
      />

      <BuyOrNotMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        historyItemNames={[BUY_OR_NOT_MOCK_SESSION.wishItem.name]}
        onPressNewRecommendation={() => {
          setIsMenuVisible(false);
          restart();
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
