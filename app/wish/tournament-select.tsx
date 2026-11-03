import { TOURNAMENT_ALLOWED_SIZES } from "@/api/tournaments";
import { useWishFolderItems, useWishFolders, useWishItems, type WishFolder } from "@/api/wishlist";
import FolderCard from "@/components/common/FolderCard";
import WishFlowBottomBar from "@/components/wish/WishFlowBottomBar";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const MAX_SELECT = 16;

const PREVIEW_TAKE = 4;
const ALL_FOLDER_ID = "all";

const toPreviewImages = (pages: { wishitems: { photoUrl: string | null }[] }[] = []) =>
  pages
    .flatMap((page) => page.wishitems)
    .map((item) => item.photoUrl)
    .filter((url): url is string => !!url)
    .slice(0, PREVIEW_TAKE);

function useAllWishFolders() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useWishFolders();

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return data?.pages.flatMap((page) => page.folders) ?? [];
}

function AllFolderCard({ onPress }: { onPress: () => void }) {
  const { data } = useWishItems({ status: "WISHLISTED", take: PREVIEW_TAKE });
  return (
    <FolderCard
      title="전체 위시리스트"
      images={toPreviewImages(data?.pages)}
      onPress={onPress}
    />
  );
}

function WishFolderCard({ folder, onPress }: { folder: WishFolder; onPress: () => void }) {
  const { data } = useWishFolderItems(folder.id, PREVIEW_TAKE);
  return (
    <FolderCard title={folder.name} images={toPreviewImages(data?.pages)} onPress={onPress} />
  );
}

export default function TournamentSelectScreen() {
  const router = useRouter();
  const folders = useAllWishFolders();

  // TODO: 폴더를 넘나드는 선택을 하려면 선택 상태를 화면 간에 공유해야 함.
  // 현재는 tournament-items 화면 안에서만 선택/생성하므로 이 화면의 카운터는 항상 0
  const selectedCount = 0;

  const goToItems = (folderId: string) => {
    router.push({ pathname: "/wish/tournament-items", params: { folderId } });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar onBack={() => router.back()} rightVariant="menu" />

      <WishFlowTitleBanner title="후보를 선택" />

      {/* Folder grid */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.folderGrid}>
          <AllFolderCard onPress={() => goToItems(ALL_FOLDER_ID)} />
          {folders.map((folder) => (
            <WishFolderCard
              key={folder.id}
              folder={folder}
              onPress={() => goToItems(folder.id)}
            />
          ))}
        </View>
      </ScrollView>

      <WishFlowBottomBar
        notice={`*${TOURNAMENT_ALLOWED_SIZES.join(", ")}개의 위시템을 선택해 주세요.`}
        current={selectedCount}
        max={MAX_SELECT}
        canConfirm={false}
        onConfirm={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 160,
  },
  folderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 11,
    rowGap: 16,
  },
});
