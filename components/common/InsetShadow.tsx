import { Platform, StyleSheet, View, type ViewStyle } from "react-native";
import { ShadowView, type InnerShadowProps } from "react-native-inner-shadow";

interface InsetShadowProps
  extends Omit<InnerShadowProps, "backgroundColor" | "children" | "inset"> {
  backgroundColor?: string;
  borderRadius?: number;
  children: React.ReactNode;
}

export default function InsetShadow({
  backgroundColor,
  borderRadius,
  style,
  children,
  shadowColor = "rgba(104, 171, 110, 0.30)",
  shadowOffset = { width: -4, height: -4 },
  shadowBlur = 4,
  reflectedLightColor = "rgba(255, 255, 255, 0.30)",
  reflectedLightOffset = { width: 4, height: 4 },
  reflectedLightBlur = 2,
  isReflectedLightEnabled = true,
  ...rest
}: InsetShadowProps) {
  const flattenedStyle = StyleSheet.flatten(style);
  const styleBackground =
    typeof flattenedStyle?.backgroundColor === "string"
      ? flattenedStyle.backgroundColor
      : undefined;
  const styleBorderRadius =
    typeof flattenedStyle?.borderRadius === "number"
      ? flattenedStyle.borderRadius
      : 0;
  const resolvedBorderRadius = borderRadius ?? styleBorderRadius;

  if (Platform.OS === "web") {
    return (
      <View
        style={[flattenedStyle, { borderRadius: resolvedBorderRadius, overflow: "hidden" }]}
        {...rest}
      >
        {children}
      </View>
    );
  }

  // ShadowView는 같은 style을 바깥 뷰와 안쪽 뷰에 모두 적용해 padding이 두 번 들어감.
  // padding이 있으면 ShadowView에서 빼고, 내부 래퍼에서 자식 배치 속성과 함께 한 번만 적용
  const { shadowStyle, contentStyle } = splitPaddingStyle(flattenedStyle);

  return (
    <ShadowView
      inset
      backgroundColor={backgroundColor ?? styleBackground ?? "#FFFFFF"}
      shadowColor={shadowColor}
      shadowOffset={shadowOffset}
      shadowBlur={shadowBlur}
      reflectedLightColor={reflectedLightColor}
      reflectedLightOffset={reflectedLightOffset}
      reflectedLightBlur={reflectedLightBlur}
      isReflectedLightEnabled={isReflectedLightEnabled}
      style={[shadowStyle, { borderRadius: resolvedBorderRadius, overflow: "hidden" }]}
      {...rest}
    >
      {contentStyle ? <View style={[styles.content, contentStyle]}>{children}</View> : children}
    </ShadowView>
  );
}

const PADDING_KEYS = [
  "padding",
  "paddingHorizontal",
  "paddingVertical",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "paddingStart",
  "paddingEnd",
] as const;

// 래퍼가 자식을 원래처럼 배치하도록 함께 옮기는 속성
const CONTENT_LAYOUT_KEYS = [
  "flexDirection",
  "flexWrap",
  "alignItems",
  "alignContent",
  "justifyContent",
  "gap",
  "rowGap",
  "columnGap",
] as const;

const splitPaddingStyle = (style: Readonly<ViewStyle> | null | undefined) => {
  if (!style || !PADDING_KEYS.some((key) => style[key] !== undefined)) {
    return { shadowStyle: style, contentStyle: undefined };
  }

  const shadowStyle: ViewStyle = { ...style };
  const contentStyle: ViewStyle = {};
  for (const key of [...PADDING_KEYS, ...CONTENT_LAYOUT_KEYS]) {
    if (style[key] !== undefined) {
      Object.assign(contentStyle, { [key]: style[key] });
      delete shadowStyle[key];
    }
  }
  return { shadowStyle, contentStyle };
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignSelf: "stretch",
  },
});
