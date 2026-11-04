import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const ACCESS_TOKEN_KEY = "donakawa.accessToken";
const REFRESH_TOKEN_KEY = "donakawa.refreshToken";

// expo-secure-store는 웹을 지원하지 않으므로 웹에서는 AsyncStorage로 대체
const storage = {
  get: (key: string) =>
    Platform.OS === "web" ? AsyncStorage.getItem(key) : SecureStore.getItemAsync(key),
  set: (key: string, value: string) =>
    Platform.OS === "web"
      ? AsyncStorage.setItem(key, value)
      : SecureStore.setItemAsync(key, value),
  remove: (key: string) =>
    Platform.OS === "web"
      ? AsyncStorage.removeItem(key)
      : SecureStore.deleteItemAsync(key),
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

// 모든 API 요청이 읽는 값이라 SecureStore를 매번 읽지 않도록 메모리에 보관 (undefined: 아직 안 읽음)
let cachedAccessToken: string | null | undefined;

// 소셜 로그인 토큰 저장소. 이메일 로그인은 쿠키를 사용하므로 저장하지 않음
export const tokenStorage = {
  async getAccessToken() {
    if (cachedAccessToken === undefined) {
      const stored = await storage.get(ACCESS_TOKEN_KEY);
      // 읽는 동안 토큰이 저장/삭제됐다면 그 값을 유지
      if (cachedAccessToken === undefined) cachedAccessToken = stored;
    }
    return cachedAccessToken;
  },

  getRefreshToken: () => storage.get(REFRESH_TOKEN_KEY),

  async removeAccessToken() {
    cachedAccessToken = null;
    await storage.remove(ACCESS_TOKEN_KEY);
  },

  async setTokens({ accessToken, refreshToken }: AuthTokens) {
    cachedAccessToken = accessToken;
    await storage.set(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) await storage.set(REFRESH_TOKEN_KEY, refreshToken);
  },

  async clear() {
    cachedAccessToken = null;
    await Promise.all([storage.remove(ACCESS_TOKEN_KEY), storage.remove(REFRESH_TOKEN_KEY)]);
  },
};
