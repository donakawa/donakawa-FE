import { StyleSheet, View } from "react-native";

interface PageIndicatorProps {
  total: number;
  current: number;
}

export default function PageIndicator({ total, current }: PageIndicatorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i <= current ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
  },
  dotActive: {
    backgroundColor: "#7EC985",
  },
  dotInactive: {
    backgroundColor: "#DCE1DD",
  },
});
