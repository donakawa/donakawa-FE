import { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import EmptyCircleIcon from "@/assets/images/log/check_done.svg";
import CheckedCircleIcon from "@/assets/images/log/check_none.svg";
import { goalModalStyles as styles } from "@/styles/log/Goalcomponent.style";

type GoalModalProps = {
  visible: boolean;
  goalName: string;
  amount: string;
  rolloverAmount?: string;
  onChangeGoalName: (text: string) => void;
  onChangeAmount: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function GoalModal({
  visible,
  goalName,
  amount,
  rolloverAmount = "171,900원",
  onChangeGoalName,
  onChangeAmount,
  onClose,
  onSubmit,
}: GoalModalProps) {
  const [isCarryOver, setIsCarryOver] = useState(true);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.headerText}>이전</Text>
            </Pressable>

            <Pressable onPress={onSubmit}>
              <Text style={styles.doneText}>완료</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <View style={styles.goalcontent}>
                <Text style={styles.label}>목표 이름</Text>

                <TextInput
                  value={goalName}
                  onChangeText={onChangeGoalName}
                  style={styles.input}
                  maxLength={12}
                  placeholder="목표 이름"
                  placeholderTextColor="#2D322E"
                />

                <Text style={styles.count}>{goalName.length}/12</Text>
              </View>

              <View style={styles.goalcontent}>
                <Text style={styles.label}>채울 금액</Text>

                <TextInput
                  value={amount}
                  onChangeText={onChangeAmount}
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="금액 입력"
                  placeholderTextColor="#2D322E"
                />
              </View>
            </View>

            <View style={styles.carryOverBox}>
              <Text style={styles.label}>목표 금액 이월 여부</Text>

              <Pressable
                style={styles.radioRow}
                onPress={() => setIsCarryOver((prev) => !prev)}
              >
                {isCarryOver ? <CheckedCircleIcon /> : <EmptyCircleIcon />}
                <Text style={styles.rolloverText}>{rolloverAmount}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
