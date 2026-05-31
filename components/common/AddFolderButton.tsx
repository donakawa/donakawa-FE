import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AddFolderButtonProps {
  onPress?: () => void;
}

export default function AddFolderButton({ onPress }: AddFolderButtonProps) {
  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <Ionicons name="add" size={40} color="#7EC985" />
      </View>
      <Text style={styles.label}>새 폴더</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 162,
    gap: 8,
  },
  card: {
    width: 162,
    height: 162,
    backgroundColor: "#FAFFF9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0F9BF",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    color: "#2D322E",
  },
});
