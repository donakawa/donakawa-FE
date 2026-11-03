import { useWishFolderItems, useWishFolders, useWishItems, type WishFolder } from "@/api/wishlist";
import FolderCard from "@/components/common/FolderCard";
import WishFlowBottomBar from "@/components/wish/WishFlowBottomBar";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

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

export default function BuyOrNotSelectScreen() {
  const router = useRouter();
  const folders = useAllWishFolders();

  const goToItems = (folderId: string) => {
    router.push({
      pathname: "/wish/buyornot-items",
      params: { folderId },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar onBack={() => router.back()} rightVariant="menu" />

      <WishFlowTitleBanner title="고민되는 위시를 선택" dotCount={1} />

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
