import { Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from "react-native";

interface IconPixelButtonProps {
  image?: ImageSourcePropType;
  onPress?: () => void;
}

export default function IconPixelButton({ image, onPress }: IconPixelButtonProps) {
  return (
    <TouchableOpacity style={styles.outer} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.inner}>
        {image ? (
          <Image source={image} style={styles.icon} resizeMode="contain" />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 58,
    height: 58,
    padding: 9,
    backgroundColor: "#E8F9C7",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    boxShadow:
      "inset -4px -4px 4px rgba(104, 171, 110, 0.30), inset 4px 4px 2px rgba(255, 255, 255, 0.30)",
  },
  inner: {
    width: 40,
    height: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
  placeholder: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#7EC985",
  },
});
