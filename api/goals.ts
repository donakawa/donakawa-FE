import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { characterKeys } from "@/api/character";
import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

// ---------- Types (노션 API 명세서 > 예산설정, 홈) ----------

// 1: 자산 형성 전략, 2: 균형 지출 전략, 3: 자유 지출 전략
export type SpendStrategy = 1 | 2 | 3;

export type GoalBudget = {
  id: string;
  monthlyIncome: number; // 월 수입
  incomeDate: number; // 갱신일 (1~31, 미입력 시 서버에서 1일 처리)
  // 선택 입력 항목이라 미입력 시 null로 내려올 수 있음 (명세서 예시엔 항상 값 있음)
  fixedExpense: number | null; // 고정비
  monthlySaving: number | null; // 저축액
  spendStrategy: SpendStrategy; // 소비 전략
  shoppingBudget: number; // 온라인 쇼핑 목표액
};

// 월 수입, 소비 전략, 온라인 쇼핑 목표액 필수 / 나머지는 선택
export type SetGoalBudgetRequest = {
  monthlyIncome: number;
  incomeDate?: number;
  fixedExpense?: number;
  monthlySaving?: number;
  spendStrategy: SpendStrategy;
  shoppingBudget: number;
};

// 소비 전략은 수정 불가, 나머지는 바꿀 항목만 보냄
export type UpdateGoalBudgetRequest = Partial<Omit<SetGoalBudgetRequest, "spendStrategy">>;

// 월 수입, 소비 전략 필수 / 고정비, 저축액 선택
export type CalculateBudgetRequest = {
  monthlyIncome: number;
  fixedExpense?: number;
  monthlySaving?: number;
  spendStrategy: SpendStrategy;
};
export type CalculateBudgetResponse = { shoppingBudget: number };

// 소비 + 남은 예산 = 온라인 쇼핑 목표액 (갱신일마다 초기화)
export type GoalSpend = {
  totalSpend: number; // 이전 갱신일부터 현재까지 소비 금액
  remainingBudget: number; // 남은 예산
};

// ---------- API ----------

export const goalsApi = {
  // 등록된 목표 예산이 없으면 404 (B003)
  getBudget: async () =>
    (await apiClient.get<ApiSuccess<GoalBudget>>(ENDPOINTS.goals.budget)).data.data,

  // 최초 1회만 가능. 이미 있으면 409 (B001) → 수정/재설정 사용
  createBudget: async (body: SetGoalBudgetRequest) =>
    (await apiClient.post<ApiSuccess<GoalBudget>>(ENDPOINTS.goals.budget, body)).data.data,

  updateBudget: async (body: UpdateGoalBudgetRequest) =>
    (await apiClient.patch<ApiSuccess<GoalBudget>>(ENDPOINTS.goals.budget, body)).data.data,

  // 소비 전략까지 포함해 전체를 다시 설정
  resetBudget: async (body: SetGoalBudgetRequest) =>
    (await apiClient.put<ApiSuccess<GoalBudget>>(ENDPOINTS.goals.budget, body)).data.data,

  // 저장하지 않고 추천 온라인 쇼핑 목표액만 계산
  calculateBudget: async (body: CalculateBudgetRequest) =>
    (
      await apiClient.post<ApiSuccess<CalculateBudgetResponse>>(
        ENDPOINTS.goals.budgetCalculate,
        body,
      )
    ).data.data,

  // 등록된 목표 예산이 없으면 404 (B003)
  getSpend: async () =>
    (await apiClient.get<ApiSuccess<GoalSpend>>(ENDPOINTS.goals.spend)).data.data,
};

// ---------- React Query ----------

export const goalsKeys = {
  all: ["goals"] as const,
  budget: ["goals", "budget"] as const,
  spend: ["goals", "spend"] as const,
};

export const useGoalBudget = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: goalsKeys.budget, queryFn: goalsApi.getBudget, ...options });

export const useGoalSpend = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: goalsKeys.spend, queryFn: goalsApi.getSpend, ...options });

// 예산이 바뀌면 남은 예산(spend)과 도나햄 한마디(예산 조건 기반)도 달라질 수 있음
const useInvalidateBudget = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: goalsKeys.all }),
      queryClient.invalidateQueries({ queryKey: characterKeys.comment }),
    ]);
};

export const useCreateGoalBudget = () => {
  const invalidate = useInvalidateBudget();
  return useMutation({ mutationFn: goalsApi.createBudget, onSuccess: invalidate });
};

export const useUpdateGoalBudget = () => {
  const invalidate = useInvalidateBudget();
  return useMutation({ mutationFn: goalsApi.updateBudget, onSuccess: invalidate });
};

export const useResetGoalBudget = () => {
  const invalidate = useInvalidateBudget();
  return useMutation({ mutationFn: goalsApi.resetBudget, onSuccess: invalidate });
};

export const useCalculateBudget = () => useMutation({ mutationFn: goalsApi.calculateBudget });
