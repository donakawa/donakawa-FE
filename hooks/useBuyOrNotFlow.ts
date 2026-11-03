import { useState } from "react";
import { Alert } from "react-native";

import {
  isChatQuestion,
  useChatQuestion,
  useChatResult,
  useSelectChatOption,
  type ChatDecision,
  type ChatQuestion,
  type ChatQuestionOption,
  type ChatResult,
} from "@/api/chats";
import { getApiErrorMessage } from "@/api/types";
import type {
  BuyOrNotMessageSegment,
  BuyOrNotResult,
  BuyOrNotResultType,
} from "@/types/buyOrNot";

type FlowPhase = "QUESTION" | "LOADING" | "RESULT";

export const BUY_OR_NOT_LOADING_MESSAGE = "흠...";

const DECISION_TO_RESULT_TYPE: Record<ChatDecision, BuyOrNotResultType> = {
  "구매 추천": "RECOMMEND",
  "구매 보류": "HOLD",
};

const RESULT_PRIMARY_BUTTON_TEXT = "그래, 고맙다. 도움이 됐어.";
const RESULT_SECONDARY_BUTTON_TEXT = "다른 위시로 다시 물어볼래!";

const toBuyOrNotResult = ({ decision, message }: ChatResult): BuyOrNotResult => ({
  type: DECISION_TO_RESULT_TYPE[decision],
  messages: [[{ text: message }]],
  primaryButtonText: RESULT_PRIMARY_BUTTON_TEXT,
  secondaryButtonText: RESULT_SECONDARY_BUTTON_TEXT,
});

export function useBuyOrNotFlow(chatId: number) {
  const isValidChat = Number.isFinite(chatId) && chatId > 0;

  const [phase, setPhase] = useState<FlowPhase>("QUESTION");
  const [resultStep, setResultStep] = useState(0);
  const [answeredQuestion, setAnsweredQuestion] = useState<ChatQuestion | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const questionQuery = useChatQuestion(chatId, {
    enabled: isValidChat && phase !== "RESULT",
  });
  const fetched = questionQuery.data;
  const fetchedQuestion = fetched && isChatQuestion(fetched) ? fetched : null;

  const currentPhase: FlowPhase =
    phase === "QUESTION" && fetched && !isChatQuestion(fetched) ? "RESULT" : phase;

  const resultQuery = useChatResult(chatId, {
    enabled: isValidChat && currentPhase === "RESULT",
  });
  const selectMutation = useSelectChatOption();

  const currentQuestion = currentPhase === "LOADING" ? answeredQuestion : fetchedQuestion;
  const result = resultQuery.data ? toBuyOrNotResult(resultQuery.data) : null;

  const isResultFinalStep = result != null && resultStep === result.messages.length - 1;

  const canLeaveLoading = selectMutation.isSuccess && !questionQuery.isFetching;

  const isWaitingForTap =
    (currentPhase === "LOADING" && canLeaveLoading) ||
    (currentPhase === "RESULT" && result != null && !isResultFinalStep);

  const selectOption = (option: ChatQuestionOption) => {
    if (!fetchedQuestion || selectMutation.isPending) return;

    setAnsweredQuestion(fetchedQuestion);
    setPhase("LOADING");

    selectMutation.mutate(
      { id: chatId, step: fetchedQuestion.step, selectedOptionId: option.id },
      {
        onSuccess: (data) => setIsFinished(data.isFinished),
        onError: (error) => {
          setPhase("QUESTION");
          Alert.alert("답변 저장 실패", getApiErrorMessage(error));
        },
      },
    );
  };

  const goNext = () => {
    if (currentPhase === "RESULT") {
      if (result && !isResultFinalStep) {
        setResultStep((prev) => prev + 1);
      }
      return;
    }

    if (currentPhase !== "LOADING" || !canLeaveLoading) return;

    if (isFinished) {
      setResultStep(0);
      setPhase("RESULT");
      return;
    }

    setPhase("QUESTION");
  };

  const errorMessage = (error: unknown): BuyOrNotMessageSegment[] => [
    { text: getApiErrorMessage(error) },
  ];

  let bubbleMessage: BuyOrNotMessageSegment[];
  if (currentPhase === "RESULT") {
    bubbleMessage = resultQuery.isError
      ? errorMessage(resultQuery.error)
      : (result?.messages[resultStep] ?? [{ text: BUY_OR_NOT_LOADING_MESSAGE }]);
  } else if (currentPhase === "LOADING") {
    bubbleMessage = [{ text: BUY_OR_NOT_LOADING_MESSAGE }];
  } else if (questionQuery.isError) {
    bubbleMessage = errorMessage(questionQuery.error);
  } else {
    bubbleMessage = [{ text: fetchedQuestion?.question ?? BUY_OR_NOT_LOADING_MESSAGE }];
  }

  return {
    phase: currentPhase,
    currentQuestion,
    result,
    isResultFinalStep,
    isWaitingForTap,
    bubbleMessage,
    selectOption,
    goNext,
  };
}
