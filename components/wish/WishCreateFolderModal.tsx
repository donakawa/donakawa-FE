import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_LENGTH = 8;

interface WishCreateFolderModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function WishCreateFolderModal({
  visible,
  onClose,
  onCreate,
}: WishCreateFolderModalProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const inputRef = useRef<TextInput>(null);

  const isOverLimit = name.length > MAX_LENGTH;
  const canSubmit = name.trim().length > 0 && !isOverLimit;

  const handleCreate = () => {
    if (!canSubmit) return;
    onCreate(name.trim());
    setName("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      onShow={() => setTimeout(() => inputRef.current?.focus(), 50)}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom || 20 }]}>
            {/* 취소 / 완료 */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleClose} hitSlop={8}>
                <Text style={styles.cancel}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} hitSlop={8} disabled={!canSubmit}>
                <Text style={[styles.confirm, !canSubmit && styles.confirmDisabled]}>완료</Text>
              </TouchableOpacity>
            </View>

            {/* 폴더 픽셀 버튼 */}
            <View style={styles.folderButtonWrap}>
              <View style={styles.folderButtonOuterWrap}>
                <View style={styles.folderButtonShadow} />
                <View style={styles.folderButtonOuter}>
                  <View style={styles.folderButtonTopHighlight} />
                  <View style={styles.folderButtonLeftHighlight} />
                  <View style={styles.folderButtonBottomShade} />
                  <View style={styles.folderBadge}>
                    <Text style={styles.folderBadgeText}>폴더</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 텍스트 입력 */}
            <View style={styles.inputWrap}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={name}
                onChangeText={setName}
                multiline
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={handleCreate}
                placeholderTextColor="#AAAFAB"
              />
              <View style={styles.counter}>
                <Text style={[styles.counterCurrent, isOverLimit && styles.counterOver]}>
                  {name.length}
                </Text>
                <Text style={styles.counterMax}>/{MAX_LENGTH}</Text>
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.10)",
  },
  sheet: {
    backgroundColor: "#FAFFF9",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8F9C7",
    paddingTop: 20,
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#464B47",
    lineHeight: 24,
  },
  confirm: {
    fontSize: 16,
    fontWeight: "600",
    color: "#464B47",
    lineHeight: 24,
  },
  confirmDisabled: {
    color: "#AAAFAB",
  },
  folderButtonWrap: {
    alignItems: "center",
  },
  folderButtonOuterWrap: {
    position: "relative",
    height: 36,
  },
  folderButtonShadow: {
    position: "absolute",
    pointerEvents: "none",
    top: 3,
    right: -1,
    bottom: -2,
    left: 2,
    backgroundColor: "rgba(104, 171, 110, 0.24)",
    borderRadius: 4,
  },
  folderButtonOuter: {
    position: "relative",
    height: 36,
    paddingHorizontal: 13,
    backgroundColor: "#E8F9C7",
    borderRadius: 4,
    borderWidth: 1,
    borderTopColor: "#ACDAA3",
    borderLeftColor: "#ACDAA3",
    borderRightColor: "#91C396",
    borderBottomColor: "#91C396",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  folderButtonTopHighlight: {
    position: "absolute",
    pointerEvents: "none",
    top: 1,
    right: 1,
    left: 1,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.46)",
  },
  folderButtonLeftHighlight: {
    position: "absolute",
    pointerEvents: "none",
    top: 1,
    bottom: 1,
    left: 1,
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
  folderButtonBottomShade: {
    position: "absolute",
    pointerEvents: "none",
    right: 1,
    bottom: 1,
    left: 1,
    height: 2,
    backgroundColor: "rgba(104, 171, 110, 0.08)",
  },
  folderBadge: {
    height: 28,
    paddingHorizontal: 20,
    backgroundColor: "#FAFFF9",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  folderBadgeText: {
    fontSize: 14,
    color: "#464B47",
    lineHeight: 22,
  },
  inputWrap: {
    height: 84,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E8F9C7",
    justifyContent: "space-between",
    boxShadow: "2px 2px 6px rgba(101, 121, 105, 0.35)",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
    color: "#141915",
    lineHeight: 24,
    textAlignVertical: "top",
    padding: 0,
  },
  counter: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  counterCurrent: {
    fontSize: 12,
    color: "#AAAFAB",
    lineHeight: 18,
  },
  counterOver: {
    color: "#E4463C",
  },
  counterMax: {
    fontSize: 12,
    color: "#AAAFAB",
    lineHeight: 18,
  },
});
