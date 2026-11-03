import type { InProgressGoal } from "@/api/log";
import StrokeText from "@/components/log/StrokeText";
import { receiptCardStyles as styles } from "@/styles/log/Logcomponent.style";
import { Text, View } from "react-native";

interface ReceiptCardProps {
  variant?: "default" | "goal";
  goal?: InProgressGoal | null;
  since?: string;
  period?: number;
  totalSavings?: number;
}

const formatPeriod = (period?: number, since?: string) => {
  if (period && period > 0) return `+${period}개월`;
  if (!since) return "+0개월";
  const sinceTime = new Date(since).getTime();
  if (Number.isNaN(sinceTime)) return "+0개월";
  const days = Math.max(0, Math.floor((Date.now() - sinceTime) / 86400000));
  return `+${days}일`;
};

export default function ReceiptCard({
  variant = "default",
  goal = null,
  since,
  period,
  totalSavings = 0,
}: ReceiptCardProps) {
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
              strokeWidth={4}
            />
          </View>
        ) : (
          <>
            <Text style={styles.periodText}>
              도나카와랑 함께한 지{" "}
              <Text style={styles.monthText}>{formatPeriod(period, since)}</Text>
            </Text>

            <View style={styles.savedRow}>
              <StrokeText
                text={totalSavings.toLocaleString()}
                color="#7EC985"
                strokeColor="#FBFBF5"
                fontSize={22}
                strokeWidth={4}
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
                <Text style={styles.itemText}>
                  {goal ? goal.title : "진행 중인 목표 없음"}
                </Text>
                <Text style={styles.priceText}>
                  {(goal?.moneyGoal ?? 0).toLocaleString()}
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.itemText}>아낀 예산</Text>
                <Text style={styles.percentText}>{goal?.percent ?? 0}%</Text>
                <Text style={styles.minusText}>
                  -{(goal?.current ?? 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.underDot}>
              <View style={styles.dotLine} />
              <View style={styles.todayRow}>
                <Text style={styles.todayLabel}>모을 금액</Text>
                <Text style={styles.todayPrice}>
                  {(goal?.needed ?? 0).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
