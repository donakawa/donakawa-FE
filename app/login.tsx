import DnkwLogo from "@/assets/images/auth/dnkw-logo.svg";
import GoogleIcon from "@/assets/images/auth/google.svg";
import KakaoIcon from "@/assets/images/auth/kakao.svg";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import { loginStyles as styles } from "@/styles/auth/Auth.style";
import { authButtonStyles as buttonStyles } from "@/styles/auth/Authcomponent.style";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <DnkwLogo width={150} height={56} />
      </View>

      <View style={styles.form}>
        <AuthInput
          placeholder="donakawa@dona.com"
          value={email}
          onChangeText={setEmail}
        />

        <AuthInput
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.findText}>아이디/비밀번호 찾기</Text>

        <AuthButton
          title="로그인"
          onPress={() => router.replace("/(tabs)")}
        />

        <View style={styles.socialSection}>
          <View style={styles.dividerWrap}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>다른 방법으로 인증</Text>
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[buttonStyles.button, buttonStyles.google]}>
              <GoogleIcon
                width={24}
                height={24}
                style={{
                  position: "absolute",
                  left: 20,
                }}
              />

              <Text style={buttonStyles.socialText}>
                Google 계정으로 로그인
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[buttonStyles.button, buttonStyles.kakao]}>
                <KakaoIcon
                width={24}
                height={24}
                style={{
                  position: "absolute",
                  left: 20,
                }}
              />

              <Text style={buttonStyles.socialText}>카카오 로그인</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={styles.signupLink}
            onPress={() => router.push("/signup")}
          >
            회원가입
          </Text>
        </View>
      </View>
    </View>
  );
}
