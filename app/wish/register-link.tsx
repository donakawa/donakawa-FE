import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WishRegisterLinkScreen() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const canSubmit = url.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: URL로 상품 정보 불러오기
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color="#464B47" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>위시 등록</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            value={url}
            onChangeText={setUrl}
            placeholder="URL을 입력하세요."
            placeholderTextColor="#C3C8C4"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <Text style={styles.helper}>무신사, 29센치에서 불러오기 가능</Text>
        </View>

        <View style={styles.buttonWrap}>
          <TouchableOpacity
            style={[styles.button, canSubmit && styles.buttonActive]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.85}
          >
            <Text style={[styles.buttonText, canSubmit && styles.buttonTextActive]}>
              등록하기
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 8,
    height: 48,
  },
  iconBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    color: "#7A5751",
    textShadowColor: "#7A5751",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 132,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  inputSection: {
    gap: 8,
  },
  input: {
    height: 47,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    fontSize: 14,
    fontWeight: "400",
    color: "#141915",
  },
  helper: {
    textAlign: "right",
    color: "#5F6460",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  buttonWrap: {
    alignItems: "center",
    paddingBottom: 20,
  },
  button: {
    width: 230,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCE1DD",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#AAAFAB",
  },
  buttonActive: {
    backgroundColor: "#7EC985",
    borderColor: "#5FAD6A",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Galmuri",
    fontWeight: "400",
    color: "#AAAFAB",
    lineHeight: 24,
  },
  buttonTextActive: {
    color: "#FFFFFF",
  },
});
