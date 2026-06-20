import StrokeText from "@/components/log/StrokeText";
import { topdayCardStyles as styles } from "@/styles/log/Logcomponent.style";
import { Text, View } from "react-native";

import CartIcon from "@/assets/images/log/cart.svg";
import PayIcon from "@/assets/images/log/pay.svg";
import TrashIcon from "@/assets/images/log/trash.svg";

export default function TopDayCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>프리더햄톨 님의 최다 요일은?</Text>

      <View style={styles.topdayBox}>
        <View style={styles.dayItem}>
          <View style={styles.iconWrap}>
            <CartIcon width={36} height={40} />

            <View style={styles.dayText}>
              <StrokeText
                text="FRI."
                color="#FFFFFF"
                strokeColor="#E37E7E"
                fontSize={16}
                strokeWidth={5}
              />
            </View>
          </View>

          <Text style={styles.dayLabel}>위시</Text>
        </View>

        <View style={styles.dayItem}>
          <View style={styles.iconWrap}>
            <PayIcon width={42} height={34} />

            <View style={styles.dayText}>
              <StrokeText
                text="SUN."
                color="#FFFFFF"
                strokeColor="#E67972"
                fontSize={16}
                strokeWidth={5}
              />
            </View>
          </View>

          <Text style={styles.dayLabel}>구매</Text>
        </View>

        <View style={styles.dayItem}>
          <View style={styles.iconWrap}>
            <TrashIcon width={39} height={39} />

            <View style={styles.dayText}>
              <StrokeText
                text="TUE."
                color="#FFFFFF"
                strokeColor="#E67972"
                fontSize={16}
                strokeWidth={5}
              />
            </View>
          </View>

          <Text style={styles.dayLabel}>포기</Text>
        </View>
      </View>
    </View>
  );
}
