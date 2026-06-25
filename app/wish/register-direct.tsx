import AlertModal from "@/components/common/AlertModal";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FormData {
  store: string;
  name: string;
  price: string;
  brand: string;
  reason: string;
  link: string;
}

export default function WishRegisterDirectScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    store: "",
    name: "",
    price: "",
    brand: "",
    reason: "",
    link: "",
  });

  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const canSubmit = form.name.trim().length > 0;

  const update = (key: keyof FormData) => (text: string) =>
    setForm((prev) => ({ ...prev, [key]: text }));

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      showAlert("사진 보관함 접근 권한이 필요합니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (!form.price.trim()) {
      showAlert("가격을 입력해주세요.");
      return;
    }
    if (!form.reason.trim()) {
      showAlert("위시 이유를 입력해주세요.");
      return;
    }
    // TODO: 상품 등록 API
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color="#464B47" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>위시 등록</Text>
        </View>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!canSubmit}
          hitSlop={8}
          style={styles.doneBtn}
        >
          <Text style={[styles.doneText, canSubmit && styles.doneTextActive]}>완료</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 이미지 + 스토어 */}
          <View style={styles.topSection}>
            <TouchableOpacity
              style={styles.imageBox}
              activeOpacity={0.8}
              onPress={handlePickImage}
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              ) : null}
              <View style={[styles.cameraBtn, imageUri && styles.cameraBtnOverlay]}>
                <Ionicons name="camera" size={22} color="#FBFBF5" />
              </View>
            </TouchableOpacity>

            <View style={styles.storeSection}>
              <View style={styles.storeRow}>
                <View style={styles.storeBadge}>
                  <Ionicons name="storefront-outline" size={12} color="#7A5751" />
                </View>
                <TextInput
                  style={styles.storeInput}
                  value={form.store}
                  onChangeText={update("store")}
                  placeholder="저장할 스토어를 입력해주세요."
                  placeholderTextColor="#AAAFAB"
                  returnKeyType="done"
                />
              </View>
              <View style={styles.storeUnderline} />
            </View>
          </View>

          {/* 폼 카드 */}
          <View style={styles.formCard}>
            <FormField
              label="상품명"
              value={form.name}
              onChangeText={update("name")}
              placeholder="ex. 레고 세트"
            />
            <FormField
              label="가격"
              value={form.price}
              onChangeText={update("price")}
              placeholder="ex. 43,200원"
              keyboardType="numeric"
            />
            <FormField
              label="브랜드"
              value={form.brand}
              onChangeText={update("brand")}
              placeholder="ex. LEGO"
            />
            <FormField
              label="위시로 담은 이유"
              value={form.reason}
              onChangeText={update("reason")}
              placeholder="ex. 어렸을 때 못 이룬 꿈"
            />
            <FormField
              label="상품 링크"
              value={form.link}
              onChangeText={update("link")}
              placeholder="ex. 상품 링크를 입력해주세요."
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
      />
    </View>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric" | "url";
  autoCapitalize?: "none" | "sentences";
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
}: FormFieldProps) {
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={fieldStyles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#C3C8C4"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType="done"
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#787D79",
    lineHeight: 18,
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 8,
    paddingRight: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
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
  doneBtn: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
  },
  doneText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#919692",
    lineHeight: 27,
  },
  doneTextActive: {
    color: "#464B47",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 29,
    paddingBottom: 40,
    gap: 28,
  },
  topSection: {
    width: 236,
    alignSelf: "center",
    alignItems: "center",
    gap: 24,
  },
  imageBox: {
    width: 186,
    height: 186,
    backgroundColor: "#FAFFF9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePreview: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  cameraBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraBtnOverlay: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
  storeSection: {
    alignSelf: "stretch",
    gap: 8,
  },
  storeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  storeBadge: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "#E8F9C7",
    borderWidth: 1,
    borderColor: "#E0F9BF",
    justifyContent: "center",
    alignItems: "center",
  },
  storeInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "#141915",
    padding: 0,
  },
  storeUnderline: {
    height: 1,
    backgroundColor: "#7A5751",
  },
  formCard: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "#F0FFE5",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#E0F9BF",
    gap: 16,
  },
});
