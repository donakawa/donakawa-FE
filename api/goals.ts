import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { characterKeys } from "@/api/character";
import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

export type SpendStrategy = 1 | 2 | 3;

export type GoalBudget = {
  id: string;
  monthlyIncome: number;
  incomeDate: number;
  fixedExpense: number | null;
  monthlySaving: number | null;
  spendStrategy: SpendStrategy;
  shoppingBudget: number;
};

export type SetGoalBudgetRequest = {
  monthlyIncome: number;
  incomeDate?: number;
  fixedExpense?: number;
  monthlySaving?: number;
  spendStrategy: SpendStrategy;
  shoppingBudget: number;
};

export type UpdateGoalBudgetRequest = Partial<
  Omit<SetGoalBudgetRequest, "spendStrategy">
>;

export type CalculateBudgetRequest = {
  monthlyIncome: number;
  fixedExpense?: number;
  monthlySaving?: number;
  spendStrategy: SpendStrategy;
};
export type CalculateBudgetResponse = { shoppingBudget: number };

export type GoalSpend = {
  totalSpend: number;
  remainingBudget: number;
};

export const goalsApi = {
  getBudget: async () =>
    (await apiClient.get<ApiSuccess<GoalBudget>>(ENDPOINTS.goals.budget)).data
      .data,

  createBudget: async (body: SetGoalBudgetRequest) =>
    (await apiClient.post<ApiSuccess<GoalBudget>>(ENDPOINTS.goals.budget, body))
      .data.data,

  updateBudget: async (body: UpdateGoalBudgetRequest) =>
    (
      await apiClient.patch<ApiSuccess<GoalBudget>>(
        ENDPOINTS.goals.budget,
        body,
      )
    ).data.data,

  resetBudget: async (body: SetGoalBudgetRequest) =>
    (await apiClient.put<ApiSuccess<GoalBudget>>(ENDPOINTS.goals.budget, body))
      .data.data,

  calculateBudget: async (body: CalculateBudgetRequest) =>
    (
      await apiClient.post<ApiSuccess<CalculateBudgetResponse>>(
        ENDPOINTS.goals.budgetCalculate,
        body,
      )
    ).data.data,

  getSpend: async () =>
    (await apiClient.get<ApiSuccess<GoalSpend>>(ENDPOINTS.goals.spend)).data
      .data,
};

export const goalsKeys = {
  all: ["goals"] as const,
  budget: ["goals", "budget"] as const,
  spend: ["goals", "spend"] as const,
};

export const useGoalBudget = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: goalsKeys.budget,
    queryFn: goalsApi.getBudget,
    ...options,
  });

export const useGoalSpend = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: goalsKeys.spend,
    queryFn: goalsApi.getSpend,
    ...options,
  });

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
  return useMutation({
    mutationFn: goalsApi.createBudget,
    onSuccess: invalidate,
  });
};

export const useUpdateGoalBudget = () => {
  const invalidate = useInvalidateBudget();
  return useMutation({
    mutationFn: goalsApi.updateBudget,
    onSuccess: invalidate,
  });
};

export const useResetGoalBudget = () => {
  const invalidate = useInvalidateBudget();
  return useMutation({
    mutationFn: goalsApi.resetBudget,
    onSuccess: invalidate,
  });
};

export const useCalculateBudget = () =>
  useMutation({ mutationFn: goalsApi.calculateBudget });
