import ConfirmModal from "@/components/common/ConfirmModal";
import CalendarModal from "@/components/wish/CalendarModal";
import PurchaseCompleteModal from "@/components/wish/PurchaseCompleteModal";
import TournamentBanner from "@/components/wish/TournamentBanner";
import {
  WISH_DUMMY_IMAGE_KEYS,
  getWishDummyImageByKey,
  type WishDummyImageKey,
} from "@/constants/wishDummyData";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_MEMO = 30;
const WISH_ITEM_IMAGE = require("@/assets/images/wish/wishItem.png");

const isWishDummyImageKey = (key?: string): key is WishDummyImageKey =>
  WISH_DUMMY_IMAGE_KEYS.includes(key as WishDummyImageKey);

type PurchaseRecord = {
  date: Date;
  price: string;
};

export default function WishItemDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [memo, setMemo] = useState("더 이상은 못참겠다 사람이 한계가 있어 이래야\n내가 산다");
  const [abandonModalVisible, setAbandonModalVisible] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [purchaseCompleteVisible, setPurchaseCompleteVisible] = useState(false);
  const [purchaseRecord, setPurchaseRecord] = useState<PurchaseRecord | null>(null);

  const handleAbandon = () => {
    setAbandonModalVisible(false);
    // TODO: 구매 포기 API 호출
  };
  const { name, price, onSale, image, imageKey } = useLocalSearchParams<{
    name: string;
    price: string;
    onSale?: string;
    image?: string;
    imageKey?: string;
  }>();

  const priceNum = Number(price) || 57300;
  const isSale = onSale === "true";
  const imageSource: ImageSourcePropType = isWishDummyImageKey(imageKey)
    ? getWishDummyImageByKey(imageKey)
    : image
      ? { uri: image }
      : WISH_ITEM_IMAGE;
  const itemName = name || "ZARA 시티 걸 드레스 그린";

  const handlePurchaseConfirm = (start: Date, _end: Date | null, purchasePrice: string) => {
    setPurchaseModalVisible(false);
    setPurchaseRecord({ date: start, price: purchasePrice });
    setPurchaseCompleteVisible(true);
    // TODO: 구매 결정 API 호출
  };

  const handleViewPurchaseLog = () => {
    setPurchaseCompleteVisible(false);
    router.push("/logCalendar");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={[styles.hero, { height: 374 + insets.top }]}>
          <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.heroOverlay]} />
        </View>

        <View style={styles.content}>
        {/* 담은 날짜 + 상품명 + 가격 */}
        <View style={styles.metaBlock}>
          <View style={styles.dateRow}>
            <Text style={styles.dateMuted}>담은 지</Text>
            <Text style={styles.dateMuted}> +1일</Text>
          </View>
          <View style={styles.namePrice}>
            <Text style={styles.productName}>{itemName}</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.priceNum, isSale && styles.priceNumSale]}>
                {priceNum.toLocaleString()}
              </Text>
              <Text style={styles.priceUnit}>원</Text>
            </View>
          </View>
        </View>

        {/* 구매 결정 / 구매 포기 */}
        <View style={styles.actionRow}>
          {/* 구매 결정 */}
          <View style={styles.actionBtnWrap}>
            <View style={styles.actionBtnShadow} />
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.85}
              onPress={() => setPurchaseModalVisible(true)}
            >
              <View pointerEvents="none" style={styles.actionBtnTopHighlight} />
              <View pointerEvents="none" style={styles.actionBtnLeftHighlight} />
              <View pointerEvents="none" style={styles.actionBtnBottomShade} />
              <Image
                source={require("@/assets/images/wish/choice-button.png")}
                style={styles.actionBtnIcon}
                resizeMode="contain"
              />
              <Text style={styles.actionBtnLabel}>구매 결정</Text>
            </TouchableOpacity>
          </View>
          {/* 구매 포기 */}
          <View style={styles.actionBtnWrap}>
            <View style={styles.actionBtnShadow} />
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.85}
              onPress={() => setAbandonModalVisible(true)}
            >
              <View pointerEvents="none" style={styles.actionBtnTopHighlight} />
              <View pointerEvents="none" style={styles.actionBtnLeftHighlight} />
              <View pointerEvents="none" style={styles.actionBtnBottomShade} />
              <Image
                source={require("@/assets/images/wish/discard-button.png")}
                style={styles.actionBtnIcon}
                resizeMode="contain"
              />
              <Text style={styles.actionBtnLabel}>구매 포기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.dividerWrap}>
          <View style={styles.divider} />
        </View>

        {/* 쇼핑몰 링크 */}
        <TouchableOpacity style={styles.shopLink} activeOpacity={0.8}>
          <View style={styles.shopLinkLeft}>
            <Image source={{ uri: "https://placehold.co/42x42" }} style={styles.shopAvatar} />
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>MUSINSA</Text>
              <Text style={styles.shopSub}>눌러서 사이트로 이동</Text>
            </View>
          </View>
          <Ionicons name="caret-forward" size={12} color="#464B47" />
        </TouchableOpacity>

        {/* 메모 */}
        <View style={styles.memoBox}>
          <TextInput
            style={styles.memoInput}
            value={memo}
            onChangeText={(text) => {
              if (text.length <= MAX_MEMO) setMemo(text);
            }}
            multiline
            placeholder="구매 메모를 입력하세요"
            placeholderTextColor="#AAAFAB"
            textAlignVertical="top"
          />
          <View style={styles.memoCountRow}>
            <Text style={[styles.memoCountCurrent, memo.length >= MAX_MEMO && styles.memoCountFull]}>
              {memo.length}
            </Text>
            <Text style={styles.memoCountTotal}>/{MAX_MEMO}</Text>
          </View>
        </View>

        {/* CTA 배너 */}
        <TournamentBanner label="이 위시템으로 살말 추천 받기" onPress={() => {}} />
        </View>
      </ScrollView>

      <View pointerEvents="box-none" style={[styles.navHeader, { top: insets.top }]}>
        <TouchableOpacity style={styles.navBtn} onPress={() => router.back()} hitSlop={8}>
          <Image
            source={require("@/assets/images/wish/back-button.png")}
            style={styles.navBtnImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} hitSlop={8}>
          <Image
            source={require("@/assets/images/wish/item-edit-button.png")}
            style={styles.navBtnImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ConfirmModal
        visible={abandonModalVisible}
        title="구매를 포기하시겠습니까?"
        description="해당 위시템이 구매 포기템으로 이동합니다."
        onCancel={() => setAbandonModalVisible(false)}
        onConfirm={handleAbandon}
      />

      <CalendarModal
        visible={purchaseModalVisible}
        initialPrice={priceNum}
        onClose={() => setPurchaseModalVisible(false)}
        onConfirm={handlePurchaseConfirm}
      />

      <PurchaseCompleteModal
        visible={purchaseCompleteVisible}
        date={purchaseRecord?.date ?? null}
        image={imageSource}
        itemName={itemName}
        price={purchaseRecord?.price ?? String(priceNum)}
        onClose={() => setPurchaseCompleteVisible(false)}
        onView={handleViewPurchaseLog}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBF5",
  },
  hero: {
    height: 374,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.20)",
  },
  navHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  navBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  navBtnImage: {
    width: 36,
    height: 36,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 20,
  },
  metaBlock: {
    gap: 12,
  },
  dateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dateMuted: {
    fontSize: 14,
    fontWeight: "400",
    color: "#787D79",
    lineHeight: 21,
  },
  namePrice: {
    gap: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D322E",
    lineHeight: 30,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  priceNum: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D322E",
    lineHeight: 30,
  },
  priceNumSale: {
    color: "#E4463C",
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: "400",
    color: "#5F6460",
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  actionBtnWrap: {
    position: "relative",
    width: 136,
    height: 54,
  },
  actionBtnShadow: {
    position: "absolute",
    top: 3,
    right: -1,
    bottom: -2,
    left: 2,
    backgroundColor: "rgba(104, 171, 110, 0.24)",
    borderRadius: 8,
  },
  actionBtn: {
    position: "relative",
    width: 136,
    height: 54,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E8F9C7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    borderTopColor: "#ACDAA3",
    borderLeftColor: "#ACDAA3",
    borderRightColor: "#91C396",
    borderBottomColor: "#91C396",
    overflow: "hidden",
  },
  actionBtnTopHighlight: {
    position: "absolute",
    top: 1,
    right: 1,
    left: 1,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.46)",
  },
  actionBtnLeftHighlight: {
    position: "absolute",
    top: 1,
    bottom: 1,
    left: 1,
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.28)",
  },
  actionBtnBottomShade: {
    position: "absolute",
    right: 1,
    bottom: 1,
    left: 1,
    height: 2,
    backgroundColor: "rgba(104, 171, 110, 0.08)",
  },
  actionBtnIcon: {
    width: 16,
    height: 16,
  },
  actionBtnLabel: {
    fontSize: 14,
    fontFamily: "Galmuri9",
    fontWeight: "400",
    color: "#2D322E",
    lineHeight: 21,
  },
  dividerWrap: {
    paddingHorizontal: 18,
  },
  divider: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9CCCA0",
  },
  shopLink: {
    height: 66,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 33,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopLinkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  shopAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  shopInfo: {
    gap: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D322E",
    lineHeight: 24,
  },
  shopSub: {
    fontSize: 12,
    fontWeight: "400",
    color: "#787D79",
    lineHeight: 18,
  },
  memoBox: {
    height: 114,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 15,
    backgroundColor: "#FAFFF9",
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#9CCCA0",
    gap: 4,
  },
  memoInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "#000000",
    lineHeight: 18.62,
    padding: 0,
  },
  memoCountFull: {
    color: "#E4463C",
  },
  memoCountRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  memoCountCurrent: {
    fontSize: 12,
    fontWeight: "400",
    color: "#464B47",
    lineHeight: 18,
  },
  memoCountTotal: {
    fontSize: 12,
    fontWeight: "400",
    color: "#AAAFAB",
    lineHeight: 18,
  },
});
