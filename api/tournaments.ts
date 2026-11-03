import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";
import type { WishItemType } from "@/api/wishlist";

export const TOURNAMENT_ALLOWED_SIZES = [2, 4, 8, 16] as const;
export type TournamentSize = (typeof TOURNAMENT_ALLOWED_SIZES)[number];

export const isValidTournamentSize = (count: number): count is TournamentSize =>
  (TOURNAMENT_ALLOWED_SIZES as readonly number[]).includes(count);

export type TournamentStatus = "IN_PROGRESS" | "FINISHED";

export type TournamentWishItemRef = { wishItemId: number; type: WishItemType };

export type CreateTournamentRequest = {
  title: string;
  wishItems: TournamentWishItemRef[];
};

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
  winnerId: number | null;
};

export type TournamentDetail = {
  id: number;
  title: string;
  round: number;
  status: TournamentStatus;
  rounds: TournamentMatch[];
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

export type TournamentRound = {
  question: string;
  round: number;
  matchNumber: number;
  totalMatches: number;
  items: TournamentRoundItem[];
};

export type SelectTournamentItemRequest = { tournamentItemId: number };
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

export const tournamentsApi = {
  getTournaments: async () =>
    (await apiClient.get<ApiSuccess<TournamentSummary[]>>(ENDPOINTS.tournaments.root)).data
      .data,

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

  getRound: async (id: number) =>
    (await apiClient.get<ApiSuccess<TournamentRound>>(ENDPOINTS.tournaments.round(id))).data
      .data,

  selectItem: async ({ id, ...body }: SelectTournamentItemRequest & { id: number }) =>
    (
      await apiClient.post<ApiSuccess<SelectTournamentItemResponse>>(
        ENDPOINTS.tournaments.select(id),
        body,
      )
    ).data.data,

  getResult: async (id: number) =>
    (await apiClient.get<ApiSuccess<TournamentResult>>(ENDPOINTS.tournaments.result(id))).data
      .data,
};

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

export const useTournamentRound = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: tournamentsKeys.round(id),
    queryFn: () => tournamentsApi.getRound(id),
    staleTime: 0,
    retry: false,
    ...options,
  });

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

export const useSelectTournamentItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tournamentsApi.selectItem,
    onSuccess: ({ isFinished }, { id }) => {
      if (isFinished) {
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
