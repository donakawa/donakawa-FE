import {
  authApi,
  useLogin,
  useRegister,
  useSendEmailCode,
  useVerifyEmailCode,
} from "@/api/auth";
import { getApiError, getApiErrorMessage } from "@/api/types";
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import Header from "@/components/common/Header";
import { signupStyles as styles } from "@/styles/auth/Auth.style";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const EMPTY_CODE = ["", "", "", "", "", ""];

export default function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(EMPTY_CODE);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const VERIFY_TIME = 4 * 60 + 59;
  const RESEND_TIME = 4 * 60 + 59;
  const [verifySeconds, setVerifySeconds] = useState(VERIFY_TIME);
  const [resendSeconds, setResendSeconds] = useState(RESEND_TIME);
  const isPasswordValid =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/.test(password);
  
  const isPasswordCheckVisible = password.length > 0 && isPasswordValid;
  
  const isPasswordMatched = passwordCheck.length > 0 && password === passwordCheck;
  const [nickname, setNickname] = useState("");
  const [nicknameStatus, setNicknameStatus] = useState<'idle' | 'available' | 'duplicate'>('idle');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);

  const sendEmailCode = useSendEmailCode();
  const verifyEmailCode = useVerifyEmailCode();
  const register = useRegister();
  const login = useLogin();
  const isSubmitting = register.isPending || login.isPending;

  const codeRefs = useRef<Array<TextInput | null>>([]);

  const progressWidth = step === 1 || step === 2 ? "33%" : step === 3 ? "66%" : "100%";

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (step !== 2) return;
    const timer = setInterval(() => {
      setVerifySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setResendSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [step]);
  const resetCodeInput = () => {
    setCode(EMPTY_CODE);
    setCodeError(null);
    setVerifySeconds(VERIFY_TIME);
    setResendSeconds(RESEND_TIME);
  };

  const handleSendCode = () => {
    setEmailError(null);
    sendEmailCode.mutate(
      { email: email.trim(), type: "REGISTER" },
      {
        onSuccess: () => {
          resetCodeInput();
          setStep(2);
        },
        onError: (error) => setEmailError(getApiErrorMessage(error)),
      },
    );
  };

  const handleResendCode = () => {
    sendEmailCode.mutate(
      { email: email.trim(), type: "REGISTER" },
      {
        onSuccess: () => {
          resetCodeInput();
          codeRefs.current[0]?.focus();
        },
        onError: (error) => setCodeError(getApiErrorMessage(error)),
      },
    );
  };

  const handleVerifyCode = () => {
    setCodeError(null);
    verifyEmailCode.mutate(
      { email: email.trim(), code: code.join(""), type: "REGISTER" },
      {
        onSuccess: () => setIsVerifyModalOpen(true),
        onError: (error) => setCodeError(getApiErrorMessage(error)),
      },
    );
  };

  const handleCheckNickname = async () => {
    if (nickname.length === 0 || isCheckingNickname) return;
    setIsCheckingNickname(true);
    try {
      const isAvailable = await authApi.checkNicknameAvailable(nickname);
      setNicknameStatus(isAvailable ? "available" : "duplicate");
    } catch (error) {
      Alert.alert("닉네임 확인 실패", getApiErrorMessage(error));
    } finally {
      setIsCheckingNickname(false);
    }
  };

  const handleRegister = async () => {
    const credentials = { email: email.trim(), password };
    try {
      await register.mutateAsync({ ...credentials, nickname });
      await login.mutateAsync(credentials);
      setStep(5);
    } catch (error) {
      if (getApiError(error)?.code === "U009") {
        setNicknameStatus("duplicate");
        return;
      }
      Alert.alert("회원가입 실패", getApiErrorMessage(error));
    }
  };

  const handleCodeChange = (text: string, index: number) => {
    const value = text.slice(-1);

    const next = [...code];
    next[index] = value;
    setCode(next);

    if (value && index < code.length - 1) {
      codeRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();

      const next = [...code];
      next[index - 1] = "";
      setCode(next);
    }
  };

  return (
    <View style={styles.container}>
      {step < 5 && (
        <>
          <Header
            title="회원가입"
            onBackPress={() => (step === 1 ? router.back() : setStep(step - 1))}
            style={styles.header}
          />

          <View style={styles.progressBack}>
            <View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </>
      )}

      {step === 1 && (
        <View style={styles.content}>
          <View style={styles.inner}>
            <Text style={styles.stepText}>회원가입 STEP 1</Text>
            <Text style={styles.title}>이메일 아이디를 입력해주세요.</Text>

            <AuthInput
              placeholder="donakawa@dona.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(null);
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {emailError && <Text style={styles.errorText}>{emailError}</Text>}

            <View style={styles.buttonSpace}>
              <AuthButton
                title="인증번호 발송"
                variant={email.trim() && !sendEmailCode.isPending ? "primary" : "disabled"}
                onPress={email.trim() ? handleSendCode : undefined}
              />
            </View>
          </View>
        </View>
      )}

      {step === 2 && (
        <View style={styles.content}>
          <View style={styles.inner}>
            <Text style={styles.stepText}>회원가입 STEP 1</Text>
            <Text style={styles.title}>인증번호를 입력해 주세요.</Text>

            <View style={styles.codeRow}>
              {code.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    codeRefs.current[index] = ref;
                  }}
                  style={[
                    styles.codeInput,
                    verifySeconds === 0 && styles.codeInputDisabled,
                  ]}
                  value={value}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleCodeKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  editable={verifySeconds > 0}
                />
              ))}
            </View>

            <Text
              style={[
                styles.codeTimer,
                verifySeconds === 0 && styles.codeTimerExpired,
              ]}
            >
              {formatTime(verifySeconds)}
            </Text>

            {codeError && <Text style={styles.errorText}>{codeError}</Text>}

            <TouchableOpacity
              disabled={resendSeconds > 0 || sendEmailCode.isPending}
              onPress={handleResendCode}
            >
              <Text
                style={[
                  styles.resendText,
                  resendSeconds > 0 && styles.resendTextDisabled,
                ]}
              >
                {resendSeconds > 0
                  ? `${formatTime(resendSeconds)} 후 재전송 가능`
                  : "인증번호 재전송"}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonSpace}>
              <AuthButton
                title="확인"
                variant={
                  verifySeconds > 0 && code.every((num) => num) && !verifyEmailCode.isPending
                    ? "primary"
                    : "disabled"
                }
                onPress={
                  verifySeconds > 0 && code.every((num) => num)
                    ? handleVerifyCode
                    : undefined
                }
              />
            </View>
          </View>
        </View>
      )}

      {step === 3 && (
        <View style={styles.content}>
          <View style={styles.inner}>
            <Text style={styles.stepText}>회원가입 STEP 2</Text>
            <Text style={styles.title}>비밀번호를 설정해 주세요.</Text>

            <AuthInput
              placeholder="비밀번호 입력"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {password.length > 0 && !isPasswordValid && (
              <Text style={styles.errorText}>
                영문과 숫자 조합, 8~12자리로 입력해주세요.
              </Text>
            )}

            {password.length === 0 && (
              <Text style={styles.helpText}>영문과 숫자 조합, 8~12자리</Text>
            )}

            {isPasswordCheckVisible && (
              <>
              <View style={styles.passwordCheckSpace} />

                <AuthInput
                  placeholder="비밀번호 확인"
                  value={passwordCheck}
                  onChangeText={setPasswordCheck}
                  secureTextEntry
                />

                {passwordCheck.length > 0 && !isPasswordMatched && (
                  <Text style={styles.errorText}>
                    비밀번호가 일치하지 않습니다.
                  </Text>
                )}
              </>
            )}

            <View style={styles.buttonSpace}>
              <AuthButton
                title={isPasswordMatched ? "확인" : "다음"}
                variant={isPasswordMatched ? "primary" : "disabled"}
                onPress={isPasswordMatched ? () => setStep(4) : undefined}
              />
            </View>
          </View>
        </View>
      )}

      {step === 4 && (
        <View style={styles.content}>
          <View style={styles.inner}>
            <Text style={styles.stepText}>회원가입 STEP 3</Text>
            <Text style={styles.title}>닉네임을 입력해 주세요.</Text>

            <View style={styles.nicknameRow}>
              <TextInput
                style={styles.nicknameInput}
                placeholder="10자 이내의 영문 · 한글 · 숫자 입력 가능"
                placeholderTextColor="#B8BDB9"
                value={nickname}
                onChangeText={(text) => {
                  setNickname(text);
                  setNicknameStatus('idle');
                }}
                maxLength={10}
              />

              <TouchableOpacity 
                style={styles.checkButton}
                onPress={handleCheckNickname}
              >
                <Text style={styles.checkButtonText}>중복</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nicknameMessageRow}>
              {nicknameStatus === 'available' ? (
                <Text style={styles.successText}>사용 가능한 닉네임입니다.</Text>
              ) : nicknameStatus === 'duplicate' ? (
                <Text style={styles.duplicateText}>이미 존재하는 닉네임입니다.</Text>
              ) : (
                <View style={{ flex: 1 }} />
              )}
              <Text style={styles.countText}>{nickname.length}/10</Text>
            </View>

            <View style={styles.buttonSpace}>
              <AuthButton
                title={nicknameStatus === 'available' ? "확인" : "다음"}
                variant={nicknameStatus === 'available' && !isSubmitting ? "primary" : "disabled"}
                onPress={nicknameStatus === 'available' ? handleRegister : undefined}
              />
            </View>
          </View>
        </View>
      )}

      {step === 5 && (
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>회원가입이 완료되었습니다.</Text>

          <Ionicons
            name="checkmark"
            size={92}
            color="#7EC985"
            style={styles.completeIcon}
          />

          <AuthButton
            title="도나카와 시작하기"
            onPress={() => router.replace("/(tabs)")}
          />
        </View>
      )}

      <Modal visible={isVerifyModalOpen} transparent animationType="fade">
        <View style={styles.modalDim}>
          <View style={styles.verifyModal}>
            <Ionicons name="checkmark" size={48} color="#7EC985" />

            <Text style={styles.verifyModalText}>
              인증이 완료되었습니다.
            </Text>

            <TouchableOpacity
              style={styles.verifyModalButton}
              onPress={() => {
                setIsVerifyModalOpen(false);
                setStep(3);
              }}
            >
              <Text style={styles.verifyModalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
