import InsetShadow from "@/components/common/InsetShadow";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type FloatingActionButtonProps = {
  onPress?: () => void;
} & (
  | { image: ImageSourcePropType; label?: never; icon?: never; color?: never }
  | { image?: never; label: string; icon: IoniconsName; color?: string }
);

export default function FloatingActionButton({
  label,
  icon,
  image,
  color = "#E67972",
  onPress,
}: FloatingActionButtonProps) {
  if (image) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.outerWrap}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <InsetShadow borderRadius={36} style={styles.container}>
          <View style={styles.content}>
            <Text style={[styles.label, { color }]}>{label}</Text>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <View style={styles.borderOverlay} />
        </InsetShadow>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    boxShadow: "2px 3px 0px rgba(104, 171, 110, 0.30)",
    elevation: 4,
  },
  container: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FAFFF9",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: 72,
    height: 72,
  },
  borderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    borderRadius: 36,
    borderWidth: 2,
    borderColor: "#E0F9BF",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontFamily: "Galmuri9",
    lineHeight: 20,
  },
});
