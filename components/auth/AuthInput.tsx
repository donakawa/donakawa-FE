import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { authInputStyles as styles } from "@/styles/auth/Authcomponent.style";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export default function AuthInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}: Props) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#C3C8C4"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
      />

      {secureTextEntry && (
        <TouchableOpacity onPress={() => setHidden(!hidden)}>
          <Ionicons
            name={hidden ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="#5F6460"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}