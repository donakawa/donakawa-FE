import WishFlowBottomBar from "@/components/wish/WishFlowBottomBar";
import WishFlowTitleBanner from "@/components/wish/WishFlowTitleBanner";
import WishFlowTopBar from "@/components/wish/WishFlowTopBar";
import WishItemCard from "@/components/wish/WishItemCard";
import { createRandomWishDummyProducts } from "@/constants/wishDummyData";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function BuyOrNotItemsScreen() {
  const router = useRouter();
  const { folderId } = useLocalSearchParams<{ folderId?: string }>();

  const items = useMemo(() => createRandomWishDummyProducts(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canConfirm = selectedId !== null;

  const selectItem = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <WishFlowTopBar onBack={() => router.back()} rightVariant="menu" />

      <WishFlowTitleBanner title="고민되는 위시를 선택" dotCount={1} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <WishItemCard
              name={item.name}
              price={item.price}
              image={item.image}
              onSale={item.onSale}
              selectable
              selected={selectedId === item.id}
              onPress={() => selectItem(item.id)}
            />
          </View>
        )}
      />

      <WishFlowBottomBar
        canConfirm={canConfirm}
        onConfirm={() => router.push("/buyOrNot")}
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
    justifyContent: "flex-start",
  },
  itemWrapper: {
    flex: 1,
    maxWidth: "50%",
  },
});
