import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

export type AuthProvider = "email" | "google" | "kakao";
export type EmailCodeType = "REGISTER" | "RESET_PASSWORD";
export type VerifyPasswordType = "DELETE_ACCOUNT" | "CHANGE_PASSWORD";

export type User = {
  id: string;
  email: string;
  nickname: string;
  goal: string | null;
  hasPassword: boolean;
  providers: AuthProvider[];
};

export type LoginRequest = { email: string; password: string };
export type LoginResponse = Pick<User, "id" | "email" | "nickname">;

export type RegisterRequest = {
  email: string;
  password: string;
  nickname: string;
  goal?: string;
};
export type RegisterResponse = { id: string; createdAt: string };

export type SendEmailCodeRequest = { email: string; type: EmailCodeType };
export type VerifyEmailCodeRequest = {
  email: string;
  code: string;
  type: EmailCodeType;
};

export type VerifyPasswordRequest = {
  password: string;
  type: VerifyPasswordType;
};
export type RecoverPasswordRequest = { email: string; newPassword: string };

export type NicknameResponse = {
  id: string;
  nickname: string;
  updatedAt: string;
};
export type GoalResponse = { id: string; goal: string; updatedAt: string };

export const authApi = {
  login: async (body: LoginRequest) =>
    (
      await apiClient.post<ApiSuccess<LoginResponse>>(
        ENDPOINTS.auth.login,
        body,
      )
    ).data.data,

  logout: async () => {
    await apiClient.post(ENDPOINTS.auth.logout);
  },

  register: async (body: RegisterRequest) =>
    (
      await apiClient.post<ApiSuccess<RegisterResponse>>(
        ENDPOINTS.auth.register,
        body,
      )
    ).data.data,

  getMe: async () =>
    (await apiClient.get<ApiSuccess<User>>(ENDPOINTS.auth.me)).data.data,

  sendEmailCode: async (body: SendEmailCodeRequest) => {
    await apiClient.post(ENDPOINTS.auth.sendEmailCode, body);
  },

  verifyEmailCode: async (body: VerifyEmailCodeRequest) => {
    await apiClient.post(ENDPOINTS.auth.verifyEmailCode, body);
  },

  checkNicknameAvailable: async (nickname: string) =>
    (
      await apiClient.get<ApiSuccess<{ isAvailable: boolean }>>(
        ENDPOINTS.auth.nicknameDuplicate,
        { params: { nickname } },
      )
    ).data.data.isAvailable,

  verifyPassword: async (body: VerifyPasswordRequest) =>
    (
      await apiClient.post<ApiSuccess<{ isValid: boolean }>>(
        ENDPOINTS.auth.verifyPassword,
        body,
      )
    ).data.data.isValid,

  changePassword: async (newPassword: string) => {
    await apiClient.patch(ENDPOINTS.auth.password, { newPassword });
  },

  recoverPassword: async (body: RecoverPasswordRequest) => {
    await apiClient.post(ENDPOINTS.auth.recoverPassword, body);
  },

  updateNickname: async (newNickname: string) =>
    (
      await apiClient.patch<ApiSuccess<NicknameResponse>>(
        ENDPOINTS.auth.nickname,
        {
          newNickname,
        },
      )
    ).data.data,

  updateGoal: async (newGoal: string) =>
    (
      await apiClient.patch<ApiSuccess<GoalResponse>>(ENDPOINTS.auth.goal, {
        newGoal,
      })
    ).data.data,

  deleteAccount: async () => {
    await apiClient.delete(ENDPOINTS.auth.account);
  },
};

export const authKeys = {
  me: ["auth", "me"] as const,
};

export const useMe = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: authKeys.me, queryFn: authApi.getMe, ...options });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me }),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => queryClient.clear(),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.deleteAccount,
    onSuccess: () => queryClient.clear(),
  });
};

export const useRegister = () => useMutation({ mutationFn: authApi.register });
export const useSendEmailCode = () =>
  useMutation({ mutationFn: authApi.sendEmailCode });
export const useVerifyEmailCode = () =>
  useMutation({ mutationFn: authApi.verifyEmailCode });
export const useVerifyPassword = () =>
  useMutation({ mutationFn: authApi.verifyPassword });
export const useChangePassword = () =>
  useMutation({ mutationFn: authApi.changePassword });
export const useRecoverPassword = () =>
  useMutation({ mutationFn: authApi.recoverPassword });

export const useUpdateNickname = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateNickname,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me }),
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateGoal,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me }),
  });
};
