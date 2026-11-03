import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { characterKeys } from "@/api/character";
import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

export type AttendanceParams = { year?: number; month?: number };

export type AttendanceReward = {
  streakDays: number;
  achieved: boolean;
  claimed: boolean;
};

export type Attendance = {
  year: number;
  month: number;
  attendanceDates: string[];
  attendanceCount: number;
  todayAttended?: boolean;
  canClaimReward?: boolean;
  rewards: AttendanceReward[];
};

export type ClaimAttendanceRewardResponse = { rewardCoin: number };

export const attendanceApi = {
  getAttendance: async (params?: AttendanceParams) =>
    (
      await apiClient.get<ApiSuccess<Attendance>>(ENDPOINTS.attendance.root, {
        params,
      })
    ).data.data,

  createAttendance: async () => {
    await apiClient.post(ENDPOINTS.attendance.root);
  },

  claimReward: async () =>
    (
      await apiClient.post<ApiSuccess<ClaimAttendanceRewardResponse>>(
        ENDPOINTS.attendance.rewards,
      )
    ).data.data,
};

export const attendanceKeys = {
  all: ["attendance"] as const,
  month: (params?: AttendanceParams) =>
    [
      "attendance",
      { year: params?.year ?? null, month: params?.month ?? null },
    ] as const,
};

export const useAttendance = (
  params?: AttendanceParams,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: attendanceKeys.month(params),
    queryFn: () => attendanceApi.getAttendance(params),
    ...options,
  });

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.createAttendance,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all }),
  });
};

export const useClaimAttendanceReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: attendanceApi.claimReward,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: attendanceKeys.all }),
        queryClient.invalidateQueries({ queryKey: characterKeys.info }),
      ]),
  });
};
