import { AxiosError, create, type InternalAxiosRequestConfig } from "axios";

import { ENDPOINTS } from "@/api/endpoints";
import { tokenStorage, type AuthTokens } from "@/api/tokenStorage";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";

if (!API_BASE_URL) {
  console.warn(
    "[api] EXPO_PUBLIC_API_BASE_URL is not set. Check your .env file.",
  );
}

export const apiClient = create({
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
  ENDPOINTS.auth.oauthToken,
];

const shouldSkipRefresh = (url?: string) =>
  !!url && NO_REFRESH_PATHS.includes(url);

// 토큰 만료가 아닌 401 (A016: 탈퇴 재인증 시간 초과)
const NO_REFRESH_ERROR_CODES = ["A016"];

const getErrorCode = (error: AxiosError) =>
  (error.response?.data as { error?: { errorCode?: string } } | undefined)?.error?.errorCode;

let onAuthExpired: (() => void) | null = null;
export const setOnAuthExpired = (handler: (() => void) | null) => {
  onAuthExpired = handler;
};

// 소셜 로그인은 저장된 토큰을 Bearer로, 이메일 로그인은 쿠키로 인증
apiClient.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    config.headers.delete("Authorization");
  }
  return config;
});

// TODO: 서버가 body의 refreshToken을 필수로 요구해서 쿠키만 있는 이메일 로그인은 갱신 실패(500). 백엔드 확인 필요
const requestTokenRefresh = async () => {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return apiClient.post(ENDPOINTS.auth.refresh);

  const { data } = await apiClient.post<{ data: AuthTokens | null }>(ENDPOINTS.auth.refresh, {
    refreshToken,
  });
  // 새 토큰이 쿠키로만 오면 기존 Bearer가 쿠키를 가리지 않도록 제거
  if (data.data?.accessToken) await tokenStorage.setTokens(data.data);
  else await tokenStorage.removeAccessToken();
};

let refreshPromise: Promise<unknown> | null = null;

// 동시에 여러 요청이 401을 받아도 리프레시는 한 번만 수행. 실패하면 세션 만료 처리
export const refreshSession = async () => {
  try {
    refreshPromise ??= requestTokenRefresh().finally(() => {
      refreshPromise = null;
    });
    await refreshPromise;
  } catch (refreshError) {
    await tokenStorage.clear();
    onAuthExpired?.();
    throw refreshError;
  }
};

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      shouldSkipRefresh(original.url) ||
      NO_REFRESH_ERROR_CODES.includes(getErrorCode(error) ?? "")
    ) {
      return Promise.reject(error);
    }

    original._retry = true;
    await refreshSession();
    return apiClient(original);
  },
);
