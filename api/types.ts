import { isAxiosError } from "axios";

export type ApiErrorBody = {
  errorCode: string;
  reason?: string;
  message?: string;
  data: unknown;
};

export type ApiSuccess<T> = { resultType: "SUCCESS"; error: null; data: T };
export type ApiFailure = { resultType: "FAILED"; error: ApiErrorBody; data: null };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

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
