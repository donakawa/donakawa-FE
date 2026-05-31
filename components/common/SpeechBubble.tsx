import { StyleSheet, Text, View } from "react-native";

interface SpeechBubbleProps {
  text: string;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 107,
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    shadowColor: "rgb(170, 189, 172)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.8,
    elevation: 3,
  },
  textWrap: {
    position: "absolute",
    left: 9,
    top: 6,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  text: {
    color: "#7A5751",
    fontSize: 12,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "center",
  },
});
