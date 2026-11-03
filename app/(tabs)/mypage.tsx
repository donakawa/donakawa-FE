import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";

import { useLogout, useMe, useUpdateNickname } from "@/api/auth";
import { getApiErrorMessage } from "@/api/types";
import Header from "@/components/common/Header";
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

  const { data: me } = useMe();
  const updateNickname = useUpdateNickname();
  const logout = useLogout();

  const nickname = me?.nickname ?? "";
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
    setSelectedProfileIndex(draftProfileIndex);

    const newNickname = draftNickname.trim();
    if (!newNickname || newNickname === nickname) {
      setIsProfileModalVisible(false);
      return;
    }

    updateNickname.mutate(newNickname, {
      onSuccess: () => setIsProfileModalVisible(false),
      onError: (error) => Alert.alert("닉네임 변경 실패", getApiErrorMessage(error)),
    });
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => router.replace("/login"),
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Header
          title="My page"
          rightElement={
            <Pressable
              style={styles.settingButton}
              onPress={() => router.push("/settings")}
            >
              <SettingIcon />
            </Pressable>
          }
        />

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
              <Text style={styles.email}>{me?.email ?? ""}</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.resetCard}
          onPress={() => router.push("/budgetSettings")}
        >
          <View style={styles.resetButton}>
            <MoneyIcon />
            <Text style={styles.resetText}>예산 설정 다시 하기</Text>
            <ArrowIcon style={styles.arrow} />
          </View>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={logout.isPending}
        >
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
