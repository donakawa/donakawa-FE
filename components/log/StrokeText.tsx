import { Canvas, Text, useFont } from "@shopify/react-native-skia";

interface StrokeTextProps {
  text: string;
  color: string;
  strokeColor: string;
  fontSize: number;
  strokeWidth?: number;
}

export default function StrokeText({
  text,
  color,
  strokeColor,
  fontSize,
  strokeWidth = 2,
}: StrokeTextProps) {
  const font = useFont(require("@/assets/fonts/Galmuri11-Bold.ttf"), fontSize);

  if (!font) return null;

  const textWidth = font.getTextWidth(text);
  const ascent = Math.abs(font.getMetrics().ascent);
  const width = textWidth + strokeWidth * 2 + 4;
  const height = fontSize + strokeWidth * 2;

  return (
    <Canvas style={{ width, height }}>
      <Text
        x={strokeWidth}
        y={ascent + strokeWidth}
        text={text}
        font={font}
        color={strokeColor}
        style="stroke"
        strokeWidth={strokeWidth}
      />
      <Text
        x={strokeWidth}
        y={ascent + strokeWidth}
        text={text}
        font={font}
        color={color}
      />
    </Canvas>
  );
}
