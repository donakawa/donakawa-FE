import { Text, View } from "react-native";

import { valueCardStyles as styles } from "@/styles/log/Logcomponent.style";

interface ValueRowProps {
  label: string;
  value: number;
}

function ValueRow({ label, value }: ValueRowProps) {
  const filledCount = Math.round(value / 10);

  return (
    <View style={styles.valueRow}>
      <Text style={styles.valueLabel}>{label}</Text>

      <View style={styles.valueContent}>
        <View style={styles.blockWrap}>
          {Array.from({ length: 10 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.valueBlock,
                index < filledCount && styles.valueBlockActive,
              ]}
            />
          ))}
        </View>

        <Text style={styles.valuePercent}>{value}%</Text>
      </View>
    </View>
  );
}

export default function ValueCard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>위시템으로 담은 상품 중...</Text>

      <View style={styles.card}>
        <ValueRow label="구매전환" value={60} />
        <ValueRow label="포기전환" value={30} />
      </View>
    </View>
  );
}
