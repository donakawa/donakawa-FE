import MenuDropdown from "@/components/common/MenuDropdown";
import MoreButton from "@/components/common/MoreButton";
import SortDropdown, { SortOption } from "@/components/common/SortDropdown";
import WishAddMenuDropdown from "@/components/wish/WishAddMenuDropdown";
import WishItemCard from "@/components/wish/WishItemCard";
import {
  createRandomWishDummyProducts,
  type WishDummyProduct,
} from "@/constants/wishDummyData";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type SortType = "default" | "price_asc" | "price_desc";

const SORT_OPTIONS: SortOption<SortType>[] = [
  { label: "기본순", value: "default" },
  { label: "가격 낮은순", value: "price_asc" },
  { label: "가격 높은순", value: "price_desc" },
];

type ProductItem = WishDummyProduct & { type: "product" };
type AddItem = { type: "add"; id: string };
type ListItem = ProductItem | AddItem;

const createMockItems = (): ListItem[] => [
  { type: "add", id: "add" },
  ...createRandomWishDummyProducts().map((item) => ({ ...item, type: "product" as const })),
];

export default function WishFolderDetailScreen() {
  const router = useRouter();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const [items] = useState<ListItem[]>(createMockItems);
  const [addMenuVisible, setAddMenuVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title ?? "위시 폴더");
  const [draftTitle, setDraftTitle] = useState(title ?? "위시 폴더");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleTitleSubmit = () => {
    const trimmed = draftTitle.trim();
    if (trimmed) setCurrentTitle(trimmed);
    else setDraftTitle(currentTitle);
    setIsEditingTitle(false);
  };
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ top: 0, right: 20 });
  const moreButtonRef = useRef<View>(null);

  const handleMorePress = () => {
    moreButtonRef.current?.measure((_x: number, _y: number, _w: number, height: number, _pageX: number, pageY: number) => {
      setMenuAnchor({ top: pageY + height + 4, right: 20 });
      setMenuVisible(true);
    });
  };
  const [sort, setSort] = useState<SortType>("default");
  const [sortVisible, setSortVisible] = useState(false);
  const [sortAnchor, setSortAnchor] = useState({ top: 0, left: 20 });
  const sortButtonRef = useRef<View>(null);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "기본순";

  const handleSortPress = () => {
    sortButtonRef.current?.measure((_x: number, _y: number, _w: number, height: number, pageX: number, pageY: number) => {
      setSortAnchor({ top: pageY + height + 4, left: pageX });
      setSortVisible(true);
    });
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "add") {
      return (
        <TouchableOpacity
          style={styles.emptyCard}
          activeOpacity={0.7}
          onPress={() => setAddMenuVisible(true)}
        >
          <View style={styles.emptyImageBox} />
          <View style={styles.emptyInfo}>
            <Text style={styles.emptyTitle}>상품 넣기</Text>
            <Text style={styles.emptySubtitle}>이 폴더에 위시 추가</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <WishItemCard
        name={item.name}
        price={item.price}
        image={item.image}
        onSale={item.onSale}
        onPress={() =>
          router.push({
            pathname: "/wish/item",
            params: {
              name: item.name,
              price: String(item.price),
              onSale: String(!!item.onSale),
              imageKey: item.imageKey,
            },
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isEditingTitle ? (
          <TextInput
            style={styles.headerTitleInput}
            value={draftTitle}
            onChangeText={setDraftTitle}
            onBlur={handleTitleSubmit}
            onSubmitEditing={handleTitleSubmit}
            returnKeyType="done"
            autoFocus
            selectTextOnFocus
          />
        ) : (
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentTitle}
          </Text>
        )}
        <View style={styles.headerActionRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="chevron-back" size={32} color="#464B47" />
          </TouchableOpacity>
          <View style={styles.iconBtn}>
            <MoreButton ref={moreButtonRef} onPress={handleMorePress} />
          </View>
        </View>
      </View>

      <View style={styles.sortBar}>
        <TouchableOpacity
          ref={sortButtonRef}
          style={styles.sortBtn}
          onPress={handleSortPress}
          activeOpacity={0.7}
        >
          <Text style={styles.sortLabel}>{currentSortLabel}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
      />

      <WishAddMenuDropdown
        visible={addMenuVisible}
        onClose={() => setAddMenuVisible(false)}
        onLinkRegister={() => router.push({ pathname: "/wish/register-link", params: { folderId: id } })}
        onDirectRegister={() => router.push({ pathname: "/wish/register-direct", params: { folderId: id } })}
      />

      <MenuDropdown
        visible={menuVisible}
        items={[
          { label: "위시 편집", onPress: () => router.push({ pathname: "/wish/edit-items", params: { folderId: id, title: currentTitle } }) },
          { label: "폴더 이름 수정", onPress: () => { setDraftTitle(currentTitle); setIsEditingTitle(true); } },
        ]}
        onClose={() => setMenuVisible(false)}
        anchorTop={menuAnchor.top}
        anchorRight={menuAnchor.right}
      />

      <SortDropdown
        visible={sortVisible}
        options={SORT_OPTIONS}
        selectedValue={sort}
        onSelect={setSort}
        onClose={() => setSortVisible(false)}
        anchorTop={sortAnchor.top}
        anchorLeft={sortAnchor.left}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    width: "100%",
    paddingHorizontal: 29,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 16,
  },
  headerActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    color: "#7A5751",
    lineHeight: 36,
    textShadowColor: "#7A5751",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
  headerTitleInput: {
    fontSize: 24,
    fontFamily: "GalmuriBold",
    fontWeight: "700",
    color: "#7A5751",
    borderBottomWidth: 1,
    borderBottomColor: "#7A5751",
    paddingVertical: 0,
    lineHeight: 36,
    textShadowColor: "#7A5751",
    textShadowOffset: { width: 0.6, height: 0 },
    textShadowRadius: 0,
  },
  sortBar: {
    width: "100%",
    paddingHorizontal: 29,
    paddingBottom: 12,
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
    paddingBottom: 100,
  },
  row: {
    gap: 11,
  },
  emptyCard: {
    flex: 1,
    gap: 12,
  },
  emptyImageBox: {
    height: 164,
    backgroundColor: "#FAFFF9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0F9BF",
  },
  emptyInfo: {
    gap: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D322E",
    lineHeight: 24,
  },
  emptySubtitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#787D79",
    lineHeight: 21,
  },
});
