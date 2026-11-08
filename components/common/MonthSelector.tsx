import MonthPickerSheet from "@/components/common/MonthPickerSheet";
import MonthSelectButton from "@/components/common/MonthSelectButton";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface MonthSelectorProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export default function MonthSelector({ year, month, onChange }: MonthSelectorProps) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const moveMonth = (amount: number) => {
    const date = new Date(year, month - 1 + amount, 1);
    onChange(date.getFullYear(), date.getMonth() + 1);
  };

  return (
    <>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => moveMonth(-1)}
          accessibilityRole="button"
          accessibilityLabel="이전 달"
        >
          <Ionicons name="chevron-back" size={22} color="#787D79" />
        </TouchableOpacity>
        <MonthSelectButton year={year} month={month} onPress={() => setPickerVisible(true)} />
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={() => moveMonth(1)}
          accessibilityRole="button"
          accessibilityLabel="다음 달"
        >
          <Ionicons name="chevron-forward" size={22} color="#787D79" />
        </TouchableOpacity>
      </View>

      <MonthPickerSheet
        visible={pickerVisible}
        year={year}
        month={month}
        onClose={() => setPickerVisible(false)}
        onSelect={onChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    width: 335,
    alignSelf: "center",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  arrowButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
});
