import { useUpdateGoal } from "@/api/auth";
import { getApiErrorMessage } from "@/api/types";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import { signupStyles as styles } from "@/styles/auth/Auth.style";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const MAX_GOAL_LENGTH = 10;

// 소셜 로그인 신규 가입 직후 목표 설정. 목표는 선택 사항이라 건너뛸 수 있음
export default function SocialGoal() {
  const [goal, setGoal] = useState("");
  const updateGoal = useUpdateGoal();

  const trimmedGoal = goal.trim();
  const goHome = () => router.replace("/(tabs)");

  const handleSubmit = () => {
    updateGoal.mutate(trimmedGoal, {
      onSuccess: goHome,
      onError: (error) => Alert.alert("목표 저장 실패", getApiErrorMessage(error)),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.inner}>
          <Text style={styles.title}>목표를 입력해 주세요.</Text>

          <AuthInput
            placeholder="10자 이내로 입력해 주세요."
            value={goal}
            onChangeText={(text) => setGoal(text.slice(0, MAX_GOAL_LENGTH))}
          />

          <View style={styles.buttonSpace}>
            <AuthButton
              title={trimmedGoal ? "확인" : "건너뛰기"}
              onPress={trimmedGoal ? handleSubmit : goHome}
              variant={updateGoal.isPending ? "disabled" : "primary"}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
