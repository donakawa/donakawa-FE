import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

interface StrokeTextProps {
  text: string;
  color: string;
  strokeColor: string;
  fontSize: number;
  strokeWidth?: number;
  align?: "left" | "center" | "right";
  fontFamily?: string;
  lineHeight?: number;
}

export default function StrokeText({
  text,
  color,
  strokeColor,
  fontSize,
  strokeWidth = 2,
  align = "left",
  fontFamily = "GalmuriBold",
  lineHeight,
}: StrokeTextProps) {
  const shadowPositions = [
    [-strokeWidth, 0],
    [strokeWidth, 0],
    [0, -strokeWidth],
    [0, strokeWidth],
    [-strokeWidth, -strokeWidth],
    [strokeWidth, -strokeWidth],
    [-strokeWidth, strokeWidth],
    [strokeWidth, strokeWidth],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];

  const containerStyle: ViewStyle = {
    alignSelf:
      align === "center"
        ? "center"
        : align === "right"
          ? "flex-end"
          : "flex-start",
  };

  const textStyle: TextStyle = {
    fontSize,
    lineHeight: lineHeight ?? fontSize + 6,
    fontFamily,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {shadowPositions.map(([x, y], index) => (
        <Text
          key={index}
          style={[
            styles.strokeText,
            textStyle,
            {
              color: strokeColor,
              transform: [{ translateX: x }, { translateY: y }],
            },
          ]}
        >
          {text}
        </Text>
      ))}

      <Text style={[styles.frontText, textStyle, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },

  strokeText: {
    position: "absolute",
    left: 0,
    top: 0,
    includeFontPadding: false,
  },

  frontText: {
    includeFontPadding: false,
  },
});
