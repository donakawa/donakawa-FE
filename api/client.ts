import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { ENDPOINTS } from "@/api/endpoints";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

if (!API_BASE_URL) {
  console.warn("[api] EXPO_PUBLIC_API_BASE_URL is not set. Check your .env file.");
}

// 인증은 쿠키 기반: 서버가 accessToken/refreshToken을 쿠키로 내려주고,
// withCredentials로 요청마다 자동 전송된다 (헤더에 토큰을 직접 넣지 않음)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 401이 나도 토큰 리프레시를 시도하지 않을 요청 (리프레시 루프 방지용)
const NO_REFRESH_PATHS: string[] = [
  ENDPOINTS.auth.login,
  ENDPOINTS.auth.register,
  ENDPOINTS.auth.refresh,
  ENDPOINTS.auth.sendEmailCode,
  ENDPOINTS.auth.verifyEmailCode,
  ENDPOINTS.auth.recoverPassword,
];

const shouldSkipRefresh = (url?: string) => !!url && NO_REFRESH_PATHS.includes(url);

// 세션 만료 시 호출할 콜백 (예: 로그인 화면으로 이동). 앱 루트에서 등록
let onAuthExpired: (() => void) | null = null;
export const setOnAuthExpired = (handler: (() => void) | null) => {
  onAuthExpired = handler;
};

// 쿠키의 refreshToken으로 accessToken 쿠키를 재발급 (body 없음)
const requestTokenRefresh = () => apiClient.post(ENDPOINTS.auth.refresh);

// 동시에 여러 요청이 401을 받아도 리프레시는 한 번만 수행
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
