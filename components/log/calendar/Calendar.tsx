import { Pressable, Text, View } from "react-native";

import { calendarStyles as styles } from "@/styles/log/LogCalendar.style";

type CalendarProps = {
  year: number;
  month: number;
  selectedDate: number;
  onSelectDate: (date: number) => void;
};

export default function Calendar({
  year,
  month,
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  const today = new Date();

  const todayDate =
    today.getFullYear() === year && today.getMonth() + 1 === month
      ? today.getDate()
      : null;

  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, index) => index + 1),
  ];

  return (
    <View style={styles.calendarGrid}>
      {days.map((day, index) => {
        if (day === null) {
          return <View key={`empty-${index}`} style={styles.dayCell} />;
        }

        const isSelected = day === selectedDate;
        const isToday = day === todayDate;

        return (
          <Pressable
            key={day}
            style={styles.dayCell}
            onPress={() => onSelectDate(day)}
          >
            <View
              style={[
                styles.circle,
                isToday && styles.greenCircle,
                isSelected && styles.pinkCircle,
              ]}
            >
              <Text style={styles.dayText}>{day}</Text>
            </View>

            <Text style={[styles.daySubText, isSelected && styles.redText]}>
              {isSelected ? "-171,900" : "-"}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
