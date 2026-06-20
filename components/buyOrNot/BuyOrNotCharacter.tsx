import { StyleSheet, View } from "react-native";

import BonMainDona from "@/assets/images/buyOrNot/bon_main_dona.svg";

import WishItemFrame from "./WishItemFrame";

interface BuyOrNotCharacterProps {
  itemPosition?: "center" | "right" | "none";
  itemImageUri?: string;
}

export default function BuyOrNotCharacter({
  itemPosition = "right",
  itemImageUri,
}: BuyOrNotCharacterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.circle} />

      <BonMainDona style={styles.hamster} />

      {itemPosition !== "none" && itemImageUri && (
        <View
          style={[
            styles.item,
            itemPosition === "center" ? styles.itemCenter : styles.itemRight,
          ]}
        >
          <WishItemFrame imageUri={itemImageUri} size={70} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 220,
    marginBottom: -24,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },

  circle: {
    position: "absolute",
    bottom: 0,
    width: 209,
    height: 209,
    borderRadius: 100,
    backgroundColor: "#F0FFE5",
  },

  hamster: {
    position: "relative",
    zIndex: 2,
  },

  item: {
    position: "absolute",
    width: 58,
    zIndex: 3,
  },

  itemCenter: {
    bottom: 26,
    left: "50%",
    marginLeft: -29,
  },

  itemRight: {
    right: 15,
    bottom: 26,
  },
});
