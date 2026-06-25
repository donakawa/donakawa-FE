import AddFolderButton from "@/components/common/AddFolderButton";
import FolderCard from "@/components/common/FolderCard";
import MenuDropdown from "@/components/common/MenuDropdown";
import MoreButton from "@/components/common/MoreButton";
import WishAddMenuDropdown from "@/components/common/WishAddMenuDropdown";
import TournamentBanner from "@/components/wish/TournamentBanner";
import WishCreateFolderModal from "@/components/wish/WishCreateFolderModal";
import { WISH_DUMMY_IMAGES, getRandomWishDummyImages } from "@/constants/wishDummyData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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

export default function WishScreen() {
  const router = useRouter();
  const [folders, setFolders] = useState<WishFolder[]>(INITIAL_FOLDERS);
  const [fabVisible, setFabVisible] = useState(false);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, right: 20 });
  const menuButtonRef = useRef<View>(null);

  const handleMenuPress = () => {
    menuButtonRef.current?.measure((_x, _y, _w, height, _pageX, pageY) => {
      setMenuAnchor({ top: pageY + height + 4, right: 20 });
      setMenuVisible(true);
    });
  };

  const goToFolder = (folder: WishFolder) =>
    router.push({ pathname: "/wish/[id]", params: { id: folder.id, title: folder.title } });

  const handleCreateFolder = (name: string) => {
    setFolders((prev) => [
      ...prev,
      { id: Date.now().toString(), title: name, images: getRandomWishDummyImages() },
    ]);
  };

  const handleRenameFolder = (id: string, newTitle: string) => {
    setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, title: newTitle } : f)));
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
            title={ALL_FOLDER.title}
            images={ALL_FOLDER.images}
            onPress={() => goToFolder(ALL_FOLDER)}
          />
          <AddFolderButton onPress={() => setFolderModalVisible(true)} />
          {folders.map((folder) => (
            <FolderCard
              key={folder.id}
              title={folder.title}
              images={folder.images}
              onPress={() => goToFolder(folder)}
              onTitleEdit={(newTitle) => handleRenameFolder(folder.id, newTitle)}
            />
          ))}
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
