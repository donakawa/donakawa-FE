import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

interface WishAddContainerProps {
  onPress?: () => void;
}

export default function WishAddContainer({ onPress }: WishAddContainerProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="add-circle" size={48} color="#7EC985" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 109,
    height: 109,
    paddingTop: 31,
    paddingBottom: 30,
    paddingLeft: 30,
    paddingRight: 31,
    backgroundColor: "#DCE1DD",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
});
