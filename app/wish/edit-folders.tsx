import ConfirmModal from "@/components/common/ConfirmModal";
import FolderCard from "@/components/common/FolderCard";
import Toast from "@/components/common/Toast";
import { WISH_DUMMY_IMAGES, getRandomWishDummyImages } from "@/constants/wishDummyData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Image,
  type ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Folder {
  id: string;
  title: string;
  images: ImageSourcePropType[];
}

const FOLDERS: Folder[] = [
  {
    id: "all",
    title: "냐냐냥!!??",
    images: WISH_DUMMY_IMAGES,
  },
  {
    id: "1",
    title: "세일 중...",
    images: getRandomWishDummyImages(),
  },
  {
    id: "2",
    title: "살까 말까",
    images: getRandomWishDummyImages(),
  },
];

export default function WishEditFoldersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    setConfirmVisible(false);
    // TODO: 선택된 폴더 삭제 API
    setSelectedIds(new Set());
    setToastMessage("폴더가 삭제되었습니다.");
    setToastVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={32} color="#464B47" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>폴더 편집</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} style={styles.doneBtn} hitSlop={8}>
          <Text style={styles.doneText}>완료</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 94 + (insets.bottom || 20) + 20 },
        ]}
      >
        <View style={styles.grid}>
          {FOLDERS.map((folder) => {
            const isSelected = selectedIds.has(folder.id);
            return (
              <View key={folder.id} style={styles.cardWrap}>
                <FolderCard title={folder.title} images={folder.images} />
                <TouchableOpacity
                  style={styles.overlay}
                  onPress={() => toggleSelect(folder.id)}
                activeOpacity={1}
              >
                <View style={styles.checkbox}>
                    {isSelected && (
                      <Image
                        source={require("@/assets/images/wish/check-icon.png")}
                        style={styles.checkIcon}
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 20 }]}>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDelete}
          activeOpacity={0.85}
        >
          <Ionicons name="trash-outline" size={20} color="#464B47" />
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="폴더를 삭제하시겠습니까?"
        description="폴더를 삭제하더라도 위시템은 유지됩니다."
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
      />

      <Toast
        visible={toastVisible}
        message={toastMessage}
        onHide={() => {
          setToastVisible(false);
          router.back();
        }}
        bottom={94 + (insets.bottom || 20) + 16}
      />
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
    color: "#7EC985",
    lineHeight: 27,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 29,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  cardWrap: {
    position: "relative",
    width: 162,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 162,
    height: 162,
    backgroundColor: "rgba(0, 0, 0, 0.40)",
    borderRadius: 5,
  },
  checkbox: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: "#F0FFE5",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    width: 23,
    height: 23,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 94,
    backgroundColor: "rgba(250, 255, 249, 0.92)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    boxShadow: "0px -4px 10px rgba(137, 166, 100, 0.30)",
    elevation: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingTop: 12,
    paddingRight: 20,
  },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FFE5",
    borderWidth: 1,
    borderColor: "#9CCCA0",
    justifyContent: "center",
    alignItems: "center",
  },
});
