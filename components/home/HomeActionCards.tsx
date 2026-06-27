import BudgetIcon from "@/assets/images/home/budget.svg";
import NextIcon from "@/assets/images/home/next.svg";
import PricetagIcon from "@/assets/images/home/pricetag.svg";
import SoraIcon from "@/assets/images/home/sora.svg";
import TournamentIcon from "@/assets/images/home/tournament.svg";
import VsIcon from "@/assets/images/home/vsicon.svg";
import { actionStyles as styles } from "@/styles/home/Homecomponent.style";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface HomeActionCardsProps {
  hasBudget: boolean;
}

export default function HomeActionCards({ hasBudget }: HomeActionCardsProps) {
  if (hasBudget) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.actionOuterCard}
          onPress={() => router.push("/wish/buyornot-start" as never)}
        >
          <View style={styles.cardHighlight} />
          <View style={styles.actionInnerCard}>
            <View style={styles.actionTopRow}>
              <PricetagIcon width={14} height={14} />
              <Text style={styles.wideText}>살말 추천!</Text>
              <NextIcon width={14} height={14} />
            </View>
            <View style={styles.actionImageWrap}>
              <SoraIcon />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionOuterCard}>
          <View style={styles.cardHighlight} />
          <View style={styles.actionInnerCard}>
            <View style={styles.actionTopRow}>
              <TournamentIcon width={14} height={14} />
              <Text style={styles.wideText}>토너먼트</Text>
              <NextIcon width={14} height={14} />
            </View>
            <View style={styles.actionImageWrap}>
              <VsIcon />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftArea}>
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>
            예산 설정하고{"\n"}리포트 확인하기
          </Text>
          <View style={styles.tooltipTail} />
        </View>

        <TouchableOpacity
          style={styles.budgetOuterCard}
          onPress={() => router.push("/goal")}
        >
          <View style={styles.cardHighlight} />
          <View style={styles.innerCard}>
            <BudgetIcon />
            <Text style={styles.budgetText}>목표{"\n"}예산 설정</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.rightArea}>
        <TouchableOpacity
          style={styles.wideOuterCard}
          onPress={() => router.push("/wish/buyornot-start")}
        >
          <View style={styles.cardHighlight} />
          <View style={styles.wideInnerCard}>
            <PricetagIcon />
            <Text style={styles.wideText}>살말 추천!</Text>
            <NextIcon />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.wideOuterCard}>
          <View style={styles.cardHighlight} />
          <View style={styles.wideInnerCard}>
            <TournamentIcon />
            <Text style={styles.wideText}>토너먼트 하러 가기</Text>
            <NextIcon />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
