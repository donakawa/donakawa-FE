import type { ImageSourcePropType } from "react-native";

export interface OnboardingPageData {
  id: number;
  description: string;
  image: ImageSourcePropType;
}

export const ONBOARDING_PAGES: OnboardingPageData[] = [
  {
    id: 1,
    description: "쇼핑은 즐거워야 하니까,\n도나카와가 당신의 설렘을 지켜줄게요.",
    image: require("@/assets/images/onboarding/screen-1.png"),
  },
  {
    id: 2,
    description: "위시템을 담은 뒤,\n딱 5분만 이 아이템을 탐색해볼까요?",
    image: require("@/assets/images/onboarding/screen-2.png"),
  },
  {
    id: 3,
    description: "고민되는 상품끼리 토너먼트를 하고,\n질문들에 답변해 보세요.",
    image: require("@/assets/images/onboarding/screen-3.png"),
  },
  {
    id: 4,
    description: "후회 없는 소비로 비운 자리에,\n당신이 진짜 꿈꾸던 가치를 채우세요.",
    image: require("@/assets/images/onboarding/screen-4.png"),
  },
];

export const ONBOARDING_STORAGE_KEY = "hasSeenOnboarding";
