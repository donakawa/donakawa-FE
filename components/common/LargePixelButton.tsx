import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

interface LargePixelButtonProps {
  icon?: IoniconsName;
  image?: ImageSourcePropType;
  label: string;
  color?: string;
  onPress?: () => void;
}

export default function LargePixelButton({
  icon,
  image,
  label,
  color = "#E67972",
  onPress,
}: LargePixelButtonProps) {
  return (
    <TouchableOpacity style={styles.outer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.inner}>
        <View style={styles.content}>
          {image ? (
            <Image source={image} style={styles.iconImage} resizeMode="contain" />
          ) : icon ? (
            <Ionicons name={icon} size={23} color={color} />
          ) : (
            <View style={styles.iconPlaceholder}>
              <View style={[styles.iconPlaceholderInner, { backgroundColor: color }]} />
            </View>
          )}
          <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 120,
    height: 134,
    paddingHorizontal: 18,
    paddingVertical: 17,
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 8,
  },
  iconPlaceholder: {
    width: 23,
    height: 23,
    overflow: "hidden",
  },
  iconImage: {
    width: 23,
    height: 23,
  },
  iconPlaceholderInner: {
    position: "absolute",
    width: 17.25,
    height: 17.25,
    left: 2.88,
    top: 2.88,
  },
  label: {
    fontSize: 12,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    lineHeight: 18,
    textAlign: "center",
  },
});
