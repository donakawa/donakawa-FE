import { Platform, StyleSheet, View } from "react-native";
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
      style={[flattenedStyle, { borderRadius: resolvedBorderRadius, overflow: "hidden" }]}
      {...rest}
    >
      {children}
    </ShadowView>
  );
}
