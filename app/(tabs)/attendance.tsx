import AttendanceIcon from "@/assets/images/attendance/attendance_1.svg";
import RewardAttendanceIcon from "@/assets/images/attendance/attendance_2.svg";
import AttendanceMonthPickerSheet from "@/components/attendance/AttendanceMonthPickerSheet";
import {
  claimAttendanceReward,
  useAttendanceStore,
} from "@/stores/attendanceStore";
import { attendanceStyles as styles } from "@/styles/attendance/Attendance.style";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const REWARDS = [
  { days: 5, points: 10 },
  { days: 10, points: 25 },
  { days: 20, points: 50 },
  { days: 30, points: 100 },
];

const getDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const getMockAttendanceDates = (today: Date) =>
  Array.from({ length: 5 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - index,
    );

    return getDateKey(date.getFullYear(), date.getMonth() + 1, date.getDate());
  });

const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const days = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: lastDate }, (_, index) => index + 1),
  ];

  return [
    ...days,
    ...Array.from({ length: 42 - days.length }, () => null),
  ];
};

const getMonthlyConsecutiveDays = (
  attendanceSet: Set<string>,
  year: number,
  month: number,
) => {
  const lastDate = new Date(year, month, 0).getDate();
  let currentStreak = 0;
  let maxStreak = 0;

  for (let day = 1; day <= lastDate; day += 1) {
    if (attendanceSet.has(getDateKey(year, month, day))) {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
};

export default function Attendance() {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [attendanceDates, setAttendanceDates] = useState<string[]>(
    () => getMockAttendanceDates(today),
  );
  const { claimedRewardKeys } = useAttendanceStore();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [receivedRewardPoints, setReceivedRewardPoints] = useState<
    number | null
  >(null);
  const [showRewardToast, setShowRewardToast] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const todayKey = getDateKey(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth() + 1;
  const todayDate = isCurrentMonth ? today.getDate() : null;
  const attendanceSet = useMemo(
    () => new Set(attendanceDates),
    [attendanceDates],
  );
  const checkedInToday = attendanceSet.has(todayKey);
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const monthAttendanceCount = attendanceDates.filter((date) =>
    date.startsWith(`${year}-${String(month).padStart(2, "0")}-`),
  ).length;
  const consecutiveDays = getMonthlyConsecutiveDays(
    attendanceSet,
    year,
    month,
  );
  const getRewardKey = (rewardDays: number) =>
    `${year}-${String(month).padStart(2, "0")}-${rewardDays}`;
  const nextClaimableReward = isCurrentMonth
    ? REWARDS.find(
        (reward) =>
          consecutiveDays >= reward.days &&
          !claimedRewardKeys.includes(getRewardKey(reward.days)),
      )
    : undefined;
  const canClaimReward = Boolean(nextClaimableReward);

  const changeMonth = (amount: number) => {
    const date = new Date(year, month - 1 + amount, 1);
    setCurrentDate(date);
  };

  const handleCheckIn = () => {
    if (!isCurrentMonth || checkedInToday) return;

    setAttendanceDates((prev) =>
      prev.includes(todayKey) ? prev : [...prev, todayKey],
    );
  };

  const handleReward = () => {
    if (!nextClaimableReward) return;

    claimAttendanceReward(
      getRewardKey(nextClaimableReward.days),
      nextClaimableReward.points,
    );
    setReceivedRewardPoints(nextClaimableReward.points);
    setShowRewardToast(true);
    setTimeout(() => setShowRewardToast(false), 1800);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.replace("/(tabs)")}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="출첵 닫기"
          >
            <Ionicons name="close" size={28} color="#5F6460" />
          </TouchableOpacity>
        </View>

        <View style={styles.monthRow}>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => changeMonth(-1)}
            accessibilityRole="button"
            accessibilityLabel="이전 달"
          >
            <Ionicons name="chevron-back" size={22} color="#787D79" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.monthButton}
            onPress={() => setPickerVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="월 선택"
          >
            <Text style={styles.monthText}>{`${year}년 ${month}월`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => changeMonth(1)}
            accessibilityRole="button"
            accessibilityLabel="다음 달"
          >
            <Ionicons name="chevron-forward" size={22} color="#787D79" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {WEEKDAYS.map((weekday) => (
            <Text key={weekday} style={styles.weekText}>
              {weekday}
            </Text>
          ))}
        </View>

        <View style={styles.calendar}>
          {days.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
            }

            const dateKey = getDateKey(year, month, day);
            const attended = attendanceSet.has(dateKey);
            const isToday = day === todayDate;
            const isPastUnattended = dateKey < todayKey;
            const isFuture = dateKey > todayKey;

            return (
              <View key={dateKey} style={styles.dayCell}>
                {isToday && !attended && (
                  <View style={styles.attendanceLabel}>
                    <Text style={styles.attendanceLabelText}>출석!</Text>
                  </View>
                )}
                {attended ? (
                  <AttendanceIcon width={35} height={35} />
                ) : (
                  <View
                    style={[
                      isPastUnattended && styles.dayCircle,
                      isToday && styles.todayCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isToday && styles.todayText,
                        isFuture && styles.futureText,
                      ]}
                    >
                      {day}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Text style={styles.dailyPoint}>하루 출석 +5P</Text>

        <View style={styles.summaryRow}>
          <View style={styles.monthCountCard}>
            <Text style={styles.cardTitle}>이번 달 출석:</Text>
            <Text style={styles.monthCount}>{monthAttendanceCount}일</Text>
          </View>

          <View style={styles.streakCard}>
            <Text style={styles.cardTitle}>연속 출석</Text>
            <View style={styles.rewardRow}>
              {REWARDS.map((reward) => {
                const reached = consecutiveDays >= reward.days;
                return (
                  <View key={reward.days} style={styles.rewardItem}>
                    <Text
                      style={[
                        styles.rewardPoint,
                        reached && styles.rewardPointActive,
                      ]}
                    >
                      {reward.points}P
                    </Text>
                    {reached ? (
                      <RewardAttendanceIcon width={35} height={35} />
                    ) : (
                      <View style={styles.rewardCircle}>
                        <Text style={styles.rewardDay}>{reward.days}일</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={styles.streakResetNote}>
          연속 출석은 매달 1일 초기화됩니다.
        </Text>

        <View
          style={[
            styles.actionRow,
            !isCurrentMonth && styles.hiddenActionRow,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.pixelButton,
              styles.rewardButton,
              !canClaimReward && styles.disabledButton,
            ]}
            disabled={!canClaimReward}
            onPress={handleReward}
            accessibilityRole="button"
            accessibilityLabel="출석 보상 받기"
          >
            <Text
              style={[
                styles.pixelButtonText,
                !canClaimReward && styles.disabledButtonText,
              ]}
            >
              받기!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.pixelButton,
              styles.checkButton,
              (!isCurrentMonth || checkedInToday) && styles.disabledButton,
            ]}
            disabled={!isCurrentMonth || checkedInToday}
            onPress={handleCheckIn}
            accessibilityRole="button"
            accessibilityLabel="출석하기"
          >
            <Text
              style={[
                styles.pixelButtonText,
                (!isCurrentMonth || checkedInToday) &&
                  styles.disabledButtonText,
              ]}
            >
              출석!
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showRewardToast && (
        <View style={styles.rewardToast}>
          <Text style={styles.rewardToastTitle}>코...</Text>
          <Text style={styles.rewardToastText}>
            ● +{receivedRewardPoints ?? 0}P
          </Text>
        </View>
      )}

      <AttendanceMonthPickerSheet
        visible={pickerVisible}
        year={year}
        month={month}
        onClose={() => setPickerVisible(false)}
        onSelect={(selectedYear, selectedMonth) => {
          setCurrentDate(new Date(selectedYear, selectedMonth - 1, 1));
        }}
      />
    </View>
  );
}
