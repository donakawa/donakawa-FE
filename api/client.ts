import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { ENDPOINTS } from "@/api/endpoints";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

if (!API_BASE_URL) {
  console.warn(
    "[api] EXPO_PUBLIC_API_BASE_URL is not set. Check your .env file.",
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const NO_REFRESH_PATHS: string[] = [
  ENDPOINTS.auth.login,
  ENDPOINTS.auth.register,
  ENDPOINTS.auth.refresh,
  ENDPOINTS.auth.sendEmailCode,
  ENDPOINTS.auth.verifyEmailCode,
  ENDPOINTS.auth.recoverPassword,
];

const shouldSkipRefresh = (url?: string) =>
  !!url && NO_REFRESH_PATHS.includes(url);

let onAuthExpired: (() => void) | null = null;
export const setOnAuthExpired = (handler: (() => void) | null) => {
  onAuthExpired = handler;
};

const requestTokenRefresh = () => apiClient.post(ENDPOINTS.auth.refresh);

let refreshPromise: Promise<unknown> | null = null;

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      shouldSkipRefresh(original.url)
    ) {
      return Promise.reject(error);
    }

    original._retry = true;
    try {
      refreshPromise ??= requestTokenRefresh().finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return apiClient(original);
    } catch (refreshError) {
      onAuthExpired?.();
      return Promise.reject(refreshError);
    }
  },
);
