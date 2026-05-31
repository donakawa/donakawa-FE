import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MonthSelectButtonProps {
  year: number;
  month: number;
  onPress?: () => void;
}

export default function MonthSelectButton({ year, month, onPress }: MonthSelectButtonProps) {
  return (
    <TouchableOpacity style={styles.wrap} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.pill}>
        <Text style={styles.label}>{`${year}년 ${month}월`}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 179,
    height: 48,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  pill: {
    alignSelf: "stretch",
    height: 35,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F0FFE5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    textAlign: "center",
    color: "#7A5751",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    fontWeight: "600",
    lineHeight: 24,
  },
});
