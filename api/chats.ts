import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/api/client";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccess } from "@/api/types";

export type ChatType = "AUTO" | "MANUAL";

export type ChatDecision = "구매 추천" | "구매 보류";

export const CHAT_TOTAL_STEPS = 3;

export type ChatSummary = {
  id: number;
  title: string;
  createdAt: string;
};

export type CreateChatRequest = { wishItemId: number; type: ChatType };
export type CreateChatResponse = {
  id: number;
  currentStep: number;
  createdAt: string;
};

export type ChatAnswer = { step: number; selectedOption: string };

export type ChatDetail = {
  id: number;
  wishItem: { id: number; name: string; price: number };
  answers: ChatAnswer[];
  result: ChatDecision | null;
  currentStep: number;
};

export type ChatQuestionOption = { id: number; label: string };

export type ChatQuestion = {
  step: number;
  question: string;
  options: ChatQuestionOption[];
};

export type ChatQuestionFinished = { message: string };
export type ChatQuestionResponse = ChatQuestion | ChatQuestionFinished;

export const isChatQuestion = (
  res: ChatQuestionResponse,
): res is ChatQuestion => "step" in res && "options" in res;

export type SelectChatOptionRequest = {
  step: number;
  selectedOptionId: number;
};
export type SelectChatOptionResponse = { isFinished: boolean };

export type ChatResult = { decision: ChatDecision; message: string };

export const chatsApi = {
  getChats: async () =>
    (await apiClient.get<ApiSuccess<ChatSummary[]>>(ENDPOINTS.chats.root)).data
      .data,

  createChat: async (body: CreateChatRequest) =>
    (
      await apiClient.post<ApiSuccess<CreateChatResponse>>(
        ENDPOINTS.chats.root,
        body,
      )
    ).data.data,

  getChat: async (id: number) =>
    (await apiClient.get<ApiSuccess<ChatDetail>>(ENDPOINTS.chats.detail(id)))
      .data.data,

  deleteChat: async (id: number) => {
    await apiClient.delete(ENDPOINTS.chats.detail(id));
  },

  getQuestion: async (id: number) =>
    (
      await apiClient.get<ApiSuccess<ChatQuestionResponse>>(
        ENDPOINTS.chats.question(id),
      )
    ).data.data,

  selectOption: async ({
    id,
    ...body
  }: SelectChatOptionRequest & { id: number }) =>
    (
      await apiClient.post<ApiSuccess<SelectChatOptionResponse>>(
        ENDPOINTS.chats.select(id),
        body,
      )
    ).data.data,

  getResult: async (id: number) =>
    (await apiClient.get<ApiSuccess<ChatResult>>(ENDPOINTS.chats.result(id)))
      .data.data,
};

export const chatsKeys = {
  all: ["chats"] as const,
  list: ["chats", "list"] as const,
  detail: (id: number) => ["chats", "detail", id] as const,
  question: (id: number) => ["chats", "question", id] as const,
  result: (id: number) => ["chats", "result", id] as const,
};

export const useChats = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: chatsKeys.list,
    queryFn: chatsApi.getChats,
    ...options,
  });

export const useChat = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: chatsKeys.detail(id),
    queryFn: () => chatsApi.getChat(id),
    ...options,
  });

export const useChatQuestion = (id: number, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: chatsKeys.question(id),
    queryFn: () => chatsApi.getQuestion(id),
    ...options,
  });

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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: chatsKeys.list }),
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
