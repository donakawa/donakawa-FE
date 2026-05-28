import { router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import SimpleModal from "@/components/common/SimpleModal";

import { withdrawalStyles as styles } from "@/styles/mypage/SubPage.style";

import ArrowIcon from "@/assets/images/log/arrow_left.svg";
import GoogleIcon from "@/assets/images/mypage/google.svg";
import ShieldIcon from "@/assets/images/mypage/security.svg";
import EyeIcon from "@/assets/images/mypage/visibility-eye.svg";
import EyeOffIcon from "@/assets/images/mypage/visibility-off-eye.svg";

type LoginType = "local" | "social";

export default function WithdrawalPage() {
  const loginType: LoginType = "local";

  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const isLocal = loginType === "local";
  const isValid = isLocal ? password.length >= 1 : true;

  const handleConfirm = () => {
    if (!isValid) return;

    setModalVisible(true);
  };

  const handleWithdrawal = () => {
    setModalVisible(false);

    // 회원 탈퇴 API 연동해야됨
    router.replace("/settings");
  };

  const handleGoogleAuth = () => {
    // 구글 재인증 연동해야됨
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <ArrowIcon />
            </Pressable>

            <Text style={styles.title}>회원 탈퇴</Text>
          </View>

          <View style={styles.innerContent}>
            <View style={styles.noticeBox}>
              <ShieldIcon />
              <Text style={styles.noticeText}>
                개인정보를 안전하게 보호하기 위해{"\n"}
                인증 절차가 필요합니다.
              </Text>
            </View>

            <View style={styles.innerBottomContent}>
              <View style={styles.form}>
                <Text style={styles.label}>
                  {isLocal
                    ? "비밀번호를 입력해주세요."
                    : "로그인 계정으로 재인증해 주세요."}
                </Text>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    value={
                      isLocal ? "donakawa@dona.com" : "donakawa123@naver.com"
                    }
                    editable={false}
                    placeholderTextColor="#C3C8C4"
                  />
                  {isLocal ? (
                    <View style={styles.passwordInputWrap}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호를 입력하세요."
                        placeholderTextColor="#C3C8C4"
                        secureTextEntry={secure}
                        value={password}
                        onChangeText={setPassword}
                        textContentType="oneTimeCode"
                        autoComplete="off"
                      />

                      {password.length > 0 && (
                        <Pressable
                          style={styles.eyeButton}
                          onPress={() => setSecure((prev) => !prev)}
                        >
                          {secure ? <EyeOffIcon /> : <EyeIcon />}
                        </Pressable>
                      )}
                    </View>
                  ) : (
                    <View style={styles.passwordInputWrap}>
                      <TextInput
                        style={styles.passwordInput}
                        placeholder="비밀번호를 입력하세요."
                        placeholderTextColor="#C3C8C4"
                        secureTextEntry={secure}
                        value={password}
                        onChangeText={setPassword}
                        textContentType="oneTimeCode"
                        autoComplete="off"
                      />
                      {password.length > 0 && (
                        <Pressable
                          style={styles.eyeButton}
                          onPress={() => setSecure((prev) => !prev)}
                        >
                          {secure ? <EyeOffIcon /> : <EyeIcon />}
                        </Pressable>
                      )}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.authArea}>
                <Pressable
                  style={[
                    styles.confirmButton,
                    isValid && styles.confirmButtonActive,
                  ]}
                  onPress={handleConfirm}
                  disabled={!isValid}
                >
                  <Text
                    style={[
                      styles.confirmText,
                      isValid && styles.confirmTextActive,
                    ]}
                  >
                    확인
                  </Text>
                </Pressable>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>다른 방법으로 인증</Text>
                  <View style={styles.dividerLine} />
                </View>
                <Pressable
                  style={styles.googleButton}
                  onPress={handleGoogleAuth}
                >
                  <GoogleIcon />
                  <Text style={styles.googleText}>Google 계정으로 인증</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <SimpleModal
          visible={modalVisible}
          title="정말 탈퇴하시겠습니까?"
          description={
            "회원탈퇴 시 계정의 모든 정보가 삭제되며,\n복구할 수 없습니다."
          }
          danger
          onCancel={() => setModalVisible(false)}
          onConfirm={handleWithdrawal}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
