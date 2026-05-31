import { StyleSheet, View, ViewProps } from "react-native";

interface InsetShadowProps extends ViewProps {
  borderRadius?: number;
  children: React.ReactNode;
}

export default function InsetShadow({ borderRadius = 0, style, children, ...rest }: InsetShadowProps) {
  const r = { borderRadius };
  const flattenedStyle = StyleSheet.flatten(style);

  return (
    <View style={[styles.container, flattenedStyle]} {...rest}>
      {children}
      <View style={[StyleSheet.absoluteFill, styles.topLeft, r]} />
      <View style={[StyleSheet.absoluteFill, styles.bottomRight, r]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  topLeft: {
    pointerEvents: "none",
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopColor: "rgba(104, 171, 110, 0.30)",
    borderLeftColor: "rgba(104, 171, 110, 0.30)",
  },
  bottomRight: {
    pointerEvents: "none",
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomColor: "rgba(255, 255, 255, 0.30)",
    borderRightColor: "rgba(255, 255, 255, 0.30)",
  },
});
