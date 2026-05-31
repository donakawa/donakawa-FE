import { useState } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CustomizeHamsterButtonProps {
  adornment?: ImageSourcePropType;
  onPress?: () => void;
}

export default function CustomizeHamsterButton({ adornment, onPress }: CustomizeHamsterButtonProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      style={styles.outer}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={1}
    >
      <View style={styles.inner}>
        {adornment && (
          <Image source={adornment} style={styles.adornment} resizeMode="contain" />
        )}
        <Text style={styles.label}>햄꾸</Text>
      </View>
      {pressed && <View style={styles.overlay} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    padding: 9,
    backgroundColor: "#FFDBEB",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E67972",
    boxShadow:
      "inset 4px 4px 2px rgba(255, 255, 255, 0.30), inset -4px -4px 4px rgba(104, 171, 110, 0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: 40,
    height: 40,
    paddingHorizontal: 2,
    paddingVertical: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  adornment: {
    width: 16,
    height: 16,
  },
  label: {
    color: "#3D2B27",
    fontSize: 12,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    backgroundColor: "rgba(195, 200, 196, 0.45)",
    borderRadius: 3,
  },
});
