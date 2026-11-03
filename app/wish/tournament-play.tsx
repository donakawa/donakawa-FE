import {
  useSelectTournamentItem,
  useTournament,
  useTournamentResult,
  useTournamentRound,
} from "@/api/tournaments";
import { getApiErrorMessage } from "@/api/types";
import ChoiceButton from "@/components/buyOrNot/ChoiceButton";
import SpeechBubble from "@/components/common/SpeechBubble";
import TournamentMenu from "@/components/wish/TournamentMenu";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import WishItemCard from "@/components/wish/WishItemCard";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function TournamentPlayScreen() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = Number(idParam);
  const hasId = Number.isFinite(id);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [finishedLocally, setFinishedLocally] = useState(false);

  const tournamentQuery = useTournament(id, { enabled: hasId });
  const isFinished = finishedLocally || tournamentQuery.data?.status === "FINISHED";

  const roundQuery = useTournamentRound(id, {
    enabled: hasId && tournamentQuery.data?.status === "IN_PROGRESS" && !finishedLocally,
  });
  const resultQuery = useTournamentResult(id, { enabled: hasId && isFinished });
  const selectItem = useSelectTournamentItem();

  const round = roundQuery.data;
  const winner = resultQuery.data?.item;

  const handleSelect = (tournamentItemId: number) => {
    if (selectItem.isPending) return;
    selectItem.mutate(
      { id, tournamentItemId },
      {
        onSuccess: ({ isFinished: done }) => {
          if (done) setFinishedLocally(true);
        },
        onError: (error) => Alert.alert("선택 실패", getApiErrorMessage(error)),
      },
    );
  };

  const isLoading = isFinished ? resultQuery.isLoading : tournamentQuery.isLoading || roundQuery.isLoading;
  const loadError = isFinished ? resultQuery.error : (tournamentQuery.error ?? roundQuery.error);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar
        onBack={() => router.back()}
        rightVariant="menu"
        onRightPress={() => setIsMenuVisible(true)}
      />

      <View style={styles.mainPanel}>
        <WishFlowTitleBanner
          title="토너먼트"
          subtitle={isFinished ? "당신의 최종선택은?" : round ? `${round.round}강` : undefined}
          topRadius
        />

        <View style={styles.body}>
          {isLoading ? (
            <ActivityIndicator style={styles.loading} color="#7EC985" />
          ) : loadError || !hasId ? (
            <View style={styles.center}>
              <Text style={styles.errorText}>{getApiErrorMessage(loadError, "토너먼트를 불러오지 못했어요.")}</Text>
              <ChoiceButton text="돌아가기" onPress={() => router.back()} />
            </View>
          ) : isFinished && winner ? (
            <ScrollView contentContainerStyle={styles.resultArea}>
              <SpeechBubble text={"고민 끝!\n이 위시템이 최종 선택이야!"} />

              <Image
                source={require("@/assets/images/tournament/hamster.png")}
                style={styles.hamster}
                resizeMode="contain"
              />

              <View style={styles.winnerCard}>
                <WishItemCard
                  name={winner.name}
                  price={winner.price}
                  image={winner.imageUrl ?? undefined}
                  onPress={() =>
                    router.push({
                      pathname: "/wish/item",
                      params: { id: String(winner.wishItemId), type: winner.type },
                    })
                  }
                />
              </View>

              <View style={styles.buttonArea}>
                <ChoiceButton
                  text="위시템 보러 가기"
                  onPress={() =>
                    router.push({
                      pathname: "/wish/item",
                      params: { id: String(winner.wishItemId), type: winner.type },
                    })
                  }
                />
                <ChoiceButton
                  text="새 토너먼트 하기"
                  onPress={() => router.replace("/wish/tournament-select")}
                />
              </View>
            </ScrollView>
          ) : round ? (
            <View style={styles.matchArea}>
              <Text style={styles.progressText}>
                {round.matchNumber} / {round.totalMatches}
              </Text>

              <SpeechBubble text={round.question} />

              <View style={styles.matchRow}>
                {round.items.map((item, index) => (
                  <View key={item.tournamentItemId} style={styles.matchSlot}>
                    {index === 1 && <Text style={styles.vsText}>VS</Text>}
                    <WishItemCard
                      name={item.name}
                      price={item.price}
                      image={item.imageUrl ?? undefined}
                      onPress={() => handleSelect(item.tournamentItemId)}
                    />
                  </View>
                ))}
              </View>

              <Text style={styles.helperText}>
                {selectItem.isPending ? "다음 대결을 준비 중이에요..." : "*더 갖고 싶은 위시템을 터치해 주세요."}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <TournamentMenu visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  mainPanel: {
    flex: 1,
    backgroundColor: "#F0FFE5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  loading: {
    marginTop: 80,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  errorText: {
    color: "#787D79",
    fontSize: 14,
    fontFamily: "Galmuri9",
    textAlign: "center",
  },
  matchArea: {
    flex: 1,
    alignItems: "center",
    gap: 24,
  },
  progressText: {
    alignSelf: "flex-end",
    color: "#AAAFAB",
    fontSize: 12,
    fontFamily: "Galmuri9",
    lineHeight: 18,
  },
  matchRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    gap: 7,
  },
  matchSlot: {
    flex: 1,
  },
  vsText: {
    position: "absolute",
    top: 70,
    left: -17,
    zIndex: 1,
    color: "#E67972",
    fontSize: 16,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
  },
  helperText: {
    color: "#AAAFAB",
    fontSize: 12,
    fontFamily: "Galmuri9",
  },
  resultArea: {
    alignItems: "center",
  },
  hamster: {
    width: 87,
    height: 109,
    marginTop: 8,
  },
  winnerCard: {
    width: 164,
    marginTop: 12,
  },
  buttonArea: {
    marginTop: 24,
    gap: 12,
  },
});
