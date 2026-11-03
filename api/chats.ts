import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

// ---------- Types (노션 API 명세서 > 살말추천) ----------

export type ChatType = "AUTO" | "MANUAL";

// 명세서상 "구매 추천" / "구매 보류" 둘 중 하나 (한글 문자열 그대로 내려옴)
export type ChatDecision = "구매 추천" | "구매 보류";

// 질문은 총 3개, currentStep이 4면 모든 질문 완료
export const CHAT_TOTAL_STEPS = 3;

export type ChatSummary = {
  id: number;
  title: string;
  createdAt: string;
};

export type CreateChatRequest = { wishItemId: number; type: ChatType };
export type CreateChatResponse = { id: number; currentStep: number; createdAt: string };

export type ChatAnswer = { step: number; selectedOption: string };

export type ChatDetail = {
  id: number;
  wishItem: { id: number; name: string; price: number };
  answers: ChatAnswer[];
  // 질문이 끝나기 전에는 결과가 없을 수 있어 nullable로 둠 (명세서 미기재)
  result: ChatDecision | null;
  currentStep: number;
};

export type ChatQuestionOption = { id: number; label: string };

export type ChatQuestion = {
  step: number;
  question: string;
  options: ChatQuestionOption[];
};

// 모든 질문이 끝난 경우 질문 대신 message만 내려옴
export type ChatQuestionFinished = { message: string };
export type ChatQuestionResponse = ChatQuestion | ChatQuestionFinished;

export const isChatQuestion = (res: ChatQuestionResponse): res is ChatQuestion =>
  "step" in res && "options" in res;

export type SelectChatOptionRequest = { step: number; selectedOptionId: number };
export type SelectChatOptionResponse = { isFinished: boolean };

export type ChatResult = { decision: ChatDecision; message: string };

// ---------- API ----------

export const chatsApi = {
  getChats: async () =>
    (await apiClient.get<ApiSuccess<ChatSummary[]>>(ENDPOINTS.chats.root)).data.data,

  // 위시 아이템 1개당 채팅방 1개만 생성 가능
  createChat: async (body: CreateChatRequest) =>
    (await apiClient.post<ApiSuccess<CreateChatResponse>>(ENDPOINTS.chats.root, body)).data
      .data,

  getChat: async (id: number) =>
    (await apiClient.get<ApiSuccess<ChatDetail>>(ENDPOINTS.chats.detail(id))).data.data,

  deleteChat: async (id: number) => {
    await apiClient.delete(ENDPOINTS.chats.detail(id));
  },

  // 현재 단계의 질문 조회. 모든 질문 완료 시 { message }가 내려오므로 isChatQuestion으로 구분
  getQuestion: async (id: number) =>
    (await apiClient.get<ApiSuccess<ChatQuestionResponse>>(ENDPOINTS.chats.question(id))).data
      .data,

  // step이 현재 채팅 단계와 다르면 INVALID_STEP 에러
  selectOption: async ({ id, ...body }: SelectChatOptionRequest & { id: number }) =>
    (
      await apiClient.post<ApiSuccess<SelectChatOptionResponse>>(
        ENDPOINTS.chats.select(id),
        body,
      )
    ).data.data,

  // 서버에서 GPT 판단을 수행. 질문 미완료 시 CHAT_NOT_FINISHED 에러
  getResult: async (id: number) =>
    (await apiClient.get<ApiSuccess<ChatResult>>(ENDPOINTS.chats.result(id))).data.data,
};

// ---------- React Query ----------

export const chatsKeys = {
  all: ["chats"] as const,
  list: ["chats", "list"] as const,
  detail: (id: number) => ["chats", "detail", id] as const,
  question: (id: number) => ["chats", "question", id] as const,
  result: (id: number) => ["chats", "result", id] as const,
};

export const useChats = (options?: { enabled?: boolean }) =>
  useQuery({ queryKey: chatsKeys.list, queryFn: chatsApi.getChats, ...options });

export const useChat = (id: number, options?: { enabled?: boolean }) =>
  useQuery({ queryKey: chatsKeys.detail(id), queryFn: () => chatsApi.getChat(id), ...options });

export const useChatQuestion = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: chatsKeys.question(id),
    queryFn: () => chatsApi.getQuestion(id),
    ...options,
  });

// GPT 호출이라 비용이 크므로 한 번 받은 결과는 다시 요청하지 않음
export const useChatResult = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: chatsKeys.result(id),
    queryFn: () => chatsApi.getResult(id),
    staleTime: Infinity,
    retry: false,
    ...options,
  });

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatsApi.createChat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chatsKeys.list }),
  });
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatsApi.deleteChat,
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: chatsKeys.detail(id) });
      queryClient.removeQueries({ queryKey: chatsKeys.question(id) });
      queryClient.removeQueries({ queryKey: chatsKeys.result(id) });
      return queryClient.invalidateQueries({ queryKey: chatsKeys.list });
    },
  });
};

// 선택 저장 후 다음 질문/상세(currentStep, answers)를 다시 받아옴
export const useSelectChatOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: chatsApi.selectOption,
    onSuccess: (_data, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: chatsKeys.question(id) }),
        queryClient.invalidateQueries({ queryKey: chatsKeys.detail(id) }),
      ]),
  });
};
