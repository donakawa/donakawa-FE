import type { HamkkuItem } from "@/constants/hamkku";
import { View } from "react-native";

// 도나 SVG 원본 크기 (constants/dona.ts의 모든 스킨이 동일)
const DONA_VIEWBOX_WIDTH = 191;
const DONA_VIEWBOX_HEIGHT = 240;

interface HamkkuAccessoryProps {
  item?: HamkkuItem;
  // 도나를 그리는 정사각형 영역의 한 변 (도나 SVG에 넘기는 width/height와 같아야 함)
  size: number;
}

// 도나와 같은 정사각형 컨테이너 안에 absolute로 겹쳐서 사용
export default function HamkkuAccessory({ item, size }: HamkkuAccessoryProps) {
  const AccessorySvg = item?.Svg;
  const placement = item?.placement;
  if (!AccessorySvg || !placement) return null;

  // 도나 SVG는 정사각형 안에서 세로 기준으로 맞춰지고 가로 가운데 정렬됨
  const scale = size / DONA_VIEWBOX_HEIGHT;
  const offsetX = (size - DONA_VIEWBOX_WIDTH * scale) / 2;
  const width = placement.width * scale;
  const height = placement.height * scale;

  return (
    <View
      style={{
        position: "absolute",
        pointerEvents: "none",
        left: offsetX + placement.centerX * scale - width / 2,
        top: placement.centerY * scale - height / 2,
        width,
        height,
        zIndex: 4,
      }}
    >
      <AccessorySvg width={width} height={height} />
    </View>
  );
}
