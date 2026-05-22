import { useState } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import ProfileSettingModal from "@/components/mypage/ProfileSettingModal";
import { myPageStyles as styles } from "@/styles/mypage/Mypage.style";

import ArrowIcon from "@/assets/images/log/arrow_mini.svg";
import EditIcon from "@/assets/images/mypage/edit.svg";
import MoneyIcon from "@/assets/images/mypage/money-bag.svg";
import SettingIcon from "@/assets/images/mypage/settings.svg";

const profileImages: ImageSourcePropType[] = [
  require("@/assets/images/mypage/dona_1.png"),
  require("@/assets/images/mypage/dona_2.png"),
  require("@/assets/images/mypage/dona_3.png"),
  require("@/assets/images/mypage/dona_4.png"),
  require("@/assets/images/mypage/dona_5.png"),
  require("@/assets/images/mypage/dona_6.png"),
];

export default function MyPage() {
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

  const [nickname, setNickname] = useState("프리더햄톨");
  const [draftNickname, setDraftNickname] = useState(nickname);

  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const [draftProfileIndex, setDraftProfileIndex] =
    useState(selectedProfileIndex);

  const openProfileModal = () => {
    setDraftNickname(nickname);
    setDraftProfileIndex(selectedProfileIndex);
    setIsProfileModalVisible(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalVisible(false);
  };

  const submitProfile = () => {
    setNickname(draftNickname);
    setSelectedProfileIndex(draftProfileIndex);
    setIsProfileModalVisible(false);
  };

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
          <Pressable style={styles.editButton} onPress={openProfileModal}>
            <EditIcon />
          </Pressable>

          <View style={styles.profileContent}>
            <View style={styles.profileImageWrap}>
              <Image
                source={profileImages[selectedProfileIndex]}
                style={styles.profileImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>{nickname}</Text>
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

      <ProfileSettingModal
        visible={isProfileModalVisible}
        nickname={draftNickname}
        selectedProfileIndex={draftProfileIndex}
        profileImages={profileImages}
        onChangeNickname={setDraftNickname}
        onSelectProfile={setDraftProfileIndex}
        onClose={closeProfileModal}
        onSubmit={submitProfile}
      />
    </View>
  );
}
