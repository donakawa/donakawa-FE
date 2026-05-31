import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DoneButtonProps {
  label?: string;
  onPress?: () => void;
}

export default function DoneButton({ label = "완료", onPress }: DoneButtonProps) {
  return (
    <TouchableOpacity style={styles.outer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    height: 41,
    padding: 9,
    backgroundColor: "#FFDBEB",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E67972",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    boxShadow:
      "inset -4px -4px 4px rgba(104, 171, 110, 0.30), inset 4px 4px 2px rgba(255, 255, 255, 0.30)",
  },
  inner: {
    width: 40,
    height: 23,
    paddingHorizontal: 2,
    paddingVertical: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#3D2B27",
    fontSize: 12,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "center",
  },
});
