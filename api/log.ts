import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

export type LogCalendarType = "BOUGHT" | "DROPPED";
export type GoalStatus = "COMPLETED" | "STOPPED";

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
    period: number;
    totalSavings: number;
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
  current?: number;
};

export type CreateGoalResponse = {
  id: number;
  title: string;
  moneyGoal: number;
  current: number;
  status: GoalStatus | (string & {});
  createdAt: string;
  endedAt: string | null;
};

export type UpdateGoalStatusRequest = { id: number; changeStatusTo: GoalStatus };

export const logApi = {
  getMain: async () => (await apiClient.get<ApiSuccess<LogMain>>(ENDPOINTS.log.root)).data.data,

  getCalendar: async (params: LogCalendarParams) =>
    (await apiClient.get<ApiSuccess<LogCalendar>>(ENDPOINTS.log.calendar, { params })).data
      .data,

  getGoals: async () =>
    (await apiClient.get<ApiSuccess<LogGoals>>(ENDPOINTS.log.goal)).data.data,

  createGoal: async (body: CreateGoalRequest) =>
    (await apiClient.post<ApiSuccess<CreateGoalResponse>>(ENDPOINTS.log.goal, body)).data.data,

  updateGoalStatus: async (body: UpdateGoalStatusRequest) => {
    await apiClient.patch(ENDPOINTS.log.goal, body);
  },
};

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
