import { useRouter } from "expo-router";

import { useDeleteTournament, useTournaments } from "@/api/tournaments";
import BuyOrNotMenu from "@/components/buyOrNot/BuyOrNotMenu";

interface TournamentMenuProps {
  visible: boolean;
  onClose: () => void;
}

export default function TournamentMenu({ visible, onClose }: TournamentMenuProps) {
  const router = useRouter();
  const { data: tournaments } = useTournaments({ enabled: visible });
  const deleteTournament = useDeleteTournament();

  return (
    <BuyOrNotMenu
      visible={visible}
      onClose={onClose}
      newButtonText="새 토너먼트 하기"
      historyTitle="토너먼트 기록"
      historyItems={(tournaments ?? []).map((tournament) => ({
        id: tournament.id,
        name: tournament.winnerName
          ? `${tournament.title} · ${tournament.winnerName}`
          : tournament.title,
      }))}
      onDeleteHistory={(id) => deleteTournament.mutateAsync(id)}
      onPressHistory={(id) => {
        onClose();
        router.push({ pathname: "/wish/tournament-play", params: { id: String(id) } });
      }}
      onPressNewRecommendation={() => {
        onClose();
        router.push("/wish/tournament-select");
      }}
    />
  );
}
