import { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { BuyOrNotMessageSegment } from "@/types/buyOrNot";

interface SpeechBubbleProps {
  segments?: BuyOrNotMessageSegment[];
  children?: ReactNode;
  showNextIcon?: boolean;
  typewriter?: boolean;
}

const TYPEWRITER_INTERVAL_MS = 35;

export default function SpeechBubble({
  segments = [],
  children,
  showNextIcon = false,
  typewriter = false,
}: SpeechBubbleProps) {
  const fullText = segments.map((segment) => segment.text).join("");
  const [revealedCount, setRevealedCount] = useState(fullText.length);

  useEffect(() => {
    if (!typewriter || !fullText) {
      setRevealedCount(fullText.length);
      return;
    }

    setRevealedCount(0);

    let charCount = 0;
    const intervalId = setInterval(() => {
      charCount += 1;
      setRevealedCount(charCount);

      if (charCount >= fullText.length) {
        clearInterval(intervalId);
      }
    }, TYPEWRITER_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fullText, typewriter]);

  let consumed = 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.tail} />

      <View style={styles.bubble}>
        {children ? (
          children
        ) : (
          <Text style={styles.textWrapper}>
            {segments.map((segment, index) => {
              const visibleLength = Math.max(
                0,
                Math.min(segment.text.length, revealedCount - consumed),
              );
              const visibleText = segment.text.slice(0, visibleLength);
              consumed += segment.text.length;

              return (
                <Text
                  key={index}
                  style={segment.highlight ? styles.highlightText : styles.text}
                >
                  {visibleText}
                </Text>
              );
            })}
          </Text>
        )}
        {showNextIcon && <Text style={styles.nextIcon}>▼</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },

  bubble: {
    width: 335,
    height: 115,
    borderWidth: 3,
    borderColor: "#9CCCA0",
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  tail: {
    position: "absolute",
    top: -7,
    left: 18,
    width: 14,
    height: 14,
    backgroundColor: "#FAFFF9",
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderColor: "#9CCCA0",
    transform: [{ rotate: "45deg" }],
    zIndex: 10,
  },

  textWrapper: {
    textAlign: "center",
  },

  text: {
    fontFamily: "Galmuri",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#2D322E",
  },

  highlightText: {
    fontFamily: "GalmuriBold",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#E67972",
  },

  nextIcon: {
    position: "absolute",
    right: 14,
    bottom: 10,
    fontSize: 14,
    color: "#72C27E",
  },
});
