import { logPageStyles as styles } from "@/styles/log/Log.style";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useMe } from "@/api/auth";
import { useLogMain } from "@/api/log";
import Header from "@/components/common/Header";
import DefenseCard from "@/components/log/DefenseCard";
import ReceiptCard from "@/components/log/ReceiptCard";
import TopDayCard from "@/components/log/TopDayCard";
import ValueCard from "@/components/log/ValueCard";

import ArrowIcon from "@/assets/images/log/arrow_right.svg";
import CalendarIcon from "@/assets/images/log/calendar.svg";

export default function LogPage() {
  const { data: me } = useMe();
  const { data: log } = useLogMain();
  const handleGoalPress = () => {
    router.push("/goal");
  };

  const handleCalendarPress = () => {
    router.push("/logCalendar");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="Log"
          rightElement={
            <Pressable onPress={handleCalendarPress}>
              <CalendarIcon style={styles.calendarImage} />
            </Pressable>
          }
        />

        <View style={styles.cardContainer}>
          <Pressable style={styles.goalManageWrap} onPress={handleGoalPress}>
            <Text style={styles.goalManageText}>목표 관리</Text>
            <ArrowIcon style={styles.arrowImage} />
          </Pressable>

          <View style={styles.cardList}>
            <ReceiptCard
              goal={log?.summary.inProgress ?? null}
              since={log?.summary.since}
              period={log?.summary.period}
              totalSavings={log?.summary.totalSavings}
            />
            <DefenseCard {...log?.last3months} />
            <TopDayCard
              nickname={me?.nickname}
              wishlisted={log?.dayOfWeek.WISHLISTED}
              bought={log?.dayOfWeek.BOUGHT}
              dropped={log?.dayOfWeek.DROPPED}
            />
            <ValueCard
              boughtRate={log?.rate.BOUGHT}
              droppedRate={log?.rate.DROPPED}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
