import StrokeText from "@/components/log/StrokeText";
import {
  StyleSheet,
  type StyleProp,
  Text,
  type TextStyle,
  View,
} from "react-native";

const DOT_COUNT = 3;

interface WishFlowTitleBannerProps {
  title: string;
  subtitle?: string;
  topRadius?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
  bangStyle?: StyleProp<TextStyle>;
  subtitleColor?: string;
  subtitleStrokeColor?: string;
  subtitleStrokeWidth?: number;
}

export default function WishFlowTitleBanner({
  title,
  subtitle,
  topRadius = false,
  titleStyle,
  subtitleStyle,
  bangStyle,
  subtitleColor = "#E67972",
  subtitleStrokeColor = "#FFDBEB",
  subtitleStrokeWidth = 1,
}: WishFlowTitleBannerProps) {
  const titleChip = (
    <View style={styles.titleChip}>
      <View style={styles.titleChipRow}>
        <Text style={[styles.bangText, bangStyle]}>!!</Text>
        <Text style={[styles.titleText, titleStyle]}>{title}</Text>
        <Text style={[styles.bangText, bangStyle]}>!!</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.banner, topRadius && styles.bannerTopRadius]}>
      <View style={styles.bannerRow}>
        <View style={styles.dotsGroup}>
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <View key={`dot-l-${i}`} style={styles.dot} />
          ))}
        </View>

        {subtitle ? (
          <View style={styles.titleColumn}>
            <StrokeText
              text={subtitle}
              color={subtitleColor}
              strokeColor={subtitleStrokeColor}
              fontSize={14}
              strokeWidth={subtitleStrokeWidth}
              lineHeight={21}
              align="center"
              fontFamily="Galmuri9"
            />
            {titleChip}
          </View>
        ) : (
          titleChip
        )}

        <View style={styles.dotsGroup}>
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <View key={`dot-r-${i}`} style={styles.dot} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: 100,
    backgroundColor: "#E0F9BF",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  bannerTopRadius: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dotsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  dot: {
    width: 7,
    height: 7,
    backgroundColor: "#FFDBEB",
  },
  titleColumn: {
    width: 174,
    alignItems: "center",
    gap: 1,
  },
  subtitle: {
    color: "#E67972",
    fontSize: 14,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    lineHeight: 21,
    textAlign: "center",
    textShadowColor: "#E67972",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
  titleChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#FBFBF5",
    borderRadius: 2,
    borderWidth: 3,
    borderColor: "#FFDBEB",
    alignItems: "center",
    justifyContent: "center",
  },
  titleChipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bangText: {
    color: "#E67972",
    fontSize: 26,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "#E67972",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
  titleText: {
    color: "#7A5751",
    fontSize: 26,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    textAlign: "center",
    textShadowColor: "#7A5751",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
});
