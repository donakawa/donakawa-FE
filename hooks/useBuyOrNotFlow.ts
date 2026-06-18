import { useMemo, useState } from "react";

import type {
  BuyOrNotAnswer,
  BuyOrNotMessageSegment,
  BuyOrNotOption,
  BuyOrNotResult,
  BuyOrNotResultType,
  BuyOrNotSession,
} from "@/types/buyOrNot";

type FlowPhase = "QUESTION" | "LOADING" | "RESULT";

export function useBuyOrNotFlow(session: BuyOrNotSession) {
  const [phase, setPhase] = useState<FlowPhase>("QUESTION");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<BuyOrNotAnswer[]>([]);
  const [resultStep, setResultStep] = useState(0);

  const currentQuestion = session.questions[questionIndex];

  const result = useMemo(() => {
    if (phase !== "RESULT") return null;
    return calculateMockResult(answers);
  }, [phase, answers]);

  const isResultFinalStep =
    result != null && resultStep === result.messages.length - 1;

  const selectOption = (option: BuyOrNotOption) => {
    const answer: BuyOrNotAnswer = {
      questionId: currentQuestion.id,
      optionId: option.id,
      value: option.value,
    };

    setAnswers((prev) => [...prev, answer]);
    setPhase("LOADING");
  };

  const goNext = () => {
    if (phase === "RESULT") {
      if (!isResultFinalStep) {
        setResultStep((prev) => prev + 1);
      }
      return;
    }

    if (phase !== "LOADING") return;

    const isLastQuestion = questionIndex === session.questions.length - 1;

    if (isLastQuestion) {
      setResultStep(0);
      setPhase("RESULT");
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setPhase("QUESTION");
  };

  const restart = () => {
    setPhase("QUESTION");
    setQuestionIndex(0);
    setAnswers([]);
    setResultStep(0);
  };

  const bubbleMessage: BuyOrNotMessageSegment[] =
    phase === "QUESTION"
      ? [{ text: currentQuestion.message }]
      : phase === "LOADING"
        ? [{ text: currentQuestion.loadingMessage }]
        : (result?.messages[resultStep] ?? []);

  return {
    phase,
    currentQuestion,
    answers,
    result,
    isResultFinalStep,
    bubbleMessage,
    selectOption,
    goNext,
    restart,
  };
}

function calculateMockResult(answers: BuyOrNotAnswer[]): BuyOrNotResult {
  const values = answers.map((answer) => answer.value);

  let type: BuyOrNotResultType = "RECOMMEND";

  if (
    values.includes("REPLACEABLE") ||
    values.includes("RARELY") ||
    values.includes("NO_PLAN")
  ) {
    type = "NOT_NEEDED";
  }

  if (values.includes("REPLACEABLE") && values.includes("RARELY")) {
    type = "DANGER";
  }

  if (values.includes("NO_SIMILAR_ITEM") && values.includes("VERY_OFTEN")) {
    type = "HOLD";
  }

  const resultMap: Record<BuyOrNotResultType, BuyOrNotResult> = {
    RECOMMEND: {
      type: "RECOMMEND",
      messages: [
        [
          { text: "이 정도면 필요한 것 같아! 예산이\n" },
          { text: "140,000", highlight: true },
          { text: "원 남았고 5일 후 갱신돼!" },
        ],
        [
          {
            text: "다른 곳에 돈 쓸 일이 있지 않다면\n구매를 고려해봐도 나쁘지 않을 듯!",
          },
        ],
      ],
      primaryButtonText: "그래, 고맙다. 도움이 됐어.",
      secondaryButtonText: "다른 위시로 다시 물어볼래!",
    },
    HOLD: {
      type: "HOLD",
      messages: [
        [
          { text: "사고 싶은 건 알겠지만... 예산이\n" },
          { text: "9,870", highlight: true },
          { text: "원 남았고 열흘 더 참아야 해" },
        ],
        [{ text: "이걸 사면 거지가 되고 말 거야..." }],
      ],
      primaryButtonText: "그래, 고맙다. 도움이 됐어.",
      secondaryButtonText: "다른 위시로 다시 물어볼래!",
    },
    NOT_NEEDED: {
      type: "NOT_NEEDED",
      messages: [
        [
          { text: "꼭 필요하진 않아 보여... 예산이\n" },
          { text: "140,000", highlight: true },
          { text: "원 남았고 5일 후 갱신돼" },
        ],
        [
          {
            text: "다른 위시도 사고 싶다면 참아보자...\n사고 나서 후회할지도 몰라!",
          },
        ],
      ],
      primaryButtonText: "그래, 고맙다. 도움이 됐어.",
      secondaryButtonText: "다른 위시로 다시 물어볼래!",
    },
    DANGER: {
      type: "DANGER",
      messages: [
        [{ text: "정말 필요한 거 맞아?\n이러다가 거지가 되게 생겼어" }],
      ],
      primaryButtonText: "알겠어 미안해",
      secondaryButtonText: "다른 위시로 다시 물어볼래!",
    },
  };

  return resultMap[type];
}
