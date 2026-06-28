import { useSyncExternalStore } from "react";
import {
  DEFAULT_HAMKKU_SELECTION,
  DEFAULT_OWNED_HAMKKU_ITEM_IDS,
  type HamkkuCategory,
} from "@/constants/hamkku";

type AttendanceStoreState = {
  points: number;
  claimedRewardKeys: string[];
  ownedHamkkuItemIds: string[];
  appliedHamkku: Record<HamkkuCategory, string>;
  hamkkuNickname: string;
};

const listeners = new Set<() => void>();

let state: AttendanceStoreState = {
  points: 24,
  claimedRewardKeys: [],
  ownedHamkkuItemIds: DEFAULT_OWNED_HAMKKU_ITEM_IDS,
  appliedHamkku: DEFAULT_HAMKKU_SELECTION,
  hamkkuNickname: "프리더햄토",
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => state;

export const useAttendanceStore = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const claimAttendanceReward = (rewardKey: string, points: number) => {
  if (state.claimedRewardKeys.includes(rewardKey)) return;

  state = {
    ...state,
    points: state.points + points,
    claimedRewardKeys: [...state.claimedRewardKeys, rewardKey],
  };
  emit();
};

export const purchaseHamkkuItem = (itemId: string, price: number) => {
  if (state.ownedHamkkuItemIds.includes(itemId)) return true;
  if (state.points < price) return false;

  state = {
    ...state,
    points: state.points - price,
    ownedHamkkuItemIds: [...state.ownedHamkkuItemIds, itemId],
  };
  emit();
  return true;
};

export const applyHamkkuItems = (nextAppliedHamkku: Record<HamkkuCategory, string>) => {
  const canApply = Object.values(nextAppliedHamkku).every((itemId) =>
    state.ownedHamkkuItemIds.includes(itemId),
  );

  if (!canApply) return false;

  state = {
    ...state,
    appliedHamkku: nextAppliedHamkku,
  };
  emit();
  return true;
};

export const updateHamkkuNickname = (nickname: string) => {
  const nextNickname = nickname.trim().slice(0, 10);
  if (!nextNickname) return;

  state = {
    ...state,
    hamkkuNickname: nextNickname,
  };
  emit();
};
