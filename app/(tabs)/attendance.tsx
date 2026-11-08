import {
  useAttendance,
  useClaimAttendanceReward,
  useCreateAttendance,
} from "@/api/attendance";
import { getApiErrorMessage } from "@/api/types";
import AttendanceIcon from "@/assets/images/attendance/attendance_1.svg";
import RewardAttendanceIcon from "@/assets/images/attendance/attendance_2.svg";
import AttendanceActionButton from "@/components/attendance/AttendanceActionButton";
import AttendanceMonthPickerSheet from "@/components/attendance/AttendanceMonthPickerSheet";
import { attendanceStyles as styles } from "@/styles/attendance/Attendance.style";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
// TODO: 응답 rewards엔 보상 코인이 없어 정책(출석 포인트 수령 명세)의 값으로 표시. 정의되지 않은 단계(ex. 15일)는 코인 표기 생략
const REWARD_POINTS: Record<number, number> = { 5: 10, 10: 25, 20: 50, 30: 100 };
const DEFAULT_REWARDS = [5, 10, 20, 30].map((streakDays) => ({
  streakDays,
  achieved: false,
  claimed: false,
}));

const getDateKey = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

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

export default function Attendance() {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
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

  const { data: attendance } = useAttendance({ year, month });
  const createAttendance = useCreateAttendance();
  const claimReward = useClaimAttendanceReward();

  const attendanceSet = useMemo(
    () => new Set(attendance?.attendanceDates ?? []),
    [attendance?.attendanceDates],
  );
  const checkedInToday =
    attendance?.todayAttended ?? attendanceSet.has(todayKey);
  const days = useMemo(() => getMonthDays(year, month), [year, month]);
  const monthAttendanceCount = attendance?.attendanceCount ?? 0;
  const rewards = attendance?.rewards ?? DEFAULT_REWARDS;
  const canClaimReward =
    isCurrentMonth && !!attendance?.canClaimReward && !claimReward.isPending;
  const canCheckIn =
    isCurrentMonth && !!attendance && !checkedInToday && !createAttendance.isPending;

  const changeMonth = (amount: number) => {
    const date = new Date(year, month - 1 + amount, 1);
    setCurrentDate(date);
  };

  const handleCheckIn = () => {
    if (!canCheckIn) return;

    createAttendance.mutate(undefined, {
      onError: (error) => Alert.alert("출석 실패", getApiErrorMessage(error)),
    });
  };

  const handleReward = () => {
    if (!canClaimReward) return;

    claimReward.mutate(undefined, {
      onSuccess: ({ rewardCoin }) => {
        setReceivedRewardPoints(rewardCoin);
        setShowRewardToast(true);
        setTimeout(() => setShowRewardToast(false), 1800);
      },
      onError: (error) => Alert.alert("보상 받기 실패", getApiErrorMessage(error)),
    });
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
              {rewards.map((reward) => {
                const reached = reward.achieved;
                const points = REWARD_POINTS[reward.streakDays];
                return (
                  <View key={reward.streakDays} style={styles.rewardItem}>
                    <Text
                      style={[
                        styles.rewardPoint,
                        reached && styles.rewardPointActive,
                      ]}
                    >
                      {points !== undefined ? `${points}P` : ""}
                    </Text>
                    {reached ? (
                      <RewardAttendanceIcon width={35} height={35} />
                    ) : (
                      <View style={styles.rewardCircle}>
                        <Text style={styles.rewardDay}>{reward.streakDays}일</Text>
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
          <AttendanceActionButton
            title="받기!"
            variant="pink"
            disabled={!canClaimReward}
            onPress={handleReward}
            accessibilityLabel="출석 보상 받기"
          />
          <AttendanceActionButton
            title="출석!"
            variant="green"
            disabled={!canCheckIn}
            onPress={handleCheckIn}
            accessibilityLabel="출석하기"
          />
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
