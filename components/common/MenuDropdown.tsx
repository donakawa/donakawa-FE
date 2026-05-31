import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";

export interface MenuItem {
  label: string;
  onPress: () => void;
}

interface MenuDropdownProps {
  visible: boolean;
  items: MenuItem[];
  onClose: () => void;
  anchorTop?: number;
  anchorRight?: number;
}

export default function MenuDropdown({
  visible,
  items,
  onClose,
  anchorTop = 0,
  anchorRight = 20,
}: MenuDropdownProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.dropdown, { top: anchorTop, right: anchorRight }]}
          onPress={() => {}}
        >
          {items.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === items.length - 1;

            return (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.item,
                  isFirst && styles.itemFirst,
                  isLast && styles.itemLast,
                ]}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  dropdown: {
    position: "absolute",
    width: 168,
    backgroundColor: "#FFFFFF",
    borderRadius: 7,
    borderWidth: 0.5,
    borderColor: "#AAAFAB",
    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.15)",
    elevation: 6,
  },
  item: {
    height: 54,
    paddingTop: 18,
    paddingBottom: 19,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  itemFirst: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  itemLast: {
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    color: "#2D322E",
  },
});
