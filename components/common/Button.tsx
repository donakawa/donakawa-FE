import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Variant = "primary" | "secondary" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  label: string;
  variant?: Variant;
  size?: Size;
}

export default function Button({
  label,
  variant = "primary",
  size = "md",
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
      ]}
      disabled={disabled}
      activeOpacity={0.8}
      {...rest}
    >
      <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  // variant
  primary: {
    backgroundColor: "#0B4112",
  },
  secondary: {
    backgroundColor: "#E8F5E9",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0B4112",
  },
  disabled: {
    opacity: 0.4,
  },
  // size
  sm: { paddingVertical: 8, paddingHorizontal: 16 },
  md: { paddingVertical: 12, paddingHorizontal: 24 },
  lg: { paddingVertical: 16, paddingHorizontal: 32 },
  // labels
  label: { fontWeight: "600" },
  primaryLabel: { color: "#FFFFFF" },
  secondaryLabel: { color: "#0B4112" },
  outlineLabel: { color: "#0B4112" },
  smLabel: { fontSize: 13 },
  mdLabel: { fontSize: 15 },
  lgLabel: { fontSize: 17 },
});
