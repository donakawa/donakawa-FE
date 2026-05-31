import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ToastProps {
  visible: boolean;
  message: string;
  onHide: () => void;
  duration?: number;
  bottom?: number;
}

export default function Toast({
  visible,
  message,
  onHide,
  duration = 2000,
  bottom = 120,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(duration),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide());
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { bottom, opacity }]} pointerEvents="none">
      <View style={styles.pill}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: "#2D322E",
    borderRadius: 37.5,
  },
  text: {
    textAlign: "center",
    color: "#FAFFF9",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
});
