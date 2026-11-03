import InsetShadow from "@/components/common/InsetShadow";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TournamentBannerProps {
  label?: string;
  onPress?: () => void;
}

export default function TournamentBanner({ label = "토너먼트 하러 가기", onPress }: TournamentBannerProps) {
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress} activeOpacity={0.9}>
      <InsetShadow style={styles.outer}>
        <View style={styles.inner}>
          <View style={styles.row}>
            <View style={styles.leftGroup}>
              <MaterialCommunityIcons name="sword-cross" size={18} color="#464B47" />
              <Text style={styles.label}>{label}</Text>
            </View>
            <Ionicons name="caret-forward" size={12} color="#464B47" />
          </View>
        </View>
        <View style={styles.outerBorder} />
      </InsetShadow>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    alignSelf: "stretch",
  },
  outer: {
    height: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E8F9C7",
    borderRadius: 5,
  },
  outerBorder: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "none",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
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
