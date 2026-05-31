import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
}

export default function Input({ label, errorMessage, style, ...rest }: InputProps) {
  const hasError = !!errorMessage;

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, hasError && styles.inputError, style]}
        placeholderTextColor="#9E9E9E"
        {...rest}
      />
      {hasError && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#212121",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#212121",
    backgroundColor: "#FAFAFA",
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  errorMessage: {
    fontSize: 12,
    color: "#D32F2F",
  },
});
