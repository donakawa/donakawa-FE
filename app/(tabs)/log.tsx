import { logPageStyles as styles } from "@/styles/log/Log.style";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import DefenseCard from "@/components/log/DefenseCard";
import ReceiptCard from "@/components/log/ReceiptCard";
import TopDayCard from "@/components/log/TopDayCard";
import ValueCard from "@/components/log/ValueCard";

import ArrowIcon from "@/assets/images/log/arrow_right.svg";
import CalendarIcon from "@/assets/images/log/calendar.svg";

export default function LogPage() {
  const handleGoalPress = () => {
    router.push("/goal");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Log</Text>
          <CalendarIcon style={styles.calendarImage} />
        </View>

        <View style={styles.cardContainer}>
          <Pressable style={styles.goalManageWrap} onPress={handleGoalPress}>
            <Text style={styles.goalManageText}>목표 관리</Text>
            <ArrowIcon style={styles.arrowImage} />
          </Pressable>

          <View style={styles.cardList}>
            <ReceiptCard />
            <DefenseCard />
            <TopDayCard />
            <ValueCard />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
