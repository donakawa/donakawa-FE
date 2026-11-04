import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { authKeys } from "@/api/auth";
import { API_BASE_URL, apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import { tokenStorage, type AuthTokens } from "@/api/tokenStorage";
import type { ApiSuccess } from "@/api/types";

export type SocialProvider = "google" | "kakao";

// 서버가 인증을 마치면 이 스킴의 딥링크로 돌아옴 (app.json의 scheme과 동일해야 함)
const REDIRECT_URL = "donakawa://";

const LOGIN_PATH: Record<SocialProvider, string> = {
  google: ENDPOINTS.auth.googleLogin,
  kakao: ENDPOINTS.auth.kakaoLogin,
};
const REAUTH_PATH: Record<SocialProvider, string> = {
  google: ENDPOINTS.auth.googleReauth,
  kakao: ENDPOINTS.auth.kakaoReauth,
};
const CONNECT_PATH: Record<SocialProvider, string> = {
  google: ENDPOINTS.auth.connectGoogle,
  kakao: ENDPOINTS.auth.connectKakao,
};

const CONNECT_ERROR_MESSAGE: Record<string, string> = {
  A018: "연동 시간이 만료되었습니다. 다시 시도해주세요.",
  A019: "앱 계정과 소셜 계정의 이메일이 다릅니다.",
  U013: "이미 이 계정에 연동된 소셜 계정입니다.",
  U014: "다른 회원에게 이미 연동된 소셜 계정입니다.",
};

// 사용자가 브라우저를 닫으면 null
const openAuthSession = async (url: string) => {
  const result = await WebBrowser.openAuthSessionAsync(url, REDIRECT_URL);
  if (result.type !== "success") return null;

  const { hostname, queryParams } = Linking.parse(result.url);
  return { hostname, params: queryParams ?? {} };
};

const getAuthUrl = async (path: string) =>
  (await apiClient.get<ApiSuccess<{ url: string }>>(path)).data.data.url;

export const socialAuthApi = {
  // 취소 시 null. 신규 가입이면 isNewUser가 true
  login: async (provider: SocialProvider) => {
    const session = await openAuthSession(`${API_BASE_URL}${LOGIN_PATH[provider]}`);
    if (!session) return null;

    const { code } = session.params;
    if (typeof code !== "string") throw new Error("소셜 로그인에 실패했습니다.");

    // code는 30초 안에 한 번만 사용 가능
    const { data } = await apiClient.get<ApiSuccess<AuthTokens>>(ENDPOINTS.auth.oauthToken, {
      params: { code },
    });
    await tokenStorage.setTokens(data.data);
    return { isNewUser: session.hostname === "social" };
  },

  // 취소 시 false. 성공 시 5분 안에 탈퇴 API를 호출해야 함
  reauth: async (provider: SocialProvider) => {
    const session = await openAuthSession(await getAuthUrl(REAUTH_PATH[provider]));
    if (!session) return false;

    if (session.params.reauth !== "success") {
      throw new Error("본인 확인에 실패했습니다. 다시 시도해주세요.");
    }
    return true;
  },

  // 취소 시 false
  connect: async (provider: SocialProvider) => {
    const session = await openAuthSession(await getAuthUrl(CONNECT_PATH[provider]));
    if (!session) return false;

    const { connect, error } = session.params;
    if (connect !== "success") {
      const message = typeof error === "string" ? CONNECT_ERROR_MESSAGE[error] : undefined;
      throw new Error(message ?? "계정 연동에 실패했습니다.");
    }
    return true;
  },
};

export const useSocialLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: socialAuthApi.login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me }),
  });
};

export const useSocialReauth = () => useMutation({ mutationFn: socialAuthApi.reauth });

export const useSocialConnect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: socialAuthApi.connect,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me }),
  });
};
