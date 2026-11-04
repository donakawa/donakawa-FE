import { getApiErrorMessage } from "@/api/types";
import {
  useBuyWishItem,
  useDropWishItem,
  useUpdateWishReason,
  useWishItem,
  type PurchaseTimeSlot,
  type WishItemType,
} from "@/api/wishlist";
import ConfirmModal from "@/components/common/ConfirmModal";
import CalendarModal from "@/components/wish/CalendarModal";
import PurchaseCompleteModal from "@/components/wish/PurchaseCompleteModal";
import TournamentBanner from "@/components/wish/TournamentBanner";
import { Ionicons } from "@expo/vector-icons";
import { differenceInCalendarDays, format } from "date-fns";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  type ImageSourcePropType,
  Linking,
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

const isWishItemType = (value?: string): value is WishItemType =>
  value === "AUTO" || value === "MANUAL";

// TODO: 구매 시간대(MORNING/EVENING/NIGHT)를 고르는 UI가 없어 현재 시각 기준으로 임시 지정
// (시간대 경계도 명세에 없어 12시/18시 기준으로 가정, 디자인/백엔드 확인 필요)
const getCurrentTimeSlot = (): PurchaseTimeSlot => {
  const hour = new Date().getHours();
  if (hour < 12) return "MORNING";
  if (hour < 18) return "EVENING";
  return "NIGHT";
};

type PurchaseRecord = {
  date: Date;
  price: string;
};

export default function WishItemDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const itemType: WishItemType = isWishItemType(type) ? type : "MANUAL";
  const { data: item, isLoading, isError } = useWishItem(id ?? "", itemType, {
    enabled: !!id && isWishItemType(type),
  });
  const dropItem = useDropWishItem();
  const buyItem = useBuyWishItem();
  const updateReason = useUpdateWishReason();

  const [memo, setMemo] = useState("");
  const [abandonModalVisible, setAbandonModalVisible] = useState(false);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [purchaseCompleteVisible, setPurchaseCompleteVisible] = useState(false);
  const [purchaseRecord, setPurchaseRecord] = useState<PurchaseRecord | null>(null);

  useEffect(() => {
    if (item) setMemo((item.reason ?? "").slice(0, MAX_MEMO));
  }, [item]);

  const handleAbandon = () => {
    setAbandonModalVisible(false);
    if (!id) return;
    dropItem.mutate(
      { itemId: id, type: itemType },
      {
        onSuccess: () => router.back(),
        onError: (error) => Alert.alert("구매 포기 실패", getApiErrorMessage(error)),
      },
    );
  };

  const handleMemoSave = () => {
    if (!id || !item || memo === (item.reason ?? "")) return;
    updateReason.mutate(
      { itemId: id, type: itemType, reason: memo },
      { onError: (error) => Alert.alert("메모 저장 실패", getApiErrorMessage(error)) },
    );
  };

  const priceNum = item?.price ?? 0;
  const imageSource: ImageSourcePropType = item?.photoUrl
    ? { uri: item.photoUrl }
    : WISH_ITEM_IMAGE;
  const itemName = item?.name ?? "";
  const addedDays = item ? differenceInCalendarDays(new Date(), new Date(item.addedAt)) : 0;

  const handlePurchaseConfirm = (start: Date, _end: Date | null, purchasePrice: string) => {
    setPurchaseModalVisible(false);
    if (!id) return;
    // TODO: 구매 API에 가격 필드가 없어 모달에서 수정한 가격은 완료 모달 표시에만 사용됨
    // TODO: 구매 이유(reasonId/reason) 입력 UI가 없어 생략 (명세상 필수라면 백엔드 확인 필요)
    buyItem.mutate(
      {
        itemId: id,
        type: itemType,
        date: format(start, "yyyy-MM-dd"),
        purchasedAt: getCurrentTimeSlot(),
      },
      {
        onSuccess: () => {
          setPurchaseRecord({ date: start, price: purchasePrice });
          setPurchaseCompleteVisible(true);
        },
        onError: (error) => Alert.alert("구매 기록 실패", getApiErrorMessage(error)),
      },
    );
  };

  const handleOpenShop = () => {
    if (!item?.productUrl) return;
    Linking.openURL(item.productUrl).catch(() =>
      Alert.alert("이동 실패", "사이트를 열 수 없어요."),
    );
  };

  const handleViewPurchaseLog = () => {
    setPurchaseCompleteVisible(false);
    router.push("/logCalendar");
  };

  if (!item) {
    return (
      <View style={[styles.container, styles.centered]}>
        {isLoading ? (
          <ActivityIndicator color="#7EC985" />
        ) : (
          <Text style={styles.dateMuted}>
            {isError ? "상품 정보를 불러오지 못했어요." : "상품 정보가 없어요."}
          </Text>
        )}
        <View pointerEvents="box-none" style={[styles.navHeader, { top: insets.top }]}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.back()} hitSlop={8}>
            <Image
              source={require("@/assets/images/wish/back-button.png")}
              style={styles.navBtnImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

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
            <Text style={styles.dateMuted}> +{addedDays}일</Text>
          </View>
          <View style={styles.namePrice}>
            <Text style={styles.productName}>{itemName}</Text>
            <View style={styles.priceRow}>
              {/* TODO: 세일 여부는 API에 없어 세일 가격 스타일(priceNumSale)은 사용하지 않음 */}
              <Text style={styles.priceNum}>
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
        <TouchableOpacity style={styles.shopLink} activeOpacity={0.8} onPress={handleOpenShop}>
          <View style={styles.shopLinkLeft}>
            <Image source={{ uri: "https://placehold.co/42x42" }} style={styles.shopAvatar} />
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>{item.platform ?? item.brand ?? "-"}</Text>
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
            onEndEditing={handleMemoSave}
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
        {/* TODO: 위시템 수정 화면이 없어 수정 버튼은 아직 동작하지 않음 (수정 API는 MANUAL 전용) */}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
