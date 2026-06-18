import type { BuyOrNotSession } from "@/types/buyOrNot";

export const BUY_OR_NOT_MOCK_SESSION: BuyOrNotSession = {
  wishItem: {
    id: 1,
    name: "ZARA 시티 걸 드레스 그린",
    price: 57300,
    imageUrl: "https://picsum.photos/200",
  },

  questions: [
    {
      id: 1,
      order: 1,
      message: "비슷한 역할을 하는 아이템이\n정말 없어?",
      loadingMessage: "흠...",
      options: [
        {
          id: 1,
          label: "정말 없어 믿어줘",
          value: "NO_SIMILAR_ITEM",
        },
        {
          id: 2,
          label: "비슷한 게 있긴 한데... 대체 불가능",
          value: "SIMILAR_BUT_NOT_REPLACEABLE",
        },
        {
          id: 3,
          label: "대체 할 수 있는 게 있긴 해",
          value: "REPLACEABLE",
        },
      ],
    },
    {
      id: 2,
      order: 2,
      message: "이 아이템을 자주\n사용할 것 같아?",
      loadingMessage: "그렇단 말이지...",
      options: [
        {
          id: 1,
          label: "매우 자주 사용할 것 같아",
          value: "VERY_OFTEN",
        },
        {
          id: 2,
          label: "가끔 사용할 것 같아",
          value: "SOMETIMES",
        },
        {
          id: 3,
          label: "솔직히 거의 안 쓸 듯",
          value: "RARELY",
        },
      ],
    },
    {
      id: 3,
      order: 3,
      message: "대략 한 달 이내에 위시템을\n사용할 구체적인 계획이 있어?",
      loadingMessage: "렛미씨 렛미씨.",
      options: [
        {
          id: 1,
          label: "확실하게 쓸 계획을 세워 두었어",
          value: "HAS_PLAN",
        },
        {
          id: 2,
          label: "이번 달 안에는 쓸 것 같아",
          value: "MAYBE_THIS_MONTH",
        },
        {
          id: 3,
          label: "언젠가는 쓸 걸?",
          value: "NO_PLAN",
        },
      ],
    },
  ],
};
