import { logPageStyles as styles } from "@/styles/log/Log.style";
import { ScrollView, Text, View } from "react-native";

import DefenseCard from "@/components/log/DefenseCard";
import ReceiptCard from "@/components/log/ReceiptCard";
import TopDayCard from "@/components/log/TopDayCard";
import ValueCard from "@/components/log/ValueCard";

import ArrowIcon from "@/assets/images/arrow_right.svg";
import CalendarIcon from "@/assets/images/calendar.svg";

export default function LogPage() {
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
          <View style={styles.goalManageWrap}>
            <Text style={styles.goalManageText}>목표 관리</Text>
            <ArrowIcon style={styles.arrowImage} />
          </View>

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
