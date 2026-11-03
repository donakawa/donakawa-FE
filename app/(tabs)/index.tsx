import { useGoalBudget, useGoalSpend } from "@/api/goals";
import DnkwLogo from "@/assets/images/auth/dnkw-logo.svg";
import HomeActionCards from "@/components/home/HomeActionCards";
import HomeCharacter from "@/components/home/HomeCharacter";
import HomeGauge from "@/components/home/HomeGauge";
import { useHamkkuAppearance } from "@/components/home/hamkkuAppearance";
import { homeStyles as styles } from "@/styles/home/Home.style";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  const { character, wall } = useHamkkuAppearance();
  const { data: goalBudget } = useGoalBudget();
  const { data: goalSpend } = useGoalSpend({ enabled: !!goalBudget });

  const budget = goalBudget?.shoppingBudget ?? 0;
  const spent = goalSpend?.totalSpend ?? 0;
  const wallColor = wall?.color ?? "#F0FFE5";

  const hasBudget = budget > 0;
  const percent = hasBudget ? spent / budget : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.heroSection, { backgroundColor: wallColor }]}>
          <View style={[styles.headerWrap, { backgroundColor: wallColor }]}>
            <View style={styles.header}>
              <DnkwLogo width={72} height={28} />

              <View style={styles.coinWrap}>
                <View style={styles.coinCircle}>
                  <Text style={styles.coinIcon}>S</Text>
                </View>
                <Text style={styles.coinText}>{character?.coin ?? 0}코인</Text>
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
