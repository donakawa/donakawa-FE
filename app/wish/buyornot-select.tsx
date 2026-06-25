import FolderCard from "@/components/common/FolderCard";
import WishFlowBottomBar from "@/components/wish/WishFlowBottomBar";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import {
  WISH_DUMMY_IMAGES,
  getRandomWishDummyImages,
} from "@/constants/wishDummyData";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

type WishFolder = {
  id: string;
  title: string;
  images: ImageSourcePropType[];
};

const ALL_FOLDER: WishFolder = {
  id: "all",
  title: "전체 위시리스트",
  images: WISH_DUMMY_IMAGES,
};

const INITIAL_FOLDERS: WishFolder[] = [
  { id: "1", title: "세일 중...", images: getRandomWishDummyImages() },
  { id: "2", title: "살까 말까", images: getRandomWishDummyImages() },
  { id: "3", title: "이번 달 후보", images: getRandomWishDummyImages() },
];

export default function BuyOrNotSelectScreen() {
  const router = useRouter();

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
          <FolderCard
            title={ALL_FOLDER.title}
            images={ALL_FOLDER.images}
            onPress={() => goToItems(ALL_FOLDER.id)}
          />
          {INITIAL_FOLDERS.map((folder) => (
            <FolderCard
              key={folder.id}
              title={folder.title}
              images={folder.images}
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
