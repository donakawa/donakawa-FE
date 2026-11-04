import { useLogin } from "@/api/auth";
import { useSocialLogin, type SocialProvider } from "@/api/socialAuth";
import { getApiErrorMessage } from "@/api/types";
import DnkwLogo from "@/assets/images/auth/dnkw-logo.svg";
import GoogleIcon from "@/assets/images/auth/google.svg";
import KakaoIcon from "@/assets/images/auth/kakao.svg";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import { loginStyles as styles } from "@/styles/auth/Auth.style";
import { authButtonStyles as buttonStyles } from "@/styles/auth/Authcomponent.style";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const socialLogin = useSocialLogin();

  // Android는 Custom Tab을 미리 준비해 소셜 로그인 브라우저가 뜨는 시간을 줄임
  useEffect(() => {
    if (Platform.OS !== "android") return;

    WebBrowser.warmUpAsync().catch(() => {});
    return () => {
      WebBrowser.coolDownAsync().catch(() => {});
    };
  }, []);

  const canSubmit = email.trim().length > 0 && password.length > 0 && !login.isPending;

  const handleSocialLogin = (provider: SocialProvider) => {
    socialLogin.mutate(provider, {
      onSuccess: (result) => {
        if (result) router.replace(result.isNewUser ? "/socialGoal" : "/(tabs)");
      },
      onError: (error) =>
        Alert.alert(
          "로그인 실패",
          getApiErrorMessage(error, error instanceof Error ? error.message : undefined),
        ),
    });
  };

  const handleLogin = () => {
    login.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => router.replace("/(tabs)"),
        onError: (error) => Alert.alert("로그인 실패", getApiErrorMessage(error)),
      },
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <DnkwLogo width={150} height={56} />
      </View>

      <View style={styles.form}>
        <View style={styles.inputs}>
          <AuthInput
            placeholder="donakawa@dona.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AuthInput
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.findButton}>
          <Text style={styles.findText}>아이디/비밀번호 찾기</Text>
        </View>

        <AuthButton
          title="로그인"
          variant={canSubmit ? "primary" : "disabled"}
          onPress={canSubmit ? handleLogin : undefined}
        />

        <View style={styles.socialSection}>
          <View style={styles.dividerWrap}>
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
            </View>
            <Text style={styles.dividerText}>다른 방법으로 인증</Text>
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[buttonStyles.button, buttonStyles.google]}
              onPress={() => handleSocialLogin("google")}
              disabled={socialLogin.isPending}
            >
              <GoogleIcon width={20} height={20} style={buttonStyles.socialIcon} />

              <Text style={buttonStyles.googleText}>
                Google 계정으로 로그인
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.button, buttonStyles.kakao]}
              onPress={() => handleSocialLogin("kakao")}
              disabled={socialLogin.isPending}
            >
              <KakaoIcon width={20} height={20} style={buttonStyles.socialIcon} />

              <Text style={buttonStyles.kakaoText}>카카오 로그인</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push("/signup")}
          >
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
