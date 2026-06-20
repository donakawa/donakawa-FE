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
import { useState } from "react";
import {
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const MIN_SELECT = 4;
const MAX_SELECT = 16;

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

export default function TournamentSelectScreen() {
  const router = useRouter();
  const [selectedCount] = useState(0);

  const canConfirm = selectedCount >= MIN_SELECT;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar onBack={() => router.back()} rightVariant="menu" />

      <WishFlowTitleBanner title="후보를 선택" />

      {/* Folder grid */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.folderGrid}>
          <FolderCard
            title={ALL_FOLDER.title}
            images={ALL_FOLDER.images}
            onPress={() =>
              router.push({
                pathname: "/wish/tournament-items",
                params: { folderId: ALL_FOLDER.id },
              })
            }
          />
          {INITIAL_FOLDERS.map((folder) => (
            <FolderCard
              key={folder.id}
              title={folder.title}
              images={folder.images}
              onPress={() =>
                router.push({
                  pathname: "/wish/tournament-items",
                  params: { folderId: folder.id },
                })
              }
            />
          ))}
        </View>
      </ScrollView>

      <WishFlowBottomBar
        notice={`*최소 ${MIN_SELECT}개의 위시템을 선택해 주세요.`}
        current={selectedCount}
        max={MAX_SELECT}
        canConfirm={canConfirm}
        onConfirm={() => {
          // TODO: 다음 단계(토너먼트 진행) 페이지 연결
        }}
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
