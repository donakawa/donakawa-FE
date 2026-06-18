import type { ReactNode } from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";

import ArrowIcon from "@/assets/images/log/arrow_left.svg";
import { headerStyles as styles } from "@/styles/common/Header.style";

interface HeaderProps {
  title?: string;
  onBackPress?: () => void;
  rightElement?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function Header({
  title,
  onBackPress,
  rightElement,
  style,
}: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.left}>
        {onBackPress && (
          <Pressable onPress={onBackPress} hitSlop={10}>
            <ArrowIcon />
          </Pressable>
        )}

        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      {rightElement}
    </View>
  );
}
