import { DONA_IMAGES, type DonaExpression, type DonaSkinVariant } from "@/constants/dona";

interface DonaCharacterProps {
  skinVariant?: DonaSkinVariant;
  expression: DonaExpression;
  size: number;
}

// 스킨·표정에 맞는 도나 SVG를 그림. 렌더 중에 컴포넌트를 변수로 고르지 않도록 이 컴포넌트를 사용
export default function DonaCharacter({ skinVariant, expression, size }: DonaCharacterProps) {
  const DonaSvg = DONA_IMAGES[skinVariant ?? 1][expression];
  return <DonaSvg width={size} height={size} />;
}
