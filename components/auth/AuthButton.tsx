import InsetShadow from "@/components/common/InsetShadow";
import { Text, TouchableOpacity, View } from "react-native";
import { authButtonStyles as styles } from "@/styles/auth/Authcomponent.style";

type Props = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "google" | "kakao" | "disabled";
};

export default function AuthButton({
  title,
  onPress,
  variant = "primary",
}: Props) {
  if (variant === "primary") {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <InsetShadow style={[styles.button, styles.primary]}>
          <Text style={styles.text}>{title}</Text>
          <View style={styles.primaryBorder} />
        </InsetShadow>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={variant === "disabled"}
    >
      <Text style={[styles.text, variant === "disabled" && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}