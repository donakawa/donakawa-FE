import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

// ---------- Types (노션 API 명세서 > 로그) ----------

// 캘린더 type: 소비(BOUGHT) / 포기(DROPPED)
export type LogCalendarType = "BOUGHT" | "DROPPED";
export type GoalStatus = "COMPLETED" | "STOPPED";

// 기록이 없는 경우 "???"로 내려옴 (명세서 기준, 수정 중)
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN" | "???";

export type InProgressGoal = {
  title: string;
  moneyGoal: number;
  current: number;
  percent: number;
  needed: number;
};

export type LogMain = {
  summary: {
    since: string;
    // 30일 이상부터 달 단위, 30일 미만은 0
    period: number;
    totalSavings: number;
    // 진행 중인 목표가 없으면 null (목표 관리 조회 명세 기준으로 추정)
    inProgress: InProgressGoal | null;
  };
  last3months: {
    number: number;
    savings: number;
    coffee: number;
    minimumWage: number;
    chicken: number;
  };
  dayOfWeek: {
    WISHLISTED: DayOfWeek;
    BOUGHT: DayOfWeek;
    DROPPED: DayOfWeek;
  };
  rate: {
    BOUGHT: number;
    DROPPED: number;
  };
};

export type LogCalendarParams = {
  year: number;
  // 1~12
  month: number;
  type: LogCalendarType;
};

export type LogCalendarItem = { name: string; price: number; shop: string };

export type LogCalendarDay = {
  date: string;
  totalAmount: number;
  items: LogCalendarItem[];
};

export type LogCalendar = {
  year: number;
  month: number;
  type: LogCalendarType;
  calendar: LogCalendarDay[];
};

export type PastGoal = {
  id: number;
  title: string;
  moneyGoal: number;
  status: GoalStatus;
  createdAt: string;
  endedAt: string;
};

export type LogGoals = {
  inProgress: (InProgressGoal & { id: number }) | null;
  past: PastGoal[];
};

export type CreateGoalRequest = {
  title: string;
  moneyGoal: number;
  // 이월금액. 목표 금액보다 클 수 없음 (L003)
  current?: number;
};

export type CreateGoalResponse = {
  id: number;
  title: string;
  moneyGoal: number;
  current: number;
  // 명세서엔 이월금액으로 바로 달성된 COMPLETED 예시만 있어 진행 중 값은 미정 -> string 허용
  status: GoalStatus | (string & {});
  createdAt: string;
  // 진행 중인 목표는 종료일이 없을 것으로 추정
  endedAt: string | null;
};

export type UpdateGoalStatusRequest = { id: number; changeStatusTo: GoalStatus };

// ---------- API ----------

export const logApi = {
  getMain: async () => (await apiClient.get<ApiSuccess<LogMain>>(ENDPOINTS.log.root)).data.data,

  getCalendar: async (params: LogCalendarParams) =>
    (await apiClient.get<ApiSuccess<LogCalendar>>(ENDPOINTS.log.calendar, { params })).data
      .data,

  getGoals: async () =>
    (await apiClient.get<ApiSuccess<LogGoals>>(ENDPOINTS.log.goal)).data.data,

  createGoal: async (body: CreateGoalRequest) =>
    (await apiClient.post<ApiSuccess<CreateGoalResponse>>(ENDPOINTS.log.goal, body)).data.data,

  // 성공 시 204 (응답 바디 없음)
  updateGoalStatus: async (body: UpdateGoalStatusRequest) => {
    await apiClient.patch(ENDPOINTS.log.goal, body);
  },
};

// ---------- React Query ----------

export const logKeys = {
  all: ["log"] as const,
  main: ["log", "main"] as const,
  calendar: (params: LogCalendarParams) =>
    ["log", "calendar", params.year, params.month, params.type] as const,
  goals: ["log", "goals"] as const,
};

export const useLogMain = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: logKeys.main, queryFn: logApi.getMain, ...options });

export const useLogCalendar = (params: LogCalendarParams, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: logKeys.calendar(params),
    queryFn: () => logApi.getCalendar(params),
    ...options,
  });

export const useLogGoals = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: logKeys.goals, queryFn: logApi.getGoals, ...options });

// 목표 변경은 메인 요약(summary.inProgress)에도 반영되므로 둘 다 갱신
const invalidateGoalQueries = (queryClient: ReturnType<typeof useQueryClient>) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: logKeys.goals }),
    queryClient.invalidateQueries({ queryKey: logKeys.main }),
  ]);

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logApi.createGoal,
    onSuccess: () => invalidateGoalQueries(queryClient),
  });
};

export const useUpdateGoalStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logApi.updateGoalStatus,
    onSuccess: () => invalidateGoalQueries(queryClient),
  });
};
