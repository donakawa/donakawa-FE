import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AlertModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
}

export default function AlertModal({ visible, message, onConfirm }: AlertModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onConfirm}>
      <Pressable style={styles.backdrop} onPress={onConfirm}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.messageWrap}>
            <Text style={styles.message}>{message}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={onConfirm} activeOpacity={0.85}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
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
    width: 336,
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 36,
    backgroundColor: "#FBFBF5",
    borderRadius: 8,
    alignItems: "center",
    gap: 36,
  },
  messageWrap: {
    width: 236,
    alignItems: "center",
  },
  message: {
    textAlign: "center",
    color: "#2D322E",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    lineHeight: 24,
  },
  button: {
    width: 264,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7EC985",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
});
