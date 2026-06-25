import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

import Header from "@/components/common/Header";
import { settingsStyles as styles } from "@/styles/mypage/Settings.style";

import ArrowRightIcon from "@/assets/images/log/arrow_right_gray.svg";
import CheckIcon from "@/assets/images/mypage/check-circle.svg";

type SettingRowProps = {
  title: string;
  description?: string;
  danger?: boolean;
  isConnected?: boolean;
  onPress?: () => void;
};

function SettingRow({
  title,
  description,
  danger,
  isConnected,
  onPress,
}: SettingRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <View style={styles.titleWrap}>
          <Text style={[styles.rowTitle, danger && styles.dangerText]}>
            {title}
          </Text>

          {isConnected && <CheckIcon />}
        </View>

        {description ? (
          <Text style={styles.rowDescription}>{description}</Text>
        ) : null}
      </View>

      <ArrowRightIcon style={styles.arrowRight} />
    </Pressable>
  );
}

export default function SettingsPage() {
  const isGoogleConnected = true;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Header title="Setting" onBackPress={() => router.navigate("/mypage")} />

        <View style={styles.settingContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내 계정 관리</Text>

            <View style={styles.card}>
              <SettingRow
                title="비밀번호 변경"
                onPress={() => router.push("/changePassword")}
              />
              <SettingRow
                title="구글 연동"
                description="hamtolthegoat@gmail.com"
                isConnected={isGoogleConnected}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>고객 지원</Text>

            <View style={styles.card}>
              <SettingRow title="이용약관" />
              <SettingRow title="의견 보내기" />
              <SettingRow title="개인정보 처리방침" />
              <SettingRow title="버전 정보" />
              <SettingRow
                title="오픈소스 라이선스"
                onPress={() => router.push("/openSourceLicense")}
              />
              <SettingRow
                title="회원 탈퇴"
                danger
                onPress={() => router.push("/withdrawal")}
              />
            </View>
          </View>

          {__DEV__ && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>개발자</Text>

              <View style={styles.card}>
                <SettingRow
                  title="🛠 공통 컴포넌트 뷰어"
                  onPress={() => router.push("/dev")}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
