import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

export type ItemCategory = "SKIN" | "ACCESSORY" | "WALLPAPER" | "FLOOR";

export type EquippedItem = {
  itemId: number;
  itemKey: string;
  imageUrl: string;
};

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

export type CharacterComment = { conditionId: string; message: string };

export type CharacterItem = {
  itemId: number;
  name: string;
  price: number;
  imageUrl: string;
  owned: boolean;
  equipped: boolean;
};

export type PurchaseItemRequest = { itemId: number };

export type EquipItemsRequest = {
  skinId: number;
  accessoryId: number;
  wallpaperId: number;
  floorId: number;
};

export type CleanPooResponse = {
  rewardCoin: number;
  currentCoin: number;
  pooCount: number;
};

export const characterApi = {
  getCharacter: async () =>
    (await apiClient.get<ApiSuccess<Character>>(ENDPOINTS.character.root)).data
      .data,

  getComment: async () =>
    (
      await apiClient.get<ApiSuccess<CharacterComment>>(
        ENDPOINTS.character.comment,
      )
    ).data.data,

  getItems: async (category: ItemCategory) =>
    (
      await apiClient.get<ApiSuccess<{ items: CharacterItem[] }>>(
        ENDPOINTS.character.items,
        {
          params: { category },
        },
      )
    ).data.data.items,

  purchaseItem: async (body: PurchaseItemRequest) => {
    await apiClient.post(ENDPOINTS.character.purchase, body);
  },

  equipItems: async (body: EquipItemsRequest) => {
    await apiClient.patch(ENDPOINTS.character.equip, body);
  },

  cleanPoo: async () =>
    (
      await apiClient.post<ApiSuccess<CleanPooResponse>>(
        ENDPOINTS.character.pooClean,
      )
    ).data.data,
};

export const characterKeys = {
  all: ["character"] as const,
  info: ["character", "info"] as const,
  comment: ["character", "comment"] as const,
  itemsAll: ["character", "items"] as const,
  items: (category: ItemCategory) => ["character", "items", category] as const,
};

export const useCharacter = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: characterKeys.info,
    queryFn: characterApi.getCharacter,
    ...options,
  });

export const useCharacterComment = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: characterKeys.comment,
    queryFn: characterApi.getComment,
    ...options,
  });

export const useCharacterItems = (
  category: ItemCategory,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: characterKeys.items(category),
    queryFn: () => characterApi.getItems(category),
    ...options,
  });

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
  return useMutation({
    mutationFn: characterApi.purchaseItem,
    onSuccess: invalidate,
  });
};

export const useEquipItems = () => {
  const invalidate = useInvalidateCharacterItems();
  return useMutation({
    mutationFn: characterApi.equipItems,
    onSuccess: invalidate,
  });
};

export const useCleanPoo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: characterApi.cleanPoo,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: characterKeys.info }),
  });
};
