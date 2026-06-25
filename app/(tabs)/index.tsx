import DnkwLogo from "@/assets/images/auth/dnkw-logo.svg";
import HomeActionCards from "@/components/home/HomeActionCards";
import HomeCharacter from "@/components/home/HomeCharacter";
import HomeGauge from "@/components/home/HomeGauge";
import { useAttendanceStore } from "@/stores/attendanceStore";
import { homeStyles as styles } from "@/styles/home/Home.style";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  const { points } = useAttendanceStore();
  const budget = 0;
  const spent = 0;

  const hasBudget = budget > 0;
  const percent = hasBudget ? spent / budget : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.heroSection}>
          <View style={styles.headerWrap}>
            <View style={styles.header}>
              <DnkwLogo width={72} height={28} />

              <View style={styles.coinWrap}>
                <View style={styles.coinCircle}>
                  <Text style={styles.coinIcon}>S</Text>
                </View>
                <Text style={styles.coinText}>{points}코인</Text>
              </View>
            </View>
          </View>

          <HomeCharacter hasBudget={hasBudget} spent={spent} percent={percent} />
        </View>

        <HomeGauge hasBudget={hasBudget} budget={budget} spent={spent} />
        <HomeActionCards hasBudget={hasBudget} />
      </ScrollView>
    </View>
  );
}
