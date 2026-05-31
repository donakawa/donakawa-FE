import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  description,
  cancelLabel = "아니오",
  confirmLabel = "네",
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{title}</Text>
            {description ? <Text style={styles.description}>{description}</Text> : null}
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.85}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.30)",
  },
  card: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 36,
    backgroundColor: "#FBFBF5",
    borderRadius: 8,
    alignItems: "center",
    gap: 24,
  },
  textWrap: {
    width: 236,
    alignItems: "center",
    gap: 12,
  },
  title: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#2D322E",
    fontSize: 16,
    fontFamily: "Galmuri11",
    fontWeight: "700",
    lineHeight: 24,
  },
  description: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#787D79",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
  buttons: {
    flexDirection: "row",
    gap: 32,
  },
  cancelBtn: {
    width: 116,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  cancelText: {
    textAlign: "center",
    color: "#464B47",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  confirmBtn: {
    width: 116,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7EC985",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  confirmText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
});
