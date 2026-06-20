import { Ionicons } from "@expo/vector-icons";
import {
  addMonths,
  format,
  isAfter,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface CalendarModalProps {
  visible: boolean;
  initialPrice?: number | string;
  initialStartDate?: Date;
  initialEndDate?: Date | null;
  onClose: () => void;
  onConfirm: (start: Date, end: Date | null, price: string) => void;
}

const normalizeDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const formatPrice = (value: number | string | undefined) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getMonthWeeks = (year: number, month: number): (Date | null)[][] => {
  const firstDay = startOfMonth(new Date(year, month));
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstDay.getDay() }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
  ];

  const remainder = cells.length % 7;
  if (remainder > 0) {
    cells.push(...Array.from({ length: 7 - remainder }, () => null));
  }

  return Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );
};

export default function CalendarModal({
  visible,
  initialPrice,
  initialStartDate,
  initialEndDate,
  onClose,
  onConfirm,
}: CalendarModalProps) {
  const insets = useSafeAreaInsets();
  const [today] = useState(() => normalizeDate(new Date()));

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [price, setPrice] = useState(formatPrice(initialPrice));

  useEffect(() => {
    if (!visible) return;

    const initialSelectedDate = initialStartDate ?? initialEndDate ?? null;
    const referenceDate = normalizeDate(initialSelectedDate ?? today);

    setYear(referenceDate.getFullYear());
    setMonth(referenceDate.getMonth());
    setSelectedDate(initialSelectedDate ? normalizeDate(initialSelectedDate) : null);
    setPrice(formatPrice(initialPrice));
  }, [visible, initialPrice, initialStartDate, initialEndDate, today]);

  const weeks = getMonthWeeks(year, month);
  const priceDigits = price.replace(/\D/g, "");
  const canConfirm = !!selectedDate && priceDigits.length > 0;
  const compact = weeks.length > 5;

  const goToPrev = () => {
    const prev = subMonths(new Date(year, month), 1);
    setYear(prev.getFullYear());
    setMonth(prev.getMonth());
  };

  const goToNext = () => {
    const next = addMonths(new Date(year, month), 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const handleDayPress = (date: Date) => {
    const day = normalizeDate(date);
    if (isAfter(day, today)) return;

    setSelectedDate((current) => (current && isSameDay(current, day) ? null : day));
  };

  const handlePriceChange = (value: string) => {
    setPrice(formatPrice(value));
  };

  const handleConfirm = () => {
    if (!selectedDate || !canConfirm) return;
    onConfirm(selectedDate, null, priceDigits);
  };

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[
          styles.screen,
          {
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <View
          style={[
            styles.header,
            {
              height: insets.top + 48,
              paddingTop: insets.top,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={8}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="#5F6460" />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, compact && styles.contentCompact]}>
          <View style={[styles.calendarGroup, compact && styles.calendarGroupCompact]}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={goToPrev}
                hitSlop={8}
                activeOpacity={0.75}
              >
                <Ionicons name="chevron-back" size={24} color="#787D79" />
              </TouchableOpacity>

              <View style={styles.monthControls}>
                <View style={[styles.monthPill, styles.yearPill]}>
                  <Text style={styles.monthPillText}>{year}년</Text>
                </View>
                <View style={[styles.monthPill, styles.monthPillShort]}>
                  <Text style={styles.monthPillText}>{month + 1}월</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.arrowButton}
                onPress={goToNext}
                hitSlop={8}
                activeOpacity={0.75}
              >
                <Ionicons name="chevron-forward" size={24} color="#787D79" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarBody}>
              <View style={styles.weekRow}>
                {WEEK_DAYS.map((day) => (
                  <Text key={day} style={styles.weekText}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={[styles.dayRows, compact && styles.dayRowsCompact]}>
                {weeks.map((week, weekIndex) => (
                  <View key={weekIndex} style={styles.dayRow}>
                    {week.map((day, dayIndex) => {
                      if (!day) {
                        return <View key={`empty-${dayIndex}`} style={styles.dayCell} />;
                      }

                      const selected = !!selectedDate && isSameDay(day, selectedDate);
                      const future = isAfter(day, today);
                      const todayMark = isSameDay(day, today);

                      return (
                        <TouchableOpacity
                          key={format(day, "yyyy-MM-dd")}
                          style={[
                            styles.dayCell,
                            todayMark && !selected && styles.todayCell,
                            selected && styles.selectedCell,
                          ]}
                          onPress={() => handleDayPress(day)}
                          disabled={future}
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.dayText,
                              future && styles.futureDayText,
                            ]}
                          >
                            {format(day, "d")}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={[styles.detailGroup, compact && styles.detailGroupCompact]}>
            <View style={styles.todayInfoGroup}>
              <View style={styles.todayDividerGroup}>
                <View style={styles.todayButtonFrame}>
                  <TouchableOpacity
                    style={styles.todayButton}
                    onPress={goToToday}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.todayText}>Today</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.divider} />
              </View>

              <Text style={styles.infoText}>구매한 날짜와 가격을 확인해 주세요!</Text>
            </View>

            <View style={styles.priceBox}>
              <View style={styles.priceContent}>
                <Text style={styles.priceLabel}>가격</Text>
                <View style={styles.priceValueGroup}>
                  <View style={styles.priceInputFrame}>
                    <View style={styles.priceInputBox}>
                      <TextInput
                        style={styles.priceInput}
                        value={price}
                        onChangeText={handlePriceChange}
                        keyboardType="number-pad"
                        placeholder="0"
                        placeholderTextColor="#AAAFAB"
                        textAlign="center"
                      />
                    </View>
                    <View style={styles.priceUnderline} />
                  </View>
                  <View style={styles.priceUnitFrame}>
                    <Text style={styles.priceUnit}>원</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, !canConfirm && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={!canConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FBFBF5",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: 335,
    marginTop: 8,
    alignItems: "center",
    gap: 52,
  },
  contentCompact: {
    gap: 36,
  },
  calendarGroup: {
    width: 317,
    alignItems: "center",
    gap: 28,
  },
  calendarGroupCompact: {
    gap: 20,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  arrowButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  monthControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  monthPill: {
    height: 35,
    paddingHorizontal: 20,
    backgroundColor: "#F0FFE5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  yearPill: {
    width: 102,
  },
  monthPillShort: {
    width: 73,
  },
  monthPillText: {
    textAlign: "center",
    color: "#7A5751",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
  calendarBody: {
    width: 317,
    alignItems: "center",
    gap: 20,
  },
  weekRow: {
    width: 317,
    flexDirection: "row",
    gap: 12,
  },
  weekText: {
    width: 35,
    textAlign: "center",
    color: "#5F6460",
    fontSize: 14,
    fontFamily: "Galmuri9",
    lineHeight: 21,
  },
  dayRows: {
    width: 317,
    gap: 12,
  },
  dayRowsCompact: {
    gap: 8,
  },
  dayRow: {
    flexDirection: "row",
    gap: 12,
  },
  dayCell: {
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  todayCell: {
    backgroundColor: "#FFDBEB",
  },
  selectedCell: {
    backgroundColor: "#E8F9C7",
  },
  dayText: {
    textAlign: "center",
    color: "#7A5751",
    fontSize: 14,
    fontFamily: "WantedSansRegular",
    lineHeight: 21,
  },
  futureDayText: {
    color: "#AAAFAB",
  },
  detailGroup: {
    width: 335,
    alignItems: "flex-start",
    gap: 28,
  },
  detailGroupCompact: {
    gap: 24,
  },
  todayInfoGroup: {
    width: 335,
    alignItems: "center",
    gap: 12,
  },
  todayDividerGroup: {
    width: 335,
    gap: 12,
  },
  todayButtonFrame: {
    width: 81,
    paddingVertical: 4,
  },
  todayButton: {
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: "#F0FFE5",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  todayText: {
    color: "#464B47",
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    lineHeight: 21,
  },
  divider: {
    width: 335,
    height: 1,
    backgroundColor: "#9CCCA0",
  },
  infoText: {
    alignSelf: "stretch",
    textAlign: "right",
    color: "#E67972",
    fontSize: 14,
    fontFamily: "Galmuri9",
    lineHeight: 21,
  },
  priceBox: {
    width: 335,
    height: 59,
    paddingTop: 5,
    paddingBottom: 6,
    paddingHorizontal: 8,
    backgroundColor: "#F0FFE5",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  priceContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceLabel: {
    marginLeft: 12,
    textAlign: "center",
    color: "#7A5751",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
  priceValueGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInputFrame: {
    width: 97,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  priceInputBox: {
    width: 97,
    height: 31,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  priceInput: {
    width: 97,
    height: 31,
    padding: 0,
    textAlign: "center",
    color: "#7EC985",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    lineHeight: 24,
  },
  priceUnderline: {
    width: 97,
    height: 1,
    backgroundColor: "#E67972",
  },
  priceUnitFrame: {
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  priceUnit: {
    textAlign: "center",
    color: "#7A5751",
    fontSize: 16,
    fontFamily: "WantedSansSemiBold",
    lineHeight: 24,
  },
  confirmButton: {
    width: 162,
    height: 51,
    backgroundColor: "#FFDBEB",
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#E67972",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    overflow: "hidden",
    boxShadow:
      "inset -3px -4px 7px rgba(230, 153, 153, 0.80), inset 1px 3px 4px #FFE7F1",
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmText: {
    textAlign: "center",
    color: "#7A5751",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    lineHeight: 24,
    includeFontPadding: false,
  },
});
