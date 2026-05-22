import StrokeText from "@/components/log/StrokeText";
import { receiptCardStyles as styles } from "@/styles/log/Logcomponent.style";
import { Text, View } from "react-native";

interface ReceiptCardProps {
  variant?: "default" | "goal";
}

export default function ReceiptCard({ variant = "default" }: ReceiptCardProps) {
  const isGoal = variant === "goal";

  return (
    <View style={styles.container}>
      <View style={[styles.summaryCard, isGoal && styles.goalSummaryCard]}>
        {isGoal ? (
          <View style={{ paddingLeft: 7, paddingTop: 11 }}>
            <StrokeText
              text="현재 목표"
              color="#7EC985"
              strokeColor="#FBFBF5"
              fontSize={22}
              strokeWidth={2}
            />
          </View>
        ) : (
          <>
            <Text style={styles.periodText}>
              도나카와랑 함께한 지 <Text style={styles.monthText}>+2개월</Text>
            </Text>

            <View style={styles.savedRow}>
              <StrokeText
                text="325,500"
                color="#7EC985"
                strokeColor="#FBFBF5"
                fontSize={22}
                strokeWidth={2}
              />
              <Text style={styles.savedText}>원을 절약했어요!</Text>
            </View>
          </>
        )}

        <View style={styles.receipt}>
          <View style={styles.receiptBar} />

          <View style={styles.receiptBox}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>항목</Text>
              <Text style={styles.headerCenter}>달성비율</Text>
              <Text style={styles.headerRight}>금액</Text>
            </View>

            <View style={styles.itemList}>
              <View style={styles.tableRow}>
                <Text style={styles.itemText}>Okashii LP 중고</Text>
                <Text style={styles.priceText}>195,500</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.itemText}>아낀 예산</Text>
                <Text style={styles.percentText}>88%</Text>
                <Text style={styles.minusText}>-171,900</Text>
              </View>
            </View>

            <View style={styles.underDot}>
              <View style={styles.dotLine} />
              <View style={styles.todayRow}>
                <Text style={styles.todayLabel}>모을 금액</Text>
                <Text style={styles.todayPrice}>23,600</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
