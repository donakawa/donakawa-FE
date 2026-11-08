import { useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  type TextInputProps,
  TouchableWithoutFeedback,
  View,
} from "react-native";

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
  onSubmit: (isCarryOver: boolean) => void;
};

// iOS는 Galmuri9 placeholder를 입력 글자보다 아래에 그려서, placeholder를 직접 겹쳐 그림
function GoalInput({ value, placeholder, ...props }: TextInputProps) {
  return (
    <View>
      <TextInput
        {...props}
        value={value}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="transparent"
      />
      {!value && (
        <View style={styles.placeholderWrap}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      )}
    </View>
  );
}

export default function GoalModal({
  visible,
  goalName,
  amount,
  rolloverAmount = "0원",
  onChangeGoalName,
  onChangeAmount,
  onClose,
  onSubmit,
}: GoalModalProps) {
  const [isCarryOver, setIsCarryOver] = useState(true);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Pressable onPress={onClose}>
                <Text style={styles.headerText}>이전</Text>
              </Pressable>

              <Pressable onPress={() => onSubmit(isCarryOver)}>
                <Text style={styles.doneText}>완료</Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <View style={styles.goalcontent}>
                  <Text style={styles.label}>목표 이름</Text>

                  <GoalInput
                    value={goalName}
                    onChangeText={onChangeGoalName}
                    maxLength={12}
                    placeholder="목표 이름"
                  />

                  <Text style={styles.count}>{goalName.length}/12</Text>
                </View>

                <View style={styles.goalcontent}>
                  <Text style={styles.label}>채울 금액</Text>

                  <GoalInput
                    value={amount}
                    onChangeText={onChangeAmount}
                    keyboardType="numeric"
                    placeholder="금액 입력"
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
      </TouchableWithoutFeedback>
    </Modal>
  );
}
