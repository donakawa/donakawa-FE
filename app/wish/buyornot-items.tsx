import { useCreateChat } from "@/api/chats";
import { getApiErrorMessage } from "@/api/types";
import {
  useWishFolderItems,
  useWishItems,
  type WishItemSummary,
} from "@/api/wishlist";
import WishFlowBottomBar from "@/components/wish/WishFlowBottomBar";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import WishItemCard from "@/components/wish/WishItemCard";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

const ALL_FOLDER_ID = "all";
const PAGE_TAKE = 10;

const toItemKey = (item: WishItemSummary) => `${item.type}-${item.id}`;

export default function BuyOrNotItemsScreen() {
  const router = useRouter();
  const { folderId = ALL_FOLDER_ID } = useLocalSearchParams<{ folderId?: string }>();
  const isAllFolder = folderId === ALL_FOLDER_ID;

  const allItemsQuery = useWishItems(
    { status: "WISHLISTED", take: PAGE_TAKE },
    { enabled: isAllFolder },
  );
  const folderItemsQuery = useWishFolderItems(folderId, PAGE_TAKE, {
    enabled: !isAllFolder,
  });
  const itemsQuery = isAllFolder ? allItemsQuery : folderItemsQuery;
  const items = itemsQuery.data?.pages.flatMap((page) => page.wishitems) ?? [];

  const [selected, setSelected] = useState<WishItemSummary | null>(null);
  const createChat = useCreateChat();

  const canConfirm = selected !== null && !createChat.isPending;

  const selectItem = (item: WishItemSummary) => {
    setSelected((prev) =>
      prev && toItemKey(prev) === toItemKey(item) ? null : item,
    );
  };

  const handleConfirm = () => {
    if (!selected) return;
    createChat.mutate(
      // TODO: 위시 API의 id는 string, 채팅 API의 wishItemId는 number라 변환 (API 타입 통일 필요)
      { wishItemId: Number(selected.id), type: selected.type },
      {
        onSuccess: ({ id }) =>
          router.push({
            pathname: "/buyOrNot",
            params: { chatId: String(id), wishItemId: selected.id, type: selected.type },
          }),
        onError: (error) => Alert.alert("살말추천 시작 실패", getApiErrorMessage(error)),
      },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar onBack={() => router.back()} rightVariant="menu" />

      <WishFlowTitleBanner title="고민되는 위시를 선택" dotCount={1} />

      <FlatList
        data={items}
        keyExtractor={toItemKey}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        onEndReached={() => {
          if (itemsQuery.hasNextPage && !itemsQuery.isFetchingNextPage) {
            itemsQuery.fetchNextPage();
          }
        }}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <WishItemCard
              name={item.name}
              price={item.price}
              image={item.photoUrl ?? undefined}
              selectable
              selected={selected !== null && toItemKey(selected) === toItemKey(item)}
              onPress={() => selectItem(item)}
            />
          </View>
        )}
      />

      <WishFlowBottomBar canConfirm={canConfirm} onConfirm={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 160,
  },
  row: {
    gap: 7,
    justifyContent: "flex-start",
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "50%",
  },
});
