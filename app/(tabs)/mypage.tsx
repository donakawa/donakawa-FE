import { Image, Pressable, Text, View } from "react-native";

import { myPageStyles as styles } from "@/styles/mypage/Mypage.style";

import ArrowIcon from "@/assets/images/log/arrow_mini.svg";
import EditIcon from "@/assets/images/mypage/edit.svg";
import MoneyIcon from "@/assets/images/mypage/money-bag.svg";
import SettingIcon from "@/assets/images/mypage/settings.svg";

const profileImages = [require("@/assets/images/mypage/profile-image.png")];

export default function MyPage() {
  const selectedProfileIndex = 0;

  const profileImage = profileImages[selectedProfileIndex];

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My page</Text>

          <Pressable style={styles.settingButton}>
            <SettingIcon />
          </Pressable>
        </View>
        <View style={styles.profileCard}>
          <Pressable style={styles.editButton}>
            <EditIcon />
          </Pressable>

          <View style={styles.profileContent}>
            <View style={styles.profileImageWrap}>
              <Image source={profileImage} style={styles.profileImage} />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>프리더햄톨</Text>
              <Text style={styles.email}>hamtolthegoat@naver.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.resetCard}>
          <Pressable style={styles.resetButton}>
            <MoneyIcon />
            <Text style={styles.resetText}>예산 설정 다시 하기</Text>
            <ArrowIcon style={styles.arrow} />
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  );
}
