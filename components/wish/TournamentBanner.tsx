import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TournamentBannerProps {
  label?: string;
  onPress?: () => void;
}

export default function TournamentBanner({ label = "토너먼트 하러 가기", onPress }: TournamentBannerProps) {
  return (
    <TouchableOpacity style={styles.outer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.inner}>
        <View style={styles.row}>
          <View style={styles.leftGroup}>
            <MaterialCommunityIcons name="sword-cross" size={18} color="#464B47" />
            <Text style={styles.label}>{label}</Text>
          </View>
          <Ionicons name="caret-forward" size={12} color="#464B47" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: "stretch",
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E8F9C7",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    boxShadow:
      "inset 4px 4px 2px rgba(255, 255, 255, 0.30), inset -4px -4px 4px rgba(104, 171, 110, 0.30)",
  },
  inner: {
    flex: 1,
    backgroundColor: "#FAFFF9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    color: "#464B47",
    lineHeight: 18,
  },
});
