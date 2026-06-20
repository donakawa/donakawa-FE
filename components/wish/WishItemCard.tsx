import InsetShadow from "@/components/common/InsetShadow";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type WishItemImageSource = ImageSourcePropType | string;

interface WishItemCardProps {
  name: string;
  price: number;
  image?: WishItemImageSource;
  onSale?: boolean;
  onPress?: () => void;
  selectable?: boolean;
  selected?: boolean;
}

const toImageSource = (source: WishItemImageSource): ImageSourcePropType =>
  typeof source === "string" ? { uri: source } : source;

export default function WishItemCard({
  name,
  price,
  image,
  onSale,
  onPress,
  selectable,
  selected,
}: WishItemCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageBox}>
        {image ? (
          <Image source={toImageSource(image)} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.placeholder]} />
        )}
        {selectable && (
          <View pointerEvents="none" style={styles.selectionWrap}>
            <InsetShadow
              style={[styles.selectionCircle, selected && styles.selectionCircleSelected]}
              shadowColor="#BFD8B8"
              shadowOffset={{ width: -2, height: 2 }}
              shadowBlur={2}
              isReflectedLightEnabled={false}
            >
              {selected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </InsetShadow>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.price, onSale && styles.priceOnSale]}>
          {price.toLocaleString()}원
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
  },
  imageBox: {
    height: 164,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0F9BF",
    backgroundColor: "#FAFFF9",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    backgroundColor: "#F0F5F1",
  },
  info: {
    gap: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D322E",
    lineHeight: 24,
  },
  priceOnSale: {
    color: "#E4463C",
  },
  name: {
    fontSize: 14,
    fontWeight: "400",
    color: "#787D79",
    lineHeight: 21,
  },
  selectionWrap: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  selectionCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "#F0FFE5",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionCircleSelected: {
    backgroundColor: "#7EC985",
    borderColor: "#5FA567",
  },
});
