import { Text, View } from "react-native";

import { goalCardStyles as styles } from "@/styles/log/Goalcomponent.style";

interface GoalCardProps {
  createdAt: string;
  title: string;
  amount: string;
  finishedAt: string;
  isStopped?: boolean;
}

export default function GoalCard({
  createdAt,
  title,
  amount,
  finishedAt,
  isStopped = false,
}: GoalCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.createdAt}>{createdAt} 설정</Text>

        <View style={styles.bottomSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>{amount}원</Text>
        </View>
      </View>

      <View style={[styles.statusCircle, isStopped && styles.stoppedCircle]}>
        <Text style={[styles.finishedAt, isStopped && styles.stoppedText]}>
          {finishedAt}
        </Text>

        <Text style={[styles.statusText, isStopped && styles.stoppedText]}>
          {isStopped ? "중단" : "달성"}
        </Text>
      </View>
    </View>
  );
}
