import { defenseCardStyles as styles } from "@/styles/log/Logcomponent.style";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

import ShieldIcon from "@/assets/images/log/shield.svg";
import UnionIcon from "@/assets/images/log/Union.svg";

export default function DefenseCard() {
  return (
    <LinearGradient
      colors={["#F0FFE5", "#FFF7E8", "#FFB6C14D", "#F0FFE5"]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 3 }}
      style={styles.card}
    >
      <ShieldIcon style={styles.shieldImage} />

      <View style={styles.badgeWrap}>
        <UnionIcon style={styles.union} />

        <View style={styles.badge}>
          <Text style={styles.badgeText}>방어한 지출</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.amount}>456,123원</Text>
        <Text style={styles.description}>
          도나와 함께 10번의 지름신을 막아냄
        </Text>
      </View>
    </LinearGradient>
  );
}
