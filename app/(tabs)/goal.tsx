import { logPageStyles as styles } from "@/styles/log/Log.style";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

import GoalButton from "@/components/log/GoalButton";
import GoalCard from "@/components/log/GoalCard";
import ReceiptCard from "@/components/log/ReceiptCard";

import ArrowIcon from "@/assets/images/log/arrow_left.svg";
import FlagIcon from "@/assets/images/log/flag.svg";
import StopIcon from "@/assets/images/log/stop.svg";

export default function LogPage() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={{
            width: "100%",
            height: 48,
            flexDirection: "row",
            alignItems: "center",
            gap: 15,
          }}
        >
          <Pressable onPress={() => router.navigate("/log")}>
            <ArrowIcon />
          </Pressable>
          <Text style={styles.title}>Log</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.cardList}>
            <ReceiptCard variant="goal" />
            <View style={{ flexDirection: "row", gap: 9 }}>
              <GoalButton
                title="목표 중단"
                icon={<StopIcon />}
                onPress={() => {}}
              />

              <GoalButton
                title="새 목표 설정"
                icon={<FlagIcon />}
                onPress={() => {}}
              />
            </View>
            <View style={{ width: 335, gap: 12 }}>
              <Text
                style={{
                  color: "#5F6460",
                  fontFamily: "WantedSansMedium",
                  fontSize: 12,
                }}
              >
                지난 목표
              </Text>

              <View style={{ gap: 8 }}>
                <GoalCard
                  createdAt="2026.02"
                  title="사브리나 카펜터 향수"
                  amount="44,000"
                  finishedAt="2026.03"
                />

                <GoalCard
                  createdAt="2026.01"
                  title="주식 구매"
                  amount="88,000"
                  finishedAt="2026.02"
                />

                <GoalCard
                  createdAt="2025.12"
                  title="순금 한 돈"
                  amount="990,000"
                  finishedAt="2026.01"
                  isStopped
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
