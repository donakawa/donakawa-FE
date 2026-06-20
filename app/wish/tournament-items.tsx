import WishFlowBottomBar from "@/components/wish/WishFlowBottomBar";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import WishItemCard from "@/components/wish/WishItemCard";
import { createRandomWishDummyProducts } from "@/constants/wishDummyData";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

const MIN_SELECT = 4;
const MAX_SELECT = 16;

export default function TournamentItemsScreen() {
  const router = useRouter();
  const { folderId } = useLocalSearchParams<{ folderId?: string }>();

  const items = useMemo(() => createRandomWishDummyProducts(), []);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;
  const canConfirm = selectedCount >= MIN_SELECT;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SELECT) {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar onBack={() => router.back()} rightVariant="menu" />

      <WishFlowTitleBanner title="후보를 선택" />

      {/* Item grid */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <WishItemCard
            name={item.name}
            price={item.price}
            image={item.image}
            onSale={item.onSale}
            selectable
            selected={selectedIds.has(item.id)}
            onPress={() => toggleSelect(item.id)}
          />
        )}
      />

      <WishFlowBottomBar
        notice={`*최소 ${MIN_SELECT}개의 위시템을 선택해 주세요.`}
        current={selectedCount}
        max={MAX_SELECT}
        canConfirm={canConfirm}
        onConfirm={() => {
          router.push({
            pathname: "/wish/tournament-play",
            params: {
              folderId,
              itemIds: Array.from(selectedIds).join(","),
            },
          });
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
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 160,
  },
  row: {
    gap: 7,
  },
});
