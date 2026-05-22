import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { changePasswordStyles as styles } from "@/styles/mypage/SubPage.style";

import ArrowIcon from "@/assets/images/log/arrow_left.svg";
import PasswordSuccessIcon from "@/assets/images/mypage/shield-lock.svg";
import EyeIcon from "@/assets/images/mypage/visibility-eye.svg";
import EyeOffIcon from "@/assets/images/mypage/visibility-off-eye.svg";

type Step = 1 | 2 | 3;

export default function ChangePasswordPage() {
  const [step, setStep] = useState<Step>(1);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secure, setSecure] = useState(true);

  const isCurrentPasswordValid = currentPassword.length >= 8;
  const isNewPasswordValid = newPassword.length >= 8;
  const isConfirmVisible = isNewPasswordValid;

  const isConfirmPasswordValid =
    confirmPassword.length >= 8 && newPassword === confirmPassword;

  const isValid =
    step === 1
      ? isCurrentPasswordValid
      : step === 2
        ? isConfirmPasswordValid
        : true;

  const handleSubmit = () => {
    if (!isValid) return;

    if (step === 1) {
      setStep(2);
      setSecure(true);
      return;
    }

    if (step === 2) {
      setStep(3);
      setSecure(true);
      return;
    }

    router.replace("/settings");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ArrowIcon />
        </Pressable>

        <Text style={styles.title}>비밀번호 변경</Text>
      </View>

      <View style={styles.content}>
        {step !== 3 ? (
          <View style={styles.formArea}>
            <View style={styles.form}>
              <Text style={styles.label}>
                {step === 1
                  ? "현재 비밀번호를 입력해주세요."
                  : "비밀번호를 설정해 주세요."}
              </Text>

              {step === 1 && (
                <View style={styles.inputBox}>
                  <View style={styles.passwordInputWrap}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="비밀번호 입력"
                      placeholderTextColor="#CDD2CE"
                      secureTextEntry={secure}
                      textContentType="oneTimeCode"
                      autoComplete="off"
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                    />

                    {currentPassword.length > 0 && (
                      <Pressable
                        style={styles.eyeButton}
                        onPress={() => setSecure((prev) => !prev)}
                      >
                        {secure ? <EyeOffIcon /> : <EyeIcon />}
                      </Pressable>
                    )}
                  </View>

                  <Text style={styles.helper}>영문과 숫자 조합, 8~12자리</Text>
                </View>
              )}

              {step === 2 && (
                <View style={styles.inputGroup}>
                  <View style={styles.inputBox}>
                    <View style={styles.passwordInputWrap}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호 입력"
                        placeholderTextColor="#CDD2CE"
                        secureTextEntry={secure}
                        textContentType="oneTimeCode"
                        autoComplete="off"
                        value={newPassword}
                        onChangeText={setNewPassword}
                      />

                      {newPassword.length > 0 && (
                        <Pressable
                          style={styles.eyeButton}
                          onPress={() => setSecure((prev) => !prev)}
                        >
                          {secure ? <EyeOffIcon /> : <EyeIcon />}
                        </Pressable>
                      )}
                    </View>

                    <Text style={styles.helper}>
                      영문과 숫자 조합, 8~12자리
                    </Text>
                  </View>

                  {isConfirmVisible && (
                    <View style={styles.inputBox}>
                      <View style={styles.passwordInputWrap}>
                        <TextInput
                          style={styles.passwordInput}
                          placeholder="비밀번호 확인"
                          placeholderTextColor="#C3C8C4"
                          secureTextEntry={secure}
                          textContentType="oneTimeCode"
                          autoComplete="off"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                        />

                        {confirmPassword.length > 0 && (
                          <Pressable
                            style={styles.eyeButton}
                            onPress={() => setSecure((prev) => !prev)}
                          >
                            {secure ? <EyeOffIcon /> : <EyeIcon />}
                          </Pressable>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.successArea}>
            <View style={styles.successContent}>
              <Text style={styles.successText}>
                비밀번호 변경이{"\n"}
                완료되었습니다.
              </Text>

              <PasswordSuccessIcon />
            </View>
          </View>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={20}
        >
          <View style={styles.buttonArea}>
            <Pressable
              style={[
                styles.submitButton,
                isValid && styles.submitButtonActive,
              ]}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text
                style={[styles.submitText, isValid && styles.submitTextActive]}
              >
                {step === 3 ? "로그인 화면으로 돌아가기" : "완료"}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
