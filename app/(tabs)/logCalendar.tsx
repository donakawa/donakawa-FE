import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { type LogCalendarDay, type LogCalendarType, useLogCalendar } from "@/api/log";
import MonthSelector from "@/components/common/MonthSelector";
import Calendar from "@/components/log/calendar/Calendar";
import CalendarItemCard from "@/components/log/calendar/CalendarItemCard";
import { logCalendarStyles as styles } from "@/styles/log/LogCalendar.style";

import BagIcon from "@/assets/images/log/bag.svg";
import BagEmptyIcon from "@/assets/images/log/bag_empty.svg";
import CloseIcon from "@/assets/images/log/close.svg";
import TrashIcon from "@/assets/images/log/delete.svg";
import TrashEmptyIcon from "@/assets/images/log/delete_empty.svg";

type CalendarMode = "bag" | "trash";

const MODE_TO_TYPE: Record<CalendarMode, LogCalendarType> = {
  bag: "BOUGHT",
  trash: "DROPPED",
};

// TODO: 캘린더 API 응답에 상품 이미지가 없어 샘플 이미지로 대체
const ITEM_IMAGE_FALLBACK = require("@/assets/images/log/sample1.png");

const getDayOfDate = (date: string) => {
  const day = Number(date.split(/[-T ]/)[2]);
  return Number.isNaN(day) ? null : day;
};

export default function LogCalendarPage() {
  const today = new Date();

  const [selectedMode, setSelectedMode] = useState<CalendarMode>("bag");
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data } = useLogCalendar({
    year,
    month,
    type: MODE_TO_TYPE[selectedMode],
  });

  const listTitle =
    selectedMode === "bag" ? "구매한 아이템" : "구매 포기한 아이템";

  const dayMap = useMemo(() => {
    const map = new Map<number, LogCalendarDay>();
    data?.calendar.forEach((entry) => {
      const day = getDayOfDate(entry.date);
      if (day !== null) map.set(day, entry);
    });
    return map;
  }, [data]);

  const calendarAmountMap = useMemo(() => {
    const sign = selectedMode === "bag" ? "-" : "+";
    const map: Record<number, string> = {};
    dayMap.forEach((entry, day) => {
      map[day] = `${sign}${entry.totalAmount.toLocaleString()}`;
    });
    return map;
  }, [dayMap, selectedMode]);

  const monthTotalAmount =
    data?.calendar.reduce((sum, entry) => sum + entry.totalAmount, 0) ?? 0;
  const monthCount =
    data?.calendar.reduce((sum, entry) => sum + entry.items.length, 0) ?? 0;

  const currentItems =
    selectedDate !== null ? (dayMap.get(selectedDate)?.items ?? []) : [];

  const handleMonthChange = (selectedYear: number, selectedMonth: number) => {
    setCurrentDate(new Date(selectedYear, selectedMonth - 1, 1));
    setSelectedDate(null);
  };

  const handleTodayPress = () => {
    const currentToday = new Date();

    setCurrentDate(
      new Date(currentToday.getFullYear(), currentToday.getMonth(), 1),
    );
    setSelectedDate(currentToday.getDate());
  };

  const handleModePress = (mode: CalendarMode) => {
    setSelectedMode(mode);
    setSelectedDate(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.summaryRow}>
            <Text style={styles.totalAmount}>
              {monthTotalAmount.toLocaleString()}원
            </Text>
            <Text style={styles.purchaseCount}>
              {monthCount}회 {selectedMode === "bag" ? "구매" : "포기"}
            </Text>
          </View>

          <Pressable onPress={() => router.push("/log")}>
            <CloseIcon style={styles.closeImage} />
          </Pressable>
        </View>

        <MonthSelector year={year} month={month} onChange={handleMonthChange} />

        <View style={styles.weekRow}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <Text key={day} style={styles.weekText}>
              {day}
            </Text>
          ))}
        </View>

        <Calendar
          year={year}
          month={month}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          mode={selectedMode}
          amountMap={calendarAmountMap}
        />

        <View style={styles.bottomControl}>
          <Pressable style={styles.todayButton} onPress={handleTodayPress}>
            <Text style={styles.todayText}>Today</Text>
          </Pressable>

          <View style={styles.modeSwitch}>
            <View pointerEvents="none" style={styles.modeSwitchInnerShadow} />

            <Pressable
              style={[
                styles.modeButton,
                selectedMode === "bag" && styles.activeMode,
              ]}
              onPress={() => handleModePress("bag")}
            >
              {selectedMode === "bag" ? <BagIcon /> : <BagEmptyIcon />}
            </Pressable>

            <Pressable
              style={[
                styles.modeButton,
                selectedMode === "trash" && styles.activeMode,
              ]}
              onPress={() => handleModePress("trash")}
            >
              {selectedMode === "trash" ? <TrashIcon /> : <TrashEmptyIcon />}
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        {selectedDate && (
          <>
            <Text style={styles.dateTitle}>
              {month}월 {selectedDate}일 · {listTitle}
            </Text>

            <View style={styles.dayPurchaseList}>
              <View style={styles.itemList}>
                {currentItems.map((item, index) => (
                  <CalendarItemCard
                    key={`${item.name}-${index}`}
                    image={ITEM_IMAGE_FALLBACK}
                    price={`${item.price.toLocaleString()}원`}
                    name={item.name}
                    brand={item.shop}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
