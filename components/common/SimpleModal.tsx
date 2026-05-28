import { simpleModalStyles as styles } from "@/styles/common/SimpleModal.style";
import { Modal, Pressable, Text, View } from "react-native";

interface SimpleModalProps {
  visible: boolean;
  title: string;
  description: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function SimpleModal({
  visible,
  title,
  description,
  danger,
  onCancel,
  onConfirm,
}: SimpleModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.textArea}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>아니오</Text>
            </Pressable>

            <Pressable
              style={[
                styles.confirmButton,
                danger && styles.dangerConfirmButton,
              ]}
              onPress={onConfirm}
            >
              <Text
                style={[styles.confirmText, danger && styles.dangerConfirmText]}
              >
                탈퇴
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
