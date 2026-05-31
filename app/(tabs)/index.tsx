import DnkwLogo from "@/assets/images/auth/dnkw-logo.svg";
import HomeActionCards from "@/components/home/HomeActionCards";
import HomeCharacter from "@/components/home/HomeCharacter";
import HomeGauge from "@/components/home/HomeGauge";
import { homeStyles as styles } from "@/styles/home/Home.style";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  const budget = 10000;
  const spent = 5000;

  const hasBudget = budget > 0;
  const percent = hasBudget ? spent / budget : 0;

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <View style={styles.header}>
          <DnkwLogo width={72} height={28} />

          <View style={styles.coinWrap}>
            <View style={styles.coinCircle}>
              <Text style={styles.coinIcon}>S</Text>
            </View>
            <Text style={styles.coinText}>24코인</Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HomeCharacter hasBudget={hasBudget} spent={spent} percent={percent} />
        <HomeGauge hasBudget={hasBudget} budget={budget} spent={spent} />
        <HomeActionCards hasBudget={hasBudget} />
      </ScrollView>
    </View>
  );
}