import { Modal, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";

export interface SortOption<T extends string = string> {
  label: string;
  value: T;
}

interface SortDropdownProps<T extends string = string> {
  visible: boolean;
  options: SortOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  onClose: () => void;
  anchorTop?: number;
  anchorRight?: number;
  anchorLeft?: number;
}

export default function SortDropdown<T extends string = string>({
  visible,
  options,
  selectedValue,
  onSelect,
  onClose,
  anchorTop = 0,
  anchorRight,
  anchorLeft,
}: SortDropdownProps<T>) {
  const handleSelect = (value: T) => {
    onSelect(value);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.dropdown, { top: anchorTop, ...(anchorLeft !== undefined ? { left: anchorLeft } : { right: anchorRight ?? 20 }) }]}
          onPress={() => {}}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isFirst = index === 0;
            const isLast = index === options.length - 1;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.item,
                  isFirst && styles.itemFirst,
                  isLast && styles.itemLast,
                ]}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {option.label}
                </Text>
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
    color: "#919692",
  },
  labelSelected: {
    color: "#2D322E",
  },
});
