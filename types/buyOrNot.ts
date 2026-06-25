export type BuyOrNotQuestion = {
  id: number;
  order: number;
  message: string;
  loadingMessage: string;
  options: BuyOrNotOption[];
};

export type BuyOrNotOption = {
  id: number;
  label: string;
  value: string;
};

export type BuyOrNotAnswer = {
  questionId: number;
  optionId: number;
  value: string;
};

export type BuyOrNotResultType = "RECOMMEND" | "HOLD" | "NOT_NEEDED" | "DANGER";

export type BuyOrNotMessageSegment = {
  text: string;
  highlight?: boolean;
};

export type BuyOrNotResult = {
  type: BuyOrNotResultType;
  messages: BuyOrNotMessageSegment[][];
  primaryButtonText: string;
  secondaryButtonText: string;
};

export type BuyOrNotSession = {
  wishItem: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  questions: BuyOrNotQuestion[];
};
