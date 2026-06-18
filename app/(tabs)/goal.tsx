import { logPageStyles as styles } from "@/styles/log/Log.style";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import Header from "@/components/common/Header";
import SimpleModal from "@/components/common/SimpleModal";
import GoalButton from "@/components/log/GoalButton";
import GoalCard from "@/components/log/GoalCard";
import GoalModal from "@/components/log/GoalModal";
import ReceiptCard from "@/components/log/ReceiptCard";

import FlagIcon from "@/assets/images/log/flag.svg";
import StopIcon from "@/assets/images/log/stop.svg";

export default function LogPage() {
  const [stopModalVisible, setStopModalVisible] = useState(false);
  const [newGoalModalVisible, setNewGoalModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const [goalName, setGoalName] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header title="Log" onBackPress={() => router.navigate("/log")} />

        <View style={styles.cardContainer}>
          <View style={styles.cardList}>
            <View>
              <ReceiptCard variant="goal" />

              <View style={{ flexDirection: "row", gap: 9 }}>
                <GoalButton
                  title="목표 중단"
                  icon={<StopIcon />}
                  onPress={() => setStopModalVisible(true)}
                />

                <GoalButton
                  title="새 목표 설정"
                  icon={<FlagIcon />}
                  onPress={() => setNewGoalModalVisible(true)}
                />
              </View>
            </View>

            <View style={{ width: 335, gap: 12 }}>
              <Text
                style={{
                  color: "#5F6460",
                  fontFamily: "WantedSansMedium",
                  fontSize: 12,
                }}
              >
                지난 목표
              </Text>

              <View style={{ gap: 8 }}>
                <GoalCard
                  createdAt="2026.02"
                  title="사브리나 카펜터 향수"
                  amount="44,000"
                  finishedAt="2026.03"
                />

                <GoalCard
                  createdAt="2026.01"
                  title="주식 구매"
                  amount="88,000"
                  finishedAt="2026.02"
                />

                <GoalCard
                  createdAt="2025.12"
                  title="순금 한 돈"
                  amount="990,000"
                  finishedAt="2026.01"
                  isStopped
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <SimpleModal
        visible={stopModalVisible}
        title="목표를 중단하시겠습니까?"
        description="해당 작업은 되돌릴 수 없습니다."
        onCancel={() => setStopModalVisible(false)}
        onConfirm={() => setStopModalVisible(false)}
      />

      <SimpleModal
        visible={newGoalModalVisible}
        title="새 목표를 설정하시겠습니까?"
        description="중단한 목표의 금액을 이월할 수 있습니다."
        onCancel={() => setNewGoalModalVisible(false)}
        onConfirm={() => {
          setNewGoalModalVisible(false);
          setGoalModalVisible(true);
        }}
      />

      <GoalModal
        visible={goalModalVisible}
        goalName={goalName}
        amount={amount}
        onChangeGoalName={setGoalName}
        onChangeAmount={setAmount}
        onClose={() => setGoalModalVisible(false)}
        onSubmit={() => setGoalModalVisible(false)}
      />
    </View>
  );
}
