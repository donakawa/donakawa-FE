import { Image, StyleSheet, View } from "react-native";

import BeadBottom from "@/assets/images/buyOrNot/bead_bottom.svg";
import CleanBead from "@/assets/images/buyOrNot/clean_bead.svg";

interface WishItemFrameProps {
  imageUri: string;
  size?: number;
}

export default function WishItemFrame({
  imageUri,
  size = 58,
}: WishItemFrameProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ring,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Image
          source={{ uri: imageUri }}
          style={styles.photo}
          resizeMode="cover"
        />
        <CleanBead style={styles.sparkle} />
      </View>

      <BeadBottom style={styles.stand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  ring: {
    borderWidth: 3,
    borderColor: "#464B47",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

  photo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  sparkle: {
    position: "absolute",
    top: 10,
    right: 7,
  },

  stand: {
    position: "relative",
    marginTop: -9,
    zIndex: 1,
  },
});
