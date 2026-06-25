import { useSyncExternalStore } from "react";

type AttendanceStoreState = {
  points: number;
  claimedRewardKeys: string[];
};

const listeners = new Set<() => void>();

let state: AttendanceStoreState = {
  points: 24,
  claimedRewardKeys: [],
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
    points: state.points + points,
    claimedRewardKeys: [...state.claimedRewardKeys, rewardKey],
  };
  emit();
};
