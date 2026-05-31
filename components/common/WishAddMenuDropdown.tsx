import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WishAddMenuDropdownProps {
  visible: boolean;
  onClose: () => void;
  onLinkRegister: () => void;
  onDirectRegister: () => void;
}

export default function WishAddMenuDropdown({
  visible,
  onClose,
  onLinkRegister,
  onDirectRegister,
}: WishAddMenuDropdownProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={16} color="#5F6460" />
          </TouchableOpacity>
          <View style={styles.content}>
            <Text style={styles.title}>위시템 추가</Text>
            <View style={styles.items}>
              <TouchableOpacity
                style={styles.item}
                onPress={() => { onClose(); onLinkRegister(); }}
                activeOpacity={0.7}
              >
                <Text style={styles.itemLabel}>링크로 등록</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.item}
                onPress={() => { onClose(); onDirectRegister(); }}
                activeOpacity={0.7}
              >
                <Text style={styles.itemLabel}>직접 등록</Text>
              </TouchableOpacity>
            </View>
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
    width: 335,
    backgroundColor: "#FBFBF5",
    borderRadius: 8,
    padding: 8,
  },
  closeBtn: {
    width: 48,
    height: 48,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    alignItems: "center",
    gap: 24,
  },
  title: {
    alignSelf: "stretch",
    textAlign: "center",
    color: "#141915",
    fontSize: 16,
    fontFamily: "Galmuri11",
    fontWeight: "700",
    lineHeight: 24,
  },
  items: {
    alignSelf: "stretch",
    gap: 8,
  },
  item: {
    paddingVertical: 20,
  },
  itemLabel: {
    color: "#464B47",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 27,
  },
});
