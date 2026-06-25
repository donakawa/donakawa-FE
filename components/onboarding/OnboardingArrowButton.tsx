import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface OnboardingArrowButtonProps {
  direction: "left" | "right";
  onPress: () => void;
}

export default function OnboardingArrowButton({
  direction,
  onPress,
}: OnboardingArrowButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={12}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={direction === "left" ? "이전 페이지" : "다음 페이지"}
    >
      <MaterialIcons
        name={direction === "left" ? "arrow-circle-left" : "arrow-circle-right"}
        size={48}
        color="#7EC985"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
