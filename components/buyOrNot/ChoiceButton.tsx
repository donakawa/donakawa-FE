import { Pressable, StyleSheet, Text } from "react-native";

interface ChoiceButtonProps {
  text: string;
  onPress: () => void;
}

export default function ChoiceButton({ text, onPress }: ChoiceButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 307,
    height: 48,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    backgroundColor: "#F0FFE5",
    justifyContent: "center",
    alignItems: "center",

    boxShadow: [
      {
        offsetX: 4,
        offsetY: 4,
        blurRadius: 2,
        spreadDistance: 0,
        color: "rgba(255,255,255,0.30)",
        inset: true,
      },
      {
        offsetX: -4,
        offsetY: -4,
        blurRadius: 4,
        spreadDistance: 0,
        color: "rgba(104,171,110,0.30)",
        inset: true,
      },
    ],
  },

  text: {
    fontFamily: "Galmuri9",
    fontSize: 14,
    color: "#2D322E",
  },
});
