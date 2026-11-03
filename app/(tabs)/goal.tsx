import { logPageStyles as styles } from "@/styles/log/Log.style";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { useCreateGoal, useLogGoals, useUpdateGoalStatus } from "@/api/log";
import { getApiErrorMessage } from "@/api/types";
import Header from "@/components/common/Header";
import SimpleModal from "@/components/common/SimpleModal";
import GoalButton from "@/components/log/GoalButton";
import GoalCard from "@/components/log/GoalCard";
import GoalModal from "@/components/log/GoalModal";
import ReceiptCard from "@/components/log/ReceiptCard";

import FlagIcon from "@/assets/images/log/flag.svg";
import StopIcon from "@/assets/images/log/stop.svg";

const formatYearMonth = (date: string | null) => {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date.slice(0, 7).replace("-", ".");
  return `${parsed.getFullYear()}.${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

export default function LogPage() {
  const [stopModalVisible, setStopModalVisible] = useState(false);
  const [newGoalModalVisible, setNewGoalModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const [goalName, setGoalName] = useState("");
  const [amount, setAmount] = useState("");

  const { data: goals } = useLogGoals();
  const createGoal = useCreateGoal();
  const updateGoalStatus = useUpdateGoalStatus();

  const inProgress = goals?.inProgress ?? null;
  const pastGoals = goals?.past ?? [];

  // TODO: 이월 금액 출처가 명세에 없어 진행 중 목표의 모은 금액(current)으로 사용.
  // 이미 중단한 목표의 모은 금액은 past 응답에 없어 이월 불가
  const rolloverAmount = inProgress?.current ?? 0;

  const handleStopConfirm = () => {
    if (updateGoalStatus.isPending) return;
    if (!inProgress) {
      setStopModalVisible(false);
      Alert.alert("진행 중인 목표가 없습니다.");
      return;
    }
    updateGoalStatus.mutate(
      { id: inProgress.id, changeStatusTo: "STOPPED" },
      {
        onSuccess: () => setStopModalVisible(false),
        onError: (error) => {
          setStopModalVisible(false);
          Alert.alert("목표 중단 실패", getApiErrorMessage(error));
        },
      },
    );
  };

  const handleGoalSubmit = (isCarryOver: boolean) => {
    if (createGoal.isPending) return;

    const title = goalName.trim();
    const moneyGoal = Number(amount.replace(/[^0-9]/g, ""));

    if (!title) {
      Alert.alert("목표 이름을 입력해주세요.");
      return;
    }
    if (!moneyGoal) {
      Alert.alert("채울 금액을 입력해주세요.");
      return;
    }

    createGoal.mutate(
      {
        title,
        moneyGoal,
        current: isCarryOver && rolloverAmount > 0 ? rolloverAmount : undefined,
      },
      {
        onSuccess: () => {
          setGoalModalVisible(false);
          setGoalName("");
          setAmount("");
        },
        onError: (error) => Alert.alert("목표 설정 실패", getApiErrorMessage(error)),
      },
    );
  };

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
              <ReceiptCard variant="goal" goal={inProgress} />

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
                {pastGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    createdAt={formatYearMonth(goal.createdAt)}
                    title={goal.title}
                    amount={goal.moneyGoal.toLocaleString()}
                    finishedAt={formatYearMonth(goal.endedAt)}
                    isStopped={goal.status === "STOPPED"}
                  />
                ))}
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
        onConfirm={handleStopConfirm}
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
        rolloverAmount={`${rolloverAmount.toLocaleString()}원`}
        onClose={() => setGoalModalVisible(false)}
        onSubmit={handleGoalSubmit}
      />
    </View>
  );
}
