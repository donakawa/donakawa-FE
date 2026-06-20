import type { ReactNode } from "react";
import {
  StyleSheet,
  type StyleProp,
  Text,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native";

const BORDER_WIDTH = 2;
const BORDER_COLOR = "#9CCCA0";
const FILL_COLOR = "#FBFBF5";
const TAIL_HALF_WIDTH = 8;
const TAIL_HEIGHT = 10;

interface SpeechBubbleProps {
  text?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  bubbleStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function SpeechBubble({
  text,
  children,
  style,
  bubbleStyle,
  textStyle,
}: SpeechBubbleProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.bubble, bubbleStyle]}>
        {text ? (
          <Text style={[styles.text, textStyle]}>{text}</Text>
        ) : (
          children
        )}
      </View>
      <View style={styles.tailWrap}>
        <View style={styles.tailOuter} />
        <View style={styles.tailInner} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: FILL_COLOR,
    borderWidth: BORDER_WIDTH,
    borderColor: BORDER_COLOR,
    borderRadius: 16,
  },
  text: {
    color: "#7A5751",
    fontSize: 14,
    fontFamily: "Galmuri9",
    lineHeight: 21,
    textAlign: "center",
  },
  tailWrap: {
    width: TAIL_HALF_WIDTH * 2,
    height: TAIL_HEIGHT,
    marginTop: -BORDER_WIDTH,
  },
  tailOuter: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    borderLeftWidth: TAIL_HALF_WIDTH,
    borderRightWidth: TAIL_HALF_WIDTH,
    borderTopWidth: TAIL_HEIGHT,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: BORDER_COLOR,
  },
  tailInner: {
    position: "absolute",
    top: -BORDER_WIDTH,
    left: BORDER_WIDTH,
    width: 0,
    height: 0,
    borderLeftWidth: TAIL_HALF_WIDTH - BORDER_WIDTH,
    borderRightWidth: TAIL_HALF_WIDTH - BORDER_WIDTH,
    borderTopWidth: TAIL_HEIGHT - BORDER_WIDTH,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: FILL_COLOR,
  },
});
