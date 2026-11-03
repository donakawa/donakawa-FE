import { isAxiosError } from "axios";

// 모든 API 응답의 공통 포맷 (API 명세서 기준)
export type ApiErrorBody = {
  errorCode: string;
  // 명세서상 API마다 reason / message 중 하나로 내려옴
  reason?: string;
  message?: string;
  data: unknown;
};

// 실패 응답은 4xx/5xx라 axios가 throw하므로, 요청 제네릭에는 성공 타입만 사용
export type ApiSuccess<T> = { resultType: "SUCCESS"; error: null; data: T };
export type ApiFailure = { resultType: "FAILED"; error: ApiErrorBody; data: null };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

// 실패 응답에서 errorCode/메시지를 꺼냄. 서버 응답이 아니면 null
export const getApiError = (error: unknown): { code: string; message: string } | null => {
  if (!isAxiosError<ApiResponse<unknown>>(error)) return null;
  const body = error.response?.data;
  if (!body || body.resultType !== "FAILED" || !body.error) return null;
  return {
    code: body.error.errorCode,
    message: body.error.reason ?? body.error.message ?? "",
  };
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "잠시 후 다시 시도해주세요.",
) => getApiError(error)?.message || fallback;
