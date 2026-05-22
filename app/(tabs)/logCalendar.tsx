import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import Calendar from "@/components/log/calendar/Calendar";
import CalendarItemCard from "@/components/log/calendar/CalendarItemCard";
import { logCalendarStyles as styles } from "@/styles/log/LogCalendar.style";

import LeftArrowIcon from "@/assets/images/log/arrow_left_gray.svg";
import RightArrowIcon from "@/assets/images/log/arrow_right_gray.svg";
import BagIcon from "@/assets/images/log/bag.svg";
import BagEmptyIcon from "@/assets/images/log/bag_empty.svg";
import CloseIcon from "@/assets/images/log/close.svg";
import TrashIcon from "@/assets/images/log/delete.svg";
import TrashEmptyIcon from "@/assets/images/log/delete_empty.svg";

type CalendarMode = "bag" | "trash";

const purchaseItems = [
  {
    id: 1,
    image: require("@/assets/images/log/sample1.png"),
    price: "60,300원",
    name: "라부부",
    brand: "POPmart",
  },
  {
    id: 2,
    image: require("@/assets/images/log/sample1.png"),
    price: "24,200원",
    name: "우먼 가을 니트 아이보리",
    brand: "에이블리",
  },
];

const giveUpItems = [
  {
    id: 1,
    image: require("@/assets/images/log/sample1.png"),
    price: "100,000,000원",
    name: "앙앙이 신발",
    brand: "무신사",
  },
  {
    id: 2,
    image: require("@/assets/images/log/sample1.png"),
    price: "1,000원",
    name: "앙앙이 블러셔",
    brand: "에이블리",
  },
];

export default function LogCalendarPage() {
  const today = new Date();

  const [selectedMode, setSelectedMode] = useState<CalendarMode>("bag");
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const currentItems = selectedMode === "bag" ? purchaseItems : giveUpItems;
  const listTitle =
    selectedMode === "bag" ? "구매한 아이템" : "구매 포기한 아이템";

  const calendarAmountMap: Record<number, string> =
    selectedMode === "bag"
      ? {
          1: "-171,900",
        }
      : {
          8: "+248,600",
        };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
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
            <Text style={styles.totalAmount}>264,500원</Text>
            <Text style={styles.purchaseCount}>15회 구매</Text>
          </View>

          <Pressable onPress={() => router.push("/log")}>
            <CloseIcon style={styles.closeImage} />
          </Pressable>
        </View>

        <View style={styles.monthControl}>
          <Pressable style={styles.arrowButton} onPress={handlePrevMonth}>
            <LeftArrowIcon />
          </Pressable>

          <View style={[styles.selectBox, styles.yearBox]}>
            <Text style={styles.selectText}>{year}년</Text>
          </View>

          <View style={[styles.selectBox, styles.monthBox]}>
            <Text style={styles.selectText}>{month}월</Text>
          </View>

          <Pressable style={styles.arrowButton} onPress={handleNextMonth}>
            <RightArrowIcon />
          </Pressable>
        </View>

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
                {currentItems.map((item) => (
                  <CalendarItemCard
                    key={item.id}
                    image={item.image}
                    price={item.price}
                    name={item.name}
                    brand={item.brand}
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
