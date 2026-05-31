import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ClothesButtonProps {
  onPress?: () => void;
}

export default function ClothesButton({ onPress }: ClothesButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.outerShadow, { opacity: pressed ? 0 : 0.24 }]} pointerEvents="none" />
      <TouchableOpacity
        style={[
          styles.container,
          pressed && styles.containerPressed,
          { transform: [{ translateY: pressed ? 3 : 0 }] },
        ]}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={1}
      >
        <View style={styles.borderOverlay} pointerEvents="none" />

        <LinearGradient
          colors={["rgba(255, 255, 255, 0.85)", "rgba(255, 255, 255, 0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 0.15]}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />

        <LinearGradient
          colors={["rgba(104, 171, 110, 0)", "rgba(104, 171, 110, 0.5)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          locations={[0.85, 1]}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: 51,
    height: 51,
  },
  outerShadow: {
    position: "absolute",
    top: 3,
    right: -1,
    bottom: -2,
    left: 2,
    borderRadius: 5,
    backgroundColor: "#68AB6E",
  },
  container: {
    width: 51,
    height: 51,
    borderRadius: 4,
    backgroundColor: "#FAFFF9",
    paddingTop: 6,
    paddingBottom: 7,
    paddingLeft: 14,
    paddingRight: 13,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  containerPressed: {
    backgroundColor: "#C3C8C4",
  },
  content: {
    width: 24,
    alignItems: "center",
    gap: 4,
  },
  iconBox: {
    paddingHorizontal: 3,
    paddingVertical: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 17.5,
    height: 14,
    tintColor: "#3D2B27",
  },
  borderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8F9C7",
  },
  gradientOverlay: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 2,
  },
  label: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#3D2B27",
    fontSize: 12,
    fontFamily: "Galmuri9",
    lineHeight: 18,
  },
});
