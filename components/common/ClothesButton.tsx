import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ClothesButtonProps {
  onPress?: () => void;
}

export default function ClothesButton({ onPress }: ClothesButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={[styles.container, pressed && styles.containerPressed]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={1}
    >
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Image
            source={require("@/assets/images/icons/checkroom.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.label}>옷</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 51,
    height: 51,
    paddingTop: 6,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 13,
    backgroundColor: "#FAFFF9",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "inset -4px -4px 4px rgba(104, 171, 110, 0.30), inset 4px 4px 2px rgba(255, 255, 255, 0.30)",
  },
  containerPressed: {
    backgroundColor: "#C3C8C4",
    boxShadow: "inset 4px 4px 2px rgba(143, 188, 147, 0.30)",
  },
  content: {
    width: 24,
    alignItems: "center",
  },
  iconBox: {
    paddingHorizontal: 3,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  icon: {
    width: 17.5,
    height: 14,
    tintColor: "#3D2B27",
  },
  label: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#3D2B27",
    fontSize: 12,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    lineHeight: 18,
  },
});
