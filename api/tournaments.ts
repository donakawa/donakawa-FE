import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";
import type { WishItemType } from "@/api/wishlist";

// ---------- Types (노션 API 명세서 > 토너먼트) ----------

// 명세서상 참가 아이템 수는 2, 4, 8, 16 중 하나여야 함 (아니면 T001 에러)
export const TOURNAMENT_ALLOWED_SIZES = [2, 4, 8, 16] as const;
export type TournamentSize = (typeof TOURNAMENT_ALLOWED_SIZES)[number];

export const isValidTournamentSize = (count: number): count is TournamentSize =>
  (TOURNAMENT_ALLOWED_SIZES as readonly number[]).includes(count);

// 명세서 예시에는 IN_PROGRESS / FINISHED만 등장
export type TournamentStatus = "IN_PROGRESS" | "FINISHED";

export type TournamentWishItemRef = { wishItemId: number; type: WishItemType };

export type CreateTournamentRequest = {
  title: string;
  wishItems: TournamentWishItemRef[];
};

// round = 몇강인지 (= 참가 아이템 수)
export type CreateTournamentResponse = {
  id: number;
  title: string;
  round: number;
  createdAt: string;
};

export type TournamentSummary = {
  id: number;
  title: string;
  round: number;
  status: TournamentStatus;
  // 진행 중인 토너먼트는 우승자가 없을 수 있어 nullable로 둠 (명세서 미기재)
  winnerName: string | null;
  createdAt: string;
};

export type TournamentMatchItem = {
  tournamentItemId: number;
  name: string;
  price: number;
};

export type TournamentMatch = {
  round: number;
  matchNumber: number;
  items: TournamentMatchItem[];
  // 아직 선택하지 않은 대결은 null일 수 있음 (명세서 미기재)
  winnerId: number | null;
};

export type TournamentDetail = {
  id: number;
  title: string;
  round: number;
  status: TournamentStatus;
  rounds: TournamentMatch[];
  // 명세서 예시는 진행 중이라 null만 나옴. 종료 시 형태는 미기재라 최종 선택 조회와 같은 형태로 가정
  winner: TournamentResultItem | null;
  createdAt: string;
};

export type TournamentRoundItem = {
  tournamentItemId: number;
  wishItemId: number;
  type: WishItemType;
  name: string;
  price: number;
  imageUrl: string | null;
};

// 고정 질문 + 몇강 + 대결 상품 2개
export type TournamentRound = {
  question: string;
  round: number;
  matchNumber: number;
  totalMatches: number;
  items: TournamentRoundItem[];
};

export type SelectTournamentItemRequest = { tournamentItemId: number };
// true면 토너먼트 종료 → result 조회 가능
export type SelectTournamentItemResponse = { isFinished: boolean };

export type TournamentResultItem = {
  wishItemId: number;
  type: WishItemType;
  name: string;
  price: number;
  imageUrl: string | null;
};

export type TournamentResult = { item: TournamentResultItem };

export type DeleteTournamentResponse = { message: string };

// ---------- API ----------

export const tournamentsApi = {
  getTournaments: async () =>
    (await apiClient.get<ApiSuccess<TournamentSummary[]>>(ENDPOINTS.tournaments.root)).data
      .data,

  // 아이템 수가 2/4/8/16이 아니면 T001, 없는 위시 아이템이 있으면 T002 에러
  createTournament: async (body: CreateTournamentRequest) =>
    (
      await apiClient.post<ApiSuccess<CreateTournamentResponse>>(
        ENDPOINTS.tournaments.root,
        body,
      )
    ).data.data,

  getTournament: async (id: number) =>
    (await apiClient.get<ApiSuccess<TournamentDetail>>(ENDPOINTS.tournaments.detail(id))).data
      .data,

  deleteTournament: async (id: number) =>
    (
      await apiClient.delete<ApiSuccess<DeleteTournamentResponse>>(
        ENDPOINTS.tournaments.detail(id),
      )
    ).data.data,

  // 현재 진행할 대결 조회. 이미 종료된 토너먼트면 T004 에러
  getRound: async (id: number) =>
    (await apiClient.get<ApiSuccess<TournamentRound>>(ENDPOINTS.tournaments.round(id))).data
      .data,

  // 종료된 토너먼트면 T004, 현재 대결에 없는 아이템이면 T005 에러
  selectItem: async ({ id, ...body }: SelectTournamentItemRequest & { id: number }) =>
    (
      await apiClient.post<ApiSuccess<SelectTournamentItemResponse>>(
        ENDPOINTS.tournaments.select(id),
        body,
      )
    ).data.data,

  // 토너먼트가 끝나지 않았으면 T006 에러
  getResult: async (id: number) =>
    (await apiClient.get<ApiSuccess<TournamentResult>>(ENDPOINTS.tournaments.result(id))).data
      .data,
};

// ---------- React Query ----------

export const tournamentsKeys = {
  all: ["tournaments"] as const,
  list: ["tournaments", "list"] as const,
  detail: (id: number) => ["tournaments", "detail", id] as const,
  round: (id: number) => ["tournaments", "round", id] as const,
  result: (id: number) => ["tournaments", "result", id] as const,
};

export const useTournaments = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: tournamentsKeys.list,
    queryFn: tournamentsApi.getTournaments,
    ...options,
  });

export const useTournament = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: tournamentsKeys.detail(id),
    queryFn: () => tournamentsApi.getTournament(id),
    ...options,
  });

// 선택 직후 다음 대결을 바로 받아와야 하므로 캐시를 쓰지 않음
export const useTournamentRound = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: tournamentsKeys.round(id),
    queryFn: () => tournamentsApi.getRound(id),
    staleTime: 0,
    retry: false,
    ...options,
  });

// 종료된 토너먼트의 결과는 바뀌지 않으므로 한 번 받은 결과는 다시 요청하지 않음
export const useTournamentResult = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: tournamentsKeys.result(id),
    queryFn: () => tournamentsApi.getResult(id),
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tournamentsApi.createTournament,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tournamentsKeys.list }),
  });
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tournamentsApi.deleteTournament,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: tournamentsKeys.detail(id) });
      queryClient.removeQueries({ queryKey: tournamentsKeys.round(id) });
      queryClient.removeQueries({ queryKey: tournamentsKeys.result(id) });
      return queryClient.invalidateQueries({ queryKey: tournamentsKeys.list });
    },
  });
};

// 선택 저장 후 다음 대결/상세(rounds, status)를 다시 받아옴. 종료 시 목록(status, winnerName)도 갱신
// 명세서상 토너먼트 선택은 위시 아이템 상태(구매/드랍)를 바꾸지 않으므로 위시리스트 캐시는 건드리지 않음
export const useSelectTournamentItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tournamentsApi.selectItem,
    onSuccess: ({ isFinished }, { id }) => {
      if (isFinished) {
        // 종료 후 라운드를 다시 요청하면 T004 에러가 나므로 refetch 대신 캐시 제거
        queryClient.removeQueries({ queryKey: tournamentsKeys.round(id) });
        return Promise.all([
          queryClient.invalidateQueries({ queryKey: tournamentsKeys.detail(id) }),
          queryClient.invalidateQueries({ queryKey: tournamentsKeys.list }),
        ]);
      }
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: tournamentsKeys.round(id) }),
        queryClient.invalidateQueries({ queryKey: tournamentsKeys.detail(id) }),
      ]);
    },
  });
};
