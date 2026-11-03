import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

// ---------- Types (노션 API 명세서 > 홈 > 햄꾸) ----------

export type ItemCategory = "SKIN" | "ACCESSORY" | "WALLPAPER" | "FLOOR";

export type EquippedItem = {
  itemId: number;
  itemKey: string; // ex. "SKIN_JUNGLE"
  imageUrl: string; // S3 presigned URL (1시간 만료)
};

// 카테고리별 기본 아이템은 회원가입 시 자동 구매/적용되므로 항상 존재
export type Character = {
  coin: number;
  pooCount: number;
  hamsterImageUrl: string;
  equipped: {
    skin: EquippedItem;
    accessory: EquippedItem;
    wallpaper: EquippedItem;
    floor: EquippedItem;
  };
};

// 조건에 해당하지 않으면 conditionId "DEFAULT", message ""
export type CharacterComment = { conditionId: string; message: string };

export type CharacterItem = {
  itemId: number;
  name: string;
  price: number;
  imageUrl: string;
  owned: boolean; // 보유 여부
  equipped: boolean; // 현재 적용 여부
};

export type PurchaseItemRequest = { itemId: number };

// 카테고리에 맞는 itemId를 보내야 함 (불일치 시 400 S005, 미보유 시 400 S006)
export type EquipItemsRequest = {
  skinId: number;
  accessoryId: number;
  wallpaperId: number;
  floorId: number;
};

export type CleanPooResponse = {
  rewardCoin: number; // 이번 청소로 받은 코인
  currentCoin: number; // 청소 후 보유 코인
  pooCount: number; // 청소 후 남은 똥 개수
};

// ---------- API ----------

export const characterApi = {
  getCharacter: async () =>
    (await apiClient.get<ApiSuccess<Character>>(ENDPOINTS.character.root)).data.data,

  getComment: async () =>
    (await apiClient.get<ApiSuccess<CharacterComment>>(ENDPOINTS.character.comment)).data.data,

  getItems: async (category: ItemCategory) =>
    (
      await apiClient.get<ApiSuccess<{ items: CharacterItem[] }>>(ENDPOINTS.character.items, {
        params: { category },
      })
    ).data.data.items,

  // 없는 아이템 404 (S001), 기본 아이템/코인 부족 400 (S002), 이미 보유 409 (S003)
  purchaseItem: async (body: PurchaseItemRequest) => {
    await apiClient.post(ENDPOINTS.character.purchase, body);
  },

  equipItems: async (body: EquipItemsRequest) => {
    await apiClient.patch(ENDPOINTS.character.equip, body);
  },

  // 청소할 것이 없으면 400 (P001)
  cleanPoo: async () =>
    (await apiClient.post<ApiSuccess<CleanPooResponse>>(ENDPOINTS.character.pooClean)).data
      .data,
};

// ---------- React Query ----------

export const characterKeys = {
  all: ["character"] as const,
  info: ["character", "info"] as const,
  comment: ["character", "comment"] as const,
  itemsAll: ["character", "items"] as const,
  items: (category: ItemCategory) => ["character", "items", category] as const,
};

export const useCharacter = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: characterKeys.info, queryFn: characterApi.getCharacter, ...options });

export const useCharacterComment = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: characterKeys.comment, queryFn: characterApi.getComment, ...options });

export const useCharacterItems = (category: ItemCategory, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: characterKeys.items(category),
    queryFn: () => characterApi.getItems(category),
    ...options,
  });

// 구매/적용 시 코인·적용 아이템(info)과 보유/적용 여부(items)가 바뀜
const useInvalidateCharacterItems = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: characterKeys.info }),
      queryClient.invalidateQueries({ queryKey: characterKeys.itemsAll }),
    ]);
};

export const usePurchaseItem = () => {
  const invalidate = useInvalidateCharacterItems();
  return useMutation({ mutationFn: characterApi.purchaseItem, onSuccess: invalidate });
};

export const useEquipItems = () => {
  const invalidate = useInvalidateCharacterItems();
  return useMutation({ mutationFn: characterApi.equipItems, onSuccess: invalidate });
};

export const useCleanPoo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterApi.cleanPoo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: characterKeys.info }),
  });
};
