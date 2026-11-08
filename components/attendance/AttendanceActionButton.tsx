import InsetShadow from "@/components/common/InsetShadow";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Variant = "pink" | "green";

interface AttendanceActionButtonProps {
  title: string;
  variant: Variant;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

// 분홍은 위시 CTA(app/wish/tournament.tsx), 초록은 AuthButton primary와 같은 inset 값
const PINK_SHADOW = {
  shadowColor: "rgba(229, 153, 153, 0.80)",
  shadowOffset: { width: -3, height: -4 },
  shadowBlur: 7,
  reflectedLightColor: "#FFE7F1",
  reflectedLightOffset: { width: 1, height: 3 },
  reflectedLightBlur: 4,
};

export default function AttendanceActionButton({
  title,
  variant,
  disabled = false,
  onPress,
  accessibilityLabel,
}: AttendanceActionButtonProps) {
  if (disabled) {
    return (
      <View
        style={[styles.button, styles.disabled]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: true }}
      >
        <Text style={[styles.text, styles.disabledText]}>{title}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <InsetShadow
        style={[styles.button, variant === "pink" ? styles.pink : styles.green]}
        {...(variant === "pink" ? PINK_SHADOW : {})}
      >
        <Text style={styles.text}>{title}</Text>
        <View style={[styles.border, variant === "pink" ? styles.pinkBorder : styles.greenBorder]} />
      </InsetShadow>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 69,
    height: 48,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  pink: {
    backgroundColor: "#FFDBEB",
  },
  green: {
    backgroundColor: "#F0FFE5",
  },
  border: {
    ...StyleSheet.absoluteFill,
    pointerEvents: "none",
    borderRadius: 7,
  },
  pinkBorder: {
    borderWidth: 2,
    borderColor: "#E67972",
  },
  greenBorder: {
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  disabled: {
    backgroundColor: "#DCE1DD",
    borderWidth: 1,
    borderColor: "#AAAFAB",
  },
  text: {
    color: "#7A5751",
    fontFamily: "GalmuriBold",
    fontSize: 15,
  },
  disabledText: {
    color: "#919692",
  },
});
