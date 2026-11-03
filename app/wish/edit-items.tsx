import { getApiError, getApiErrorMessage } from "@/api/types";
import {
  useCreateWishFolder,
  useDeleteWishItem,
  useMoveWishFolder,
  useWishFolderItems,
  useWishFolders,
  useWishItems,
} from "@/api/wishlist";
import ConfirmModal from "@/components/common/ConfirmModal";
import Toast from "@/components/common/Toast";
import WishCreateFolderModal from "@/components/wish/WishCreateFolderModal";
import WishItemCard from "@/components/wish/WishItemCard";
import WishMoveFolderSheet, { MoveFolderOption } from "@/components/wish/WishMoveFolderSheet";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ALL_FOLDER_ID = "all";

export default function WishEditItemsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { folderId, title } = useLocalSearchParams<{ folderId?: string; title?: string }>();
  const isAllFolder = !folderId || folderId === ALL_FOLDER_ID;
  const allItemsQuery = useWishItems({ status: "WISHLISTED" }, { enabled: isAllFolder });
  const folderItemsQuery = useWishFolderItems(folderId ?? "", undefined, {
    enabled: !isAllFolder,
  });
  const itemsQuery = isAllFolder ? allItemsQuery : folderItemsQuery;
  const items = useMemo(
    () => itemsQuery.data?.pages.flatMap((page) => page.wishitems) ?? [],
    [itemsQuery.data],
  );

  const foldersQuery = useWishFolders();
  const {
    hasNextPage: hasNextFolderPage,
    isFetchingNextPage: isFetchingNextFolderPage,
    fetchNextPage: fetchNextFolderPage,
  } = foldersQuery;
  const moveFolders = useMemo<MoveFolderOption[]>(
    () =>
      (foldersQuery.data?.pages.flatMap((page) => page.folders) ?? [])
        .filter((folder) => folder.id !== folderId)
        .map((folder) => ({ id: folder.id, title: folder.name })),
    [foldersQuery.data, folderId],
  );

  useEffect(() => {
    if (hasNextFolderPage && !isFetchingNextFolderPage) fetchNextFolderPage();
  }, [hasNextFolderPage, isFetchingNextFolderPage, fetchNextFolderPage]);

  const deleteItem = useDeleteWishItem();
  const moveFolder = useMoveWishFolder();
  const createFolder = useCreateWishFolder();
  const isPending = deleteItem.isPending || moveFolder.isPending;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [moveSheetVisible, setMoveSheetVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [selectedMoveFolderId, setSelectedMoveFolderId] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!selectedMoveFolderId && moveFolders.length > 0) {
      setSelectedMoveFolderId(moveFolders[0].id);
    }
  }, [moveFolders, selectedMoveFolderId]);

  const selectedItems = () => items.filter((item) => selectedIds.has(item.id));

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

  const handleMoveFolder = () => {
    if (selectedIds.size === 0) return;
    setMoveSheetVisible(true);
  };

  const handleCompleteMove = async () => {
    if (!selectedMoveFolderId || isPending) return;
    setMoveSheetVisible(false);
    const results = await Promise.allSettled(
      selectedItems().map((item) =>
        moveFolder.mutateAsync({
          itemId: item.id,
          type: item.type,
          folderId: selectedMoveFolderId,
        }),
      ),
    );
    const failed = results.find((result) => result.status === "rejected");
    setSelectedIds(new Set());
    if (failed) {
      Alert.alert("폴더 이동 실패", getApiErrorMessage(failed.reason));
      return;
    }
    setToastMessage("위시템이 이동되었습니다.");
    setToastVisible(true);
  };

  const handleCreateMoveFolder = (name: string) => {
    createFolder.mutate(name, {
      onSuccess: ({ folderId: newFolderId }) => {
        setSelectedMoveFolderId(newFolderId);
        setMoveSheetVisible(true);
      },
      onError: (error) =>
        Alert.alert(
          "폴더 생성 실패",
          getApiError(error)?.code === "DUPLICATE_FOLDER_NAME"
            ? "이미 같은 이름의 폴더가 있어요."
            : getApiErrorMessage(error),
        ),
    });
  };

  const handleConfirmDelete = async () => {
    setConfirmVisible(false);
    if (isPending) return;
    const results = await Promise.allSettled(
      selectedItems().map((item) => deleteItem.mutateAsync({ itemId: item.id, type: item.type })),
    );
    const failed = results.find((result) => result.status === "rejected");
    setSelectedIds(new Set());
    if (failed) {
      Alert.alert("위시템 삭제 실패", getApiErrorMessage(failed.reason));
      return;
    }
    setToastMessage("위시템이 삭제되었습니다.");
    setToastVisible(true);
  };

  const handleEndReached = () => {
    if (itemsQuery.hasNextPage && !itemsQuery.isFetchingNextPage) itemsQuery.fetchNextPage();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.folderTitle}>{title ?? "위시 폴더"}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={32} color="#464B47" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} style={styles.doneBtn} hitSlop={8}>
            <Text style={styles.doneText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortBar}>
        <View style={styles.sortBtn}>
          <Text style={styles.sortLabel}>기본순</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 94 + (insets.bottom || 20) + 20 },
        ]}
        renderItem={({ item }) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <View style={styles.cardWrap}>
              <WishItemCard
                name={item.name}
                price={item.price}
                image={item.photoUrl ?? undefined}
              />
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => toggleSelect(item.id)}
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
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 20 }]}>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.moveFolderBtn}
            onPress={handleMoveFolder}
            activeOpacity={0.85}
          >
            <Ionicons name="folder-outline" size={20} color="#464B47" />
            <Text style={styles.moveFolderText}>폴더 이동</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            activeOpacity={0.85}
          >
            <Ionicons name="trash-outline" size={20} color="#464B47" />
          </TouchableOpacity>
        </View>
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="위시템을 삭제하시겠습니까?"
        description="삭제 시 되돌릴 수 없습니다."
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
      />

      <WishMoveFolderSheet
        visible={moveSheetVisible}
        folders={moveFolders}
        selectedFolderId={selectedMoveFolderId}
        onSelectFolder={setSelectedMoveFolderId}
        onClose={() => setMoveSheetVisible(false)}
        onComplete={handleCompleteMove}
        onCreateFolder={() => {
          setMoveSheetVisible(false);
          setFolderModalVisible(true);
        }}
      />

      <WishCreateFolderModal
        visible={folderModalVisible}
        onClose={() => setFolderModalVisible(false)}
        onCreate={handleCreateMoveFolder}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 4,
  },
  folderTitle: {
    fontSize: 24,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    color: "#7A5751",
    textShadowColor: "#7A5751",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
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
  sortBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    alignSelf: "flex-start",
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: "WantedSansMedium",
    fontWeight: "500",
    color: "#464B47",
    lineHeight: 21,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  row: {
    gap: 11,
  },
  cardWrap: {
    flex: 1,
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 164,
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
    backgroundColor: "#FAFFF9",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    boxShadow: "0px -4px 10px rgba(137, 166, 100, 0.30)",
    elevation: 8,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 12,
    paddingRight: 20,
  },
  bottomActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moveFolderBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 9,
    paddingHorizontal: 16,
    backgroundColor: "#F0FFE5",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#9CCCA0",
  },
  moveFolderText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#464B47",
    lineHeight: 21,
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
