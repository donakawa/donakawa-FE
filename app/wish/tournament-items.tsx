import {
  TOURNAMENT_ALLOWED_SIZES,
  isValidTournamentSize,
  useCreateTournament,
} from "@/api/tournaments";
import { getApiErrorMessage } from "@/api/types";
import {
  useWishFolderItems,
  useWishItems,
  type WishItemSummary,
} from "@/api/wishlist";
import TournamentMenu from "@/components/wish/TournamentMenu";
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
const MAX_SELECT = Math.max(...TOURNAMENT_ALLOWED_SIZES);

const toItemKey = (item: WishItemSummary) => `${item.type}-${item.id}`;

// TODO: 토너먼트 제목을 입력받는 화면이 없어 생성 날짜로 기본 제목을 만듦 (디자인 확정 시 교체)
const createDefaultTournamentTitle = (date = new Date()) =>
  `${date.getMonth() + 1}월 ${date.getDate()}일 토너먼트`;

export default function TournamentItemsScreen() {
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

  const [selected, setSelected] = useState<Map<string, WishItemSummary>>(new Map());
  const createTournament = useCreateTournament();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const selectedCount = selected.size;
  const canConfirm = isValidTournamentSize(selectedCount) && !createTournament.isPending;

  const toggleSelect = (item: WishItemSummary) => {
    const key = toItemKey(item);
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(key)) {
        next.delete(key);
      } else if (next.size < MAX_SELECT) {
        next.set(key, item);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    createTournament.mutate(
      {
        title: createDefaultTournamentTitle(),
        // TODO: 위시 API의 id는 string, 토너먼트 API의 wishItemId는 number라 변환 (API 타입 통일 필요)
        wishItems: [...selected.values()].map((item) => ({
          wishItemId: Number(item.id),
          type: item.type,
        })),
      },
      {
        onSuccess: ({ id }) =>
          router.replace({ pathname: "/wish/tournament-play", params: { id: String(id) } }),
        onError: (error) => Alert.alert("토너먼트 생성 실패", getApiErrorMessage(error)),
      },
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar
        onBack={() => router.back()}
        rightVariant="menu"
        onRightPress={() => setIsMenuVisible(true)}
      />

      <WishFlowTitleBanner title="후보를 선택" />

      <FlatList
        data={items}
        keyExtractor={toItemKey}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        onEndReached={() => {
          if (itemsQuery.hasNextPage && !itemsQuery.isFetchingNextPage) {
            itemsQuery.fetchNextPage();
          }
        }}
        renderItem={({ item }) => (
          <WishItemCard
            name={item.name}
            price={item.price}
            image={item.photoUrl ?? undefined}
            selectable
            selected={selected.has(toItemKey(item))}
            onPress={() => toggleSelect(item)}
          />
        )}
      />

      <WishFlowBottomBar
        notice={`*${TOURNAMENT_ALLOWED_SIZES.join(", ")}개의 위시템을 선택해 주세요.`}
        current={selectedCount}
        max={MAX_SELECT}
        canConfirm={canConfirm}
        onConfirm={handleConfirm}
      />

      <TournamentMenu visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
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
  },
});
