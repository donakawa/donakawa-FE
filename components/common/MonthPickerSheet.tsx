import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MonthPickerSheetProps {
  visible: boolean;
  year: number;
  month: number;
  onClose: () => void;
  onSelect: (year: number, month: number) => void;
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

export default function MonthPickerSheet({
  visible,
  year,
  month,
  onClose,
  onSelect,
}: MonthPickerSheetProps) {
  const [displayYear, setDisplayYear] = useState(year);

  useEffect(() => {
    if (visible) setDisplayYear(year);
  }, [visible, year]);

  const handleMonthPress = (m: number) => {
    onSelect(displayYear, m);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} hitSlop={8}>
            <Ionicons name="close" size={16} color="#919692" />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.yearHeader}>
              <TouchableOpacity
                style={styles.arrowBtn}
                onPress={() => setDisplayYear((y) => y - 1)}
                hitSlop={8}
              >
                <Ionicons name="chevron-back" size={19} color="#919692" />
              </TouchableOpacity>
              <Text style={styles.yearText}>{`${displayYear}년`}</Text>
              <TouchableOpacity
                style={styles.arrowBtn}
                onPress={() => setDisplayYear((y) => y + 1)}
                hitSlop={8}
              >
                <Ionicons name="chevron-forward" size={19} color="#919692" />
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {MONTHS.map((m) => {
                const isSelected = displayYear === year && m === month;
                return (
                  <TouchableOpacity
                    key={m}
                    style={styles.cellWrap}
                    onPress={() => handleMonthPress(m)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.cell, isSelected && styles.cellSelected]}>
                      <Text style={[styles.cellText, isSelected && styles.cellTextSelected]}>
                        {`${m}월`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
    backgroundColor: "rgba(0, 0, 0, 0.30)",
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    height: 334,
    backgroundColor: "#FBFBF5",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 47,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 16,
  },
  content: {
    alignItems: "center",
    gap: 20,
  },
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  arrowBtn: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  yearText: {
    textAlign: "center",
    color: "#5F6460",
    fontSize: 20,
    fontFamily: "WantedSansSemiBold",
    fontWeight: "600",
    lineHeight: 30,
  },
  grid: {
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 12,
  },
  cellWrap: {
    width: "25%",
    padding: 4,
    alignItems: "center",
  },
  cell: {
    width: 44,
    height: 44,
    paddingTop: 9,
    paddingBottom: 10,
    paddingHorizontal: 9,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  cellSelected: {
    backgroundColor: "#7EC985",
  },
  cellText: {
    textAlign: "center",
    color: "#787D79",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    fontWeight: "600",
    lineHeight: 24,
  },
  cellTextSelected: {
    color: "#FFFFFF",
  },
});
