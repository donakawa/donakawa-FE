import { useSyncExternalStore } from "react";

// TODO: 햄꾸 닉네임 조회/수정 API가 명세서에 없어 로컬 상태로만 유지 (앱 재시작 시 초기화)
type AttendanceStoreState = {
  hamkkuNickname: string;
};

const listeners = new Set<() => void>();

let state: AttendanceStoreState = {
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

export const updateHamkkuNickname = (nickname: string) => {
  const nextNickname = nickname.trim().slice(0, 10);
  if (!nextNickname) return;

  state = {
    ...state,
    hamkkuNickname: nextNickname,
  };
  emit();
};
