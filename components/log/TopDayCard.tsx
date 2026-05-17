import { topdayCardStyles as styles } from "@/styles/log/Logcomponent.style";
import { Text, View } from "react-native";

import CartIcon from "@/assets/images/log/cart.svg";
import PayIcon from "@/assets/images/log/pay.svg";
import TrashIcon from "@/assets/images/log/trash.svg";

interface DayStrokeTextProps {
  text: string;
  strokeColor: string;
}

const shadowPositions = [
  [-2, 0],
  [2, 0],
  [0, -2],
  [0, 2],
  [-2, -2],
  [2, -2],
  [-2, 2],
  [2, 2],
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

function DayStrokeText({ text, strokeColor }: DayStrokeTextProps) {
  return (
    <View style={styles.strokeTextWrap}>
      {shadowPositions.map(([x, y], index) => (
        <Text
          key={index}
          style={[
            styles.strokeText,
            {
              color: strokeColor,
              transform: [{ translateX: x }, { translateY: y }],
            },
          ]}
        >
          {text}
        </Text>
      ))}

      <Text style={[styles.strokeText, styles.strokeTextFront]}>{text}</Text>
    </View>
  );
}

export default function TopDayCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>프리더햄톨 님의 최다 요일은?</Text>

      <View style={styles.topdayBox}>
        <View style={styles.dayItem}>
          <View style={styles.iconWrap}>
            <CartIcon width={36} height={40} />
            <View style={styles.dayText}>
              <DayStrokeText text="FRI." strokeColor="#E37E7E" />
            </View>
          </View>

          <Text style={styles.dayLabel}>위시</Text>
        </View>

        <View style={styles.dayItem}>
          <View style={styles.iconWrap}>
            <PayIcon width={42} height={34} />
            <View style={styles.dayText}>
              <DayStrokeText text="SUN." strokeColor="#E67972" />
            </View>
          </View>

          <Text style={styles.dayLabel}>구매</Text>
        </View>

        <View style={styles.dayItem}>
          <View style={styles.iconWrap}>
            <TrashIcon width={39} height={39} />
            <View style={styles.dayText}>
              <DayStrokeText text="TUE." strokeColor="#E67972" />
            </View>
          </View>

          <Text style={styles.dayLabel}>포기</Text>
        </View>
      </View>
    </View>
  );
}
