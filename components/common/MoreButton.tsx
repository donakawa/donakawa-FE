import { forwardRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type MoreButtonProps = {
  onPress?: () => void;
};

const MoreButton = forwardRef<View, MoreButtonProps>(({ onPress }, ref) => (
  <View ref={ref}>
    <TouchableOpacity
      style={styles.button}
      activeOpacity={0.7}
      hitSlop={8}
      onPress={onPress}
    >
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </TouchableOpacity>
  </View>
));

MoreButton.displayName = "MoreButton";

export default MoreButton;

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#7EC985",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 9999,
    backgroundColor: "#7EC985",
  },
});
