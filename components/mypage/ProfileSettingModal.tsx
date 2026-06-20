import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  type ImageSourcePropType,
} from "react-native";

import CameraIcon from "@/assets/images/mypage/images.svg";
import { profileSettingModalStyles as styles } from "@/styles/mypage/Mypage.style";

type ModalStep = "edit" | "imageSelect";

type ProfileSettingModalProps = {
  visible: boolean;
  nickname: string;
  selectedProfileIndex: number;
  profileImages: ImageSourcePropType[];
  onChangeNickname: (text: string) => void;
  onSelectProfile: (index: number) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function ProfileSettingModal({
  visible,
  nickname,
  selectedProfileIndex,
  profileImages,
  onChangeNickname,
  onSelectProfile,
  onClose,
  onSubmit,
}: ProfileSettingModalProps) {
  const [step, setStep] = useState<ModalStep>("edit");

  useEffect(() => {
    if (visible) {
      setStep("edit");
    }
  }, [visible]);

  const handleClose = () => {
    setStep("edit");
    onClose();
  };

  const handleSubmit = () => {
    setStep("edit");
    onSubmit();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={[
                  styles.modal,
                  step === "imageSelect" && styles.imageSelectModal,
                ]}
              >
                {step === "edit" ? (
                  <>
                    <View style={styles.header}>
                      <Pressable onPress={handleClose}>
                        <Text style={styles.headerText}>취소</Text>
                      </Pressable>

                      <Pressable onPress={handleSubmit}>
                        <Text style={styles.doneText}>완료</Text>
                      </Pressable>
                    </View>

                    <View style={styles.form}>
                      <Text style={styles.title}>프로필 설정</Text>

                      <View style={styles.bottomContent}>
                        <View style={styles.profileSettingImageWrap}>
                          <View style={styles.profileSettingImageCircle}>
                            <Image
                              source={profileImages[selectedProfileIndex]}
                              style={styles.profileSettingImage}
                              resizeMode="contain"
                            />
                          </View>

                          <Pressable
                            style={styles.cameraButton}
                            onPress={() => setStep("imageSelect")}
                          >
                            <CameraIcon width={20} height={20} />
                          </Pressable>
                        </View>

                        <View style={styles.inputBox}>
                          <TextInput
                            value={nickname}
                            onChangeText={onChangeNickname}
                            style={styles.input}
                            maxLength={8}
                            placeholder="닉네임"
                            placeholderTextColor="#2D322E"
                          />

                          <Text style={styles.count}>{nickname.length}/8</Text>
                        </View>
                      </View>
                    </View>
                  </>
                ) : (
                  <View style={styles.imageSelectContent}>
                    <View style={styles.topContent}>
                      <View style={styles.imageSelectHeader}>
                        <Text style={styles.imageSelectSubText}>
                          햄스터 사진을 클릭하여
                        </Text>
                        <Text style={styles.imageSelectTitle}>
                          프로필을 바꾸세요
                        </Text>
                      </View>

                      <View style={styles.profileGrid}>
                        {profileImages.map((image, index) => (
                          <Pressable
                            key={`profile-${index}`}
                            style={styles.profileGridItem}
                            onPress={() => onSelectProfile(index)}
                          >
                            <Image
                              source={image}
                              style={styles.profileGridImage}
                              resizeMode="contain"
                            />

                            {selectedProfileIndex === index && (
                              <>
                                <View
                                  style={{
                                    position: "absolute",
                                    width: 107,
                                    height: 107,
                                    backgroundColor: "rgba(0,0,0,0.35)",
                                  }}
                                />

                                <View style={styles.selectedBadge}>
                                  <Text style={styles.selectedBadgeText}>
                                    ✓
                                  </Text>
                                </View>
                              </>
                            )}
                          </Pressable>
                        ))}
                      </View>
                    </View>

                    <View style={styles.imageSelectButtonRow}>
                      <Pressable
                        style={styles.prevButton}
                        onPress={() => setStep("edit")}
                      >
                        <Text style={styles.prevButtonText}>이전으로</Text>
                      </Pressable>

                      <Pressable
                        style={styles.completeButton}
                        onPress={handleSubmit}
                      >
                        <Text style={styles.completeButtonText}>완료</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
