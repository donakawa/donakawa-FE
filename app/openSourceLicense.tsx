import { router } from "expo-router";
import { Text, View } from "react-native";

import Header from "@/components/common/Header";
import { openSourceLicenseStyle as styles } from "@/styles/mypage/SubPage.style";

type LicenseItemProps = {
  title: string;
  description: string;
  hasDivider?: boolean;
};

function LicenseItem({ title, description, hasDivider }: LicenseItemProps) {
  return (
    <View style={styles.licenseItem}>
      <Text style={styles.licenseTitle}>{title}</Text>
      <Text style={styles.licenseDescription}>{description}</Text>

      {hasDivider && <View style={styles.divider} />}
    </View>
  );
}

export default function OpenSourceLicensePage() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Header title="오픈소스 라이선스" onBackPress={() => router.back()} />

        <View style={styles.card}>
          <LicenseItem
            title="Roboto"
            description={"Roboto is a registered trademark of\nGoogle Inc."}
            hasDivider
          />

          <LicenseItem
            title="Wanted Sans"
            description={
              "본 서체는 원티드랩이 제작한 Wanted Sans를\n사용했습니다."
            }
          />
        </View>
      </View>
    </View>
  );
}
