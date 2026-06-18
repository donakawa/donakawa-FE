import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import MenuIcon from "@/assets/images/common/menu.svg";
import ArrowIcon from "@/assets/images/log/arrow_left.svg";

import BuyOrNotCharacter from "@/components/buyOrNot/BuyOrNotCharacter";
import ChoiceButton from "@/components/buyOrNot/ChoiceButton";
import SpeechBubble from "@/components/buyOrNot/SpeechBubble";

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

  const isResult = phase === "RESULT";
  const isLoading = phase === "LOADING";
  const isQuestion = phase === "QUESTION";
  const isWaitingForTap = isLoading || (isResult && !isResultFinalStep);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ArrowIcon />
        </Pressable>

        <Pressable hitSlop={10}>
          <MenuIcon />
        </Pressable>
      </View>

      <View style={styles.banner}>
        <View style={styles.dotLine}>
          {Array.from({ length: 9 }).map((_, index) => (
            <View key={index} style={styles.dot} />
          ))}
        </View>

        <Text style={styles.subTitle}>프리더챔톨의</Text>

        <View style={styles.titleBox}>
          <Text style={styles.title}>!! 살말추천 !!</Text>
        </View>
      </View>

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
                onPress={restart}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFAF4",
  },

  topHeader: {
    paddingHorizontal: 20,
    height: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  banner: {
    height: 104,
    backgroundColor: "#DDFBB9",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#B6D7A0",

    alignItems: "center",
    justifyContent: "center",
  },

  dotLine: {
    position: "absolute",
    top: 58,
    left: 25,
    right: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dot: {
    width: 6,
    height: 6,
    backgroundColor: "#FFC9E1",
  },

  subTitle: {
    fontFamily: "GalmuriBold",
    fontSize: 12,
    color: "#FF7C8A",
    textDecorationLine: "underline",
    marginBottom: 4,
  },

  titleBox: {
    width: 188,
    height: 45,
    borderWidth: 3,
    borderRadius: 5,
    borderColor: "#FFD3E5",
    backgroundColor: "#FFFDF8",

    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontFamily: "GalmuriBold",
    fontSize: 20,
    color: "#6D514B",
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
