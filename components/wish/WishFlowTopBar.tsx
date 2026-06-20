import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type RightVariant = "menu" | "close";

interface WishFlowTopBarProps {
  onBack?: () => void;
  rightVariant?: RightVariant;
  onRightPress?: () => void;
}

export default function WishFlowTopBar({
  onBack,
  rightVariant = "menu",
  onRightPress,
}: WishFlowTopBarProps) {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());
  const handleRight = onRightPress ?? (() => router.back());

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconBtn} onPress={handleBack} hitSlop={8}>
        <Ionicons name="chevron-back" size={28} color="#464B47" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn} onPress={handleRight} hitSlop={8}>
        <Ionicons name={rightVariant} size={28} color="#464B47" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 20,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
