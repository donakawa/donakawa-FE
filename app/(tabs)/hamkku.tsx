import { Ionicons } from "@expo/vector-icons";
import CheckIcon from "@/assets/images/hamkku/check.svg";
import ConfirmModal from "@/components/common/ConfirmModal";
import DoneButton from "@/components/common/DoneButton";
import Toast from "@/components/common/Toast";
import { getDonaSvg } from "@/constants/dona";
import {
  DEFAULT_HAMKKU_SELECTION,
  getHamkkuItem,
  HAMKKU_CATEGORIES,
  HAMKKU_ITEMS,
  type HamkkuCategory,
  type HamkkuItem,
} from "@/constants/hamkku";
import {
  applyHamkkuItems,
  purchaseHamkkuItem,
  updateHamkkuNickname,
  useAttendanceStore,
} from "@/stores/attendanceStore";
import { hamkkuStyles } from "@/styles/hamkku/Hamkku.style";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const styles = hamkkuStyles as Record<keyof typeof hamkkuStyles, any>;

export default function Hamkku() {
  const { points, ownedHamkkuItemIds, appliedHamkku, hamkkuNickname } =
    useAttendanceStore();
  const [activeCategory, setActiveCategory] = useState<HamkkuCategory>("skin");
  const [draftHamkku, setDraftHamkku] = useState(appliedHamkku);
  const [nicknameDraft, setNicknameDraft] = useState(hamkkuNickname);
  const [nameSheetVisible, setNameSheetVisible] = useState(false);
  const [pendingPurchaseItem, setPendingPurchaseItem] = useState<HamkkuItem | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [isApplyMode, setIsApplyMode] = useState(false);
  const [showIntroSpeech, setShowIntroSpeech] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setShowIntroSpeech(true);
      const timer = setTimeout(() => setShowIntroSpeech(false), 3000);

      return () => clearTimeout(timer);
    }, []),
  );

  const selectedItem = getHamkkuItem(draftHamkku[activeCategory]);
  const selectedOwned = selectedItem
    ? ownedHamkkuItemIds.includes(selectedItem.id)
    : false;
  const selectedNeedsPurchase = selectedItem ? !selectedOwned && selectedItem.price > 0 : false;

  const previewItems = useMemo(
    () => ({
      skin: getHamkkuItem(draftHamkku.skin) ?? getHamkkuItem(DEFAULT_HAMKKU_SELECTION.skin),
      accessory:
        getHamkkuItem(draftHamkku.accessory) ??
        getHamkkuItem(DEFAULT_HAMKKU_SELECTION.accessory),
      wall: getHamkkuItem(draftHamkku.wall) ?? getHamkkuItem(DEFAULT_HAMKKU_SELECTION.wall),
      floor: getHamkkuItem(draftHamkku.floor) ?? getHamkkuItem(DEFAULT_HAMKKU_SELECTION.floor),
    }),
    [draftHamkku],
  );

  const PreviewDonaSvg = getDonaSvg(
    previewItems.skin?.skinVariant,
    showIntroSpeech ? 1 : 2,
  );
  const activeItems = HAMKKU_ITEMS.filter((item) => item.category === activeCategory);

  const handleSelectItem = (item: HamkkuItem) => {
    setDraftHamkku((prev) => ({ ...prev, [item.category]: item.id }));
    setIsApplyMode(false);
  };

  const handlePurchase = () => {
    if (!selectedItem || selectedOwned) return;
    setPendingPurchaseItem(selectedItem);
  };

  const confirmPurchase = () => {
    if (!pendingPurchaseItem) return;

    const purchased = purchaseHamkkuItem(pendingPurchaseItem.id, pendingPurchaseItem.price);
    setPendingPurchaseItem(null);

    if (!purchased) {
      setToastVisible(true);
      return;
    }

    setDraftHamkku((prev) => ({
      ...prev,
      [pendingPurchaseItem.category]: pendingPurchaseItem.id,
    }));
  };

  const handleDone = () => {
    const canApply = Object.values(draftHamkku).every((itemId) =>
      ownedHamkkuItemIds.includes(itemId),
    );

    if (!canApply) {
      setToastVisible(true);
      return;
    }

    setIsApplyMode(true);
  };

  const handleApply = () => {
    if (applyHamkkuItems(draftHamkku)) {
      setIsApplyMode(false);
      router.replace("/(tabs)");
    }
  };

  const handleNicknameDone = () => {
    const trimmed = nicknameDraft.trim();
    if (trimmed) updateHamkkuNickname(trimmed);
    setNameSheetVisible(false);
  };

  const renderAccessory = (item?: HamkkuItem) => {
    const AccessorySvg = item?.Svg;
    if (!AccessorySvg) return null;

    return (
      <View style={styles.accessoryLayer}>
        <AccessorySvg width={34} height={34} />
      </View>
    );
  };

  const renderItemPreview = (item: HamkkuItem) => {
    if (item.Svg) {
      const ItemSvg = item.Svg;

      return (
        <View style={styles.itemPreviewCircle}>
          <ItemSvg
            width={item.category === "skin" ? 50 : 44}
            height={item.category === "skin" ? 54 : 44}
          />
        </View>
      );
    }

    if (item.color) {
      return <View style={[styles.colorPreview, { backgroundColor: item.color }]} />;
    }

    return <View style={styles.itemPreviewCircle} />;
  };

  const renderItemCard = (item: HamkkuItem) => {
    const isSelected = draftHamkku[item.category] === item.id;
    const isOwned = ownedHamkkuItemIds.includes(item.id);
    const isColorItem = item.category === "wall" || item.category === "floor";

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.itemWrap}
        activeOpacity={0.85}
        onPress={() => handleSelectItem(item)}
      >
        <View
          style={[
            styles.itemCard,
            isColorItem && styles.colorItemCard,
            isSelected && styles.selectedCard,
          ]}
        >
          {isSelected ? <CheckIcon width={30} height={30} style={styles.checkIcon} /> : null}
          {renderItemPreview(item)}
          {isOwned ? (
            <View style={styles.ownedBadge}>
              <Text style={styles.ownedText}>보유중</Text>
            </View>
          ) : (
            <View style={styles.priceBadge}>
              <View style={styles.smallCoin}>
                <Text style={styles.smallCoinText}>S</Text>
              </View>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
          )}
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: previewItems.wall?.color ?? "#F0FFE5" }]}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
          <Ionicons name="chevron-back" size={32} color="#464B47" />
        </TouchableOpacity>

        <View style={styles.coinWrap}>
          <View style={styles.coinCircle}>
            <Text style={styles.coinIcon}>S</Text>
          </View>
          <Text style={styles.coinText}>{points}코인</Text>
        </View>
      </View>

      <View style={styles.preview}>
        <View style={[styles.previewWall, { backgroundColor: previewItems.wall?.color }]}>
          {showIntroSpeech ? (
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>예쁘게 꾸며주세요!!!</Text>
              <View style={styles.speechTail} />
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.nameButton}
            activeOpacity={0.8}
            onPress={() => {
              setNicknameDraft(hamkkuNickname);
              setNameSheetVisible(true);
            }}
          >
            <Text style={styles.nameText}>{hamkkuNickname} ✎</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.floorLine} />
        <View style={[styles.previewFloor, { backgroundColor: previewItems.floor?.color }]} />

        <View style={styles.hamsterWrap}>
          <PreviewDonaSvg width={124} height={124} />
          {renderAccessory(previewItems.accessory)}
        </View>

        {!isApplyMode && (
          <View style={styles.doneButtonWrap}>
            <DoneButton onPress={handleDone} />
          </View>
        )}
      </View>

      {isApplyMode ? (
        <View style={styles.applyPanel}>
          <View style={styles.applyBubble}>
            <Text style={styles.applyBubbleText}>그럼, 이 상태로 저장할까?</Text>
          </View>
          <View style={styles.applyActions}>
            <TouchableOpacity
              style={styles.outlineAction}
              activeOpacity={0.85}
              onPress={() => setIsApplyMode(false)}
            >
              <Text style={styles.actionText}>이전으로</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.greenAction} activeOpacity={0.85} onPress={handleApply}>
              <Text style={styles.actionText}>적용하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.tabs}>
            {HAMKKU_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.tabButton, isActive && styles.activeTabButton]}
                  activeOpacity={0.8}
                  onPress={() => setActiveCategory(category.id)}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={styles.itemList} showsVerticalScrollIndicator={false}>
            <View style={styles.itemGrid}>{activeItems.map(renderItemCard)}</View>
          </ScrollView>

          {selectedNeedsPurchase ? (
            <View style={styles.purchaseButtonWrap}>
              <TouchableOpacity
                style={styles.purchaseButton}
                activeOpacity={0.85}
                onPress={handlePurchase}
              >
                <Text style={styles.purchaseText}>구매!</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      )}

      <ConfirmModal
        visible={!!pendingPurchaseItem}
        title="아이템을 구매하시겠습니까?"
        description="구매 시 포인트가 차감됩니다."
        cancelLabel="아니요"
        confirmLabel="네"
        onCancel={() => setPendingPurchaseItem(null)}
        onConfirm={confirmPurchase}
      />

      {nameSheetVisible ? (
        <Pressable style={styles.nameSheetBackdrop} onPress={() => setNameSheetVisible(false)}>
          <Pressable style={styles.nameSheet} onPress={() => {}}>
            <View style={styles.handle} />
            <View style={styles.sheetTop}>
              <TouchableOpacity onPress={() => setNameSheetVisible(false)} activeOpacity={0.8}>
                <Text style={styles.sheetText}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNicknameDone} activeOpacity={0.8}>
                <Text style={styles.sheetDoneText}>완료</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.nicknameInputWrap}>
              <TextInput
                value={nicknameDraft}
                onChangeText={(text) => setNicknameDraft(text.slice(0, 10))}
                style={styles.nicknameInput}
                maxLength={10}
                autoFocus
              />
              <Text style={styles.counter}>{nicknameDraft.length}/10</Text>
            </View>
          </Pressable>
        </Pressable>
      ) : null}

      <Toast
        visible={toastVisible}
        message="코인이 부족해요."
        bottom={72}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
