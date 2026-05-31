import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface PixelButtonProps {
  icon?: IoniconsName;
  label: string;
  backgroundColor: string;
  accentColor: string;
  iconColor?: string;
  innerColor?: string;
  pressedBackgroundColor?: string;
  pressedInnerColor?: string;
  pressedIconColor?: string;
  onPress?: () => void;
}

export default function PixelButton({
  icon,
  label,
  backgroundColor,
  accentColor,
  iconColor,
  innerColor = "#FAFFF9",
  pressedBackgroundColor,
  pressedInnerColor = "#C3C8C4",
  pressedIconColor,
  onPress,
}: PixelButtonProps) {
  const [pressed, setPressed] = useState(false);

  const resolvedIconColor = iconColor ?? accentColor;
  const outerBg = pressed ? (pressedBackgroundColor ?? accentColor) : backgroundColor;
  const innerBg = pressed ? pressedInnerColor : innerColor;
  const currentIconColor = pressed ? (pressedIconColor ?? resolvedIconColor) : resolvedIconColor;
  const outerBorderColor = pressed ? "#919692" : accentColor;
  const innerBorderColor = pressed ? "#787D79" : accentColor;

  return (
    <View style={styles.outerWrap}>
      <View style={[styles.outerShadow, { backgroundColor: accentColor, opacity: pressed ? 0 : 0.24 }]} />
      <TouchableOpacity
        style={[styles.outer, { backgroundColor: outerBg, transform: [{ translateY: pressed ? 3 : 0 }] }]}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={1}
      >
        <View style={[styles.borderOverlay, { borderColor: outerBorderColor }]} />
        <View style={[styles.inner, { backgroundColor: innerBg }]}>
          <View style={[styles.innerBorderOverlay, { borderColor: innerBorderColor }]} />
          {icon && <Ionicons name={icon} size={18} color={currentIconColor} />}
          <Text style={[styles.label, { color: currentIconColor }]}>{label}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    position: "relative",
    width: 60,
    height: 60,
  },
  outerShadow: {
    position: "absolute",
    top: 3,
    right: -1,
    bottom: -2,
    left: 2,
    pointerEvents: "none",
    borderRadius: 5,
  },
  outer: {
    position: "relative",
    width: 60,
    height: 60,
    padding: 6,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow:
      "inset 4px 4px 2px rgba(255, 255, 255, 0.30), inset -4px -4px 4px rgba(104, 171, 110, 0.30)",
  },
  innerBorderOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: 1,
    borderRadius: 3,
    opacity: 0.4,
    pointerEvents: "none",
  },
  borderOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: 1,
    borderRadius: 4,
    opacity: 0.4,
    pointerEvents: "none",
  },
  inner: {
    flex: 1,
    backgroundColor: "#FAFFF9",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: "#3D2B27",
    lineHeight: 18,
  },
});
