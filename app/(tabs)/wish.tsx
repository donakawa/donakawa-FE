import { useCreateWishFolder, useWishFolders, useWishItems } from "@/api/wishlist";
import { getApiError, getApiErrorMessage } from "@/api/types";
import AddFolderButton from "@/components/common/AddFolderButton";
import FolderCard from "@/components/common/FolderCard";
import MenuDropdown from "@/components/common/MenuDropdown";
import MoreButton from "@/components/common/MoreButton";
import WishAddMenuDropdown from "@/components/common/WishAddMenuDropdown";
import TournamentBanner from "@/components/wish/TournamentBanner";
import WishCreateFolderModal from "@/components/wish/WishCreateFolderModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { type ComponentRef, useEffect, useMemo, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ALL_FOLDER_ID = "all";
const ALL_FOLDER_TITLE = "전체 위시리스트";

export default function WishScreen() {
  const router = useRouter();
  const [fabVisible, setFabVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, right: 20 });
  const menuButtonRef = useRef<ComponentRef<typeof View>>(null);
  // TODO: 폴더 이름 수정 API가 없어 화면에서만 반영 (새로고침/재조회 시 원래 이름으로 돌아감)
  const [renamedTitles, setRenamedTitles] = useState<Record<string, string>>({});

  const foldersQuery = useWishFolders();
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = foldersQuery;
  const folders = useMemo(
    () => foldersQuery.data?.pages.flatMap((page) => page.folders) ?? [],
    [foldersQuery.data],
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // TODO: 폴더 API는 미리보기 이미지를 내려주지 않아 일반 폴더는 빈 썸네일로 표시됨
  const allItemsQuery = useWishItems({ status: "WISHLISTED" });
  const allFolderImages = (allItemsQuery.data?.pages[0]?.wishitems ?? [])
    .map((item) => item.photoUrl)
    .filter((url): url is string => !!url)
    .slice(0, 4);

  const createFolder = useCreateWishFolder();

  const handleMenuPress = () => {
    menuButtonRef.current?.measure((_x, _y, _w, height, _pageX, pageY) => {
      setMenuAnchor({ top: pageY + height + 4, right: 20 });
      setMenuVisible(true);
    });
  };

  const goToFolder = (id: string, title: string) =>
    router.push({ pathname: "/wish/[id]", params: { id, title } });

  const handleCreateFolder = (name: string) => {
    createFolder.mutate(name, {
      onError: (error) =>
        Alert.alert(
          "폴더 생성 실패",
          getApiError(error)?.code === "DUPLICATE_FOLDER_NAME"
            ? "이미 같은 이름의 폴더가 있어요."
            : getApiErrorMessage(error),
        ),
    });
  };

  const handleRenameFolder = (id: string, newTitle: string) => {
    setRenamedTitles((prev) => ({ ...prev, [id]: newTitle }));
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wish List</Text>
        <MoreButton ref={menuButtonRef} onPress={handleMenuPress} />
      </View>
      <View style={styles.tournamentBannerWrap}>
        <TournamentBanner onPress={() => router.push("/wish/tournament")} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.folderGrid}>
          <FolderCard
            title={ALL_FOLDER_TITLE}
            images={allFolderImages}
            onPress={() => goToFolder(ALL_FOLDER_ID, ALL_FOLDER_TITLE)}
          />
          <AddFolderButton onPress={() => setFolderModalVisible(true)} />
          {folders.map((folder) => {
            const title = renamedTitles[folder.id] ?? folder.name;
            return (
              <FolderCard
                key={folder.id}
                title={title}
                onPress={() => goToFolder(folder.id, title)}
                onTitleEdit={(newTitle) => handleRenameFolder(folder.id, newTitle)}
              />
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.wishButton}
        activeOpacity={0.85}
        onPress={() => setFabVisible(true)}
      >
        <View style={styles.wishButtonInner}>
          <Ionicons name="heart" size={18} color="#E67972" />
          <Text style={styles.wishButtonLabel}>Wish</Text>
        </View>
      </TouchableOpacity>

      <WishAddMenuDropdown
        visible={fabVisible}
        onClose={() => setFabVisible(false)}
        onLinkRegister={() => {
          setFabVisible(false);
          router.push("/wish/register-link");
        }}
        onDirectRegister={() => {
          setFabVisible(false);
          router.push("/wish/register-direct");
        }}
      />

      <WishCreateFolderModal
        visible={folderModalVisible}
        onClose={() => setFolderModalVisible(false)}
        onCreate={handleCreateFolder}
      />

      <MenuDropdown
        visible={menuVisible}
        items={[
          {
            label: "폴더 편집",
            onPress: () => router.push("/wish/edit-folders"),
          },
        ]}
        onClose={() => setMenuVisible(false)}
        anchorTop={menuAnchor.top}
        anchorRight={menuAnchor.right}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFFDF8" },
  header: {
    height: 48,
    marginHorizontal: 20,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#7A5751",
    fontSize: 22,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    textShadowColor: "#7A5751",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
  tournamentBannerWrap: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  folderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    columnGap: 11,
    rowGap: 16,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  wishButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    padding: 9,
    backgroundColor: "#FFDBEB",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E67972",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "-4px -4px 4px rgba(104, 171, 110, 0.30) inset, 4px 4px 2px rgba(255, 255, 255, 0.30) inset",
  },
  wishButtonInner: {
    width: 40,
    paddingHorizontal: 2,
    paddingVertical: 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
    alignItems: "center",
    gap: 3,
  },
  wishButtonLabel: {
    color: "#3D2B27",
    fontSize: 12,
    fontFamily: "Galmuri9",
    lineHeight: 18,
    textAlign: "center",
  },
});
