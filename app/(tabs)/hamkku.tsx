import { Ionicons } from "@expo/vector-icons";
import {
  useCharacter,
  useCharacterItems,
  useEquipItems,
  usePurchaseItem,
  type CharacterItem,
} from "@/api/character";
import { getApiError, getApiErrorMessage } from "@/api/types";
import CheckIcon from "@/assets/images/hamkku/check.svg";
import ConfirmModal from "@/components/common/ConfirmModal";
import DoneButton from "@/components/common/DoneButton";
import Toast from "@/components/common/Toast";
import {
  API_CATEGORY,
  EQUIPPED_FIELD,
  getItemKeyFromImageUrl,
  getLocalHamkkuItem,
} from "@/components/home/hamkkuAppearance";
import { getDonaSvg } from "@/constants/dona";
import {
  DEFAULT_HAMKKU_SELECTION,
  getHamkkuItem,
  HAMKKU_CATEGORIES,
  type HamkkuCategory,
  type HamkkuItem,
} from "@/constants/hamkku";
import {
  updateHamkkuNickname,
  useAttendanceStore,
} from "@/stores/attendanceStore";
import { hamkkuStyles } from "@/styles/hamkku/Hamkku.style";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const styles = hamkkuStyles as Record<keyof typeof hamkkuStyles, any>;

type ShopItem = CharacterItem & {
  category: HamkkuCategory;
  local?: HamkkuItem;
};

type DraftSelection = Record<HamkkuCategory, number | null>;

const EMPTY_DRAFT: DraftSelection = {
  skin: null,
  accessory: null,
  wall: null,
  floor: null,
};

const toShopItems = (
  category: HamkkuCategory,
  items?: CharacterItem[],
): ShopItem[] =>
  (items ?? []).map((item) => ({
    ...item,
    category,
    local: getLocalHamkkuItem(getItemKeyFromImageUrl(item.imageUrl)),
  }));

export default function Hamkku() {
  const { hamkkuNickname } = useAttendanceStore();
  const { data: character } = useCharacter();
  const skinItems = useCharacterItems(API_CATEGORY.skin);
  const accessoryItems = useCharacterItems(API_CATEGORY.accessory);
  const wallItems = useCharacterItems(API_CATEGORY.wall);
  const floorItems = useCharacterItems(API_CATEGORY.floor);
  const purchaseItem = usePurchaseItem();
  const equipItems = useEquipItems();

  const [activeCategory, setActiveCategory] = useState<HamkkuCategory>("skin");
  const [draftHamkku, setDraftHamkku] = useState<DraftSelection>(EMPTY_DRAFT);
  const [nicknameDraft, setNicknameDraft] = useState(hamkkuNickname);
  const [nameSheetVisible, setNameSheetVisible] = useState(false);
  const [pendingPurchaseItem, setPendingPurchaseItem] = useState<ShopItem | null>(null);
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

  useEffect(() => {
    if (!character) return;
    setDraftHamkku((prev) => ({
      skin: prev.skin ?? character.equipped[EQUIPPED_FIELD.skin].itemId,
      accessory: prev.accessory ?? character.equipped[EQUIPPED_FIELD.accessory].itemId,
      wall: prev.wall ?? character.equipped[EQUIPPED_FIELD.wall].itemId,
      floor: prev.floor ?? character.equipped[EQUIPPED_FIELD.floor].itemId,
    }));
  }, [character]);

  const itemsByCategory = useMemo<Record<HamkkuCategory, ShopItem[]>>(
    () => ({
      skin: toShopItems("skin", skinItems.data),
      accessory: toShopItems("accessory", accessoryItems.data),
      wall: toShopItems("wall", wallItems.data),
      floor: toShopItems("floor", floorItems.data),
    }),
    [skinItems.data, accessoryItems.data, wallItems.data, floorItems.data],
  );

  const findItem = (category: HamkkuCategory, itemId: number | null) =>
    itemsByCategory[category].find((item) => item.itemId === itemId);

  const selectedItem = findItem(activeCategory, draftHamkku[activeCategory]);
  const selectedNeedsPurchase = selectedItem
    ? !selectedItem.owned && selectedItem.price > 0
    : false;

  const previewItems = useMemo(() => {
    const resolve = (category: HamkkuCategory) =>
      itemsByCategory[category].find((item) => item.itemId === draftHamkku[category])
        ?.local ??
      getLocalHamkkuItem(character?.equipped[EQUIPPED_FIELD[category]].itemKey) ??
      getHamkkuItem(DEFAULT_HAMKKU_SELECTION[category]);

    return {
      skin: resolve("skin"),
      accessory: resolve("accessory"),
      wall: resolve("wall"),
      floor: resolve("floor"),
    };
  }, [itemsByCategory, draftHamkku, character]);

  const PreviewDonaSvg = getDonaSvg(
    previewItems.skin?.skinVariant,
    showIntroSpeech ? 1 : 2,
  );
  const activeItems = itemsByCategory[activeCategory];

  const handleSelectItem = (item: ShopItem) => {
    setDraftHamkku((prev) => ({ ...prev, [item.category]: item.itemId }));
    setIsApplyMode(false);
  };

  const handlePurchase = () => {
    if (!selectedItem || selectedItem.owned) return;
    setPendingPurchaseItem(selectedItem);
  };

  const confirmPurchase = () => {
    if (!pendingPurchaseItem || purchaseItem.isPending) return;

    const target = pendingPurchaseItem;
    setPendingPurchaseItem(null);

    purchaseItem.mutate(
      { itemId: target.itemId },
      {
        onSuccess: () => {
          setDraftHamkku((prev) => ({ ...prev, [target.category]: target.itemId }));
        },
        onError: (error) => {
          if (getApiError(error)?.code === "S002") {
            setToastVisible(true);
            return;
          }
          Alert.alert("구매 실패", getApiErrorMessage(error));
        },
      },
    );
  };

  const handleDone = () => {
    const canApply = HAMKKU_CATEGORIES.every(
      ({ id }) => findItem(id, draftHamkku[id])?.owned,
    );

    if (!canApply) {
      setToastVisible(true);
      return;
    }

    setIsApplyMode(true);
  };

  const handleApply = () => {
    const { skin, accessory, wall, floor } = draftHamkku;
    if (skin === null || accessory === null || wall === null || floor === null) return;
    if (equipItems.isPending) return;

    equipItems.mutate(
      { skinId: skin, accessoryId: accessory, wallpaperId: wall, floorId: floor },
      {
        onSuccess: () => {
          setIsApplyMode(false);
          router.replace("/(tabs)");
        },
        onError: (error) => Alert.alert("적용 실패", getApiErrorMessage(error)),
      },
    );
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

  const renderItemPreview = (item: ShopItem) => {
    const local = item.local;

    if (local?.Svg) {
      const ItemSvg = local.Svg;

      return (
        <View style={styles.itemPreviewCircle}>
          <ItemSvg
            width={item.category === "skin" ? 50 : 44}
            height={item.category === "skin" ? 54 : 44}
          />
        </View>
      );
    }

    if (local?.color) {
      return <View style={[styles.colorPreview, { backgroundColor: local.color }]} />;
    }

    if (!local && item.imageUrl) {
      const isColorItem = item.category === "wall" || item.category === "floor";

      return (
        <Image
          source={{ uri: item.imageUrl }}
          style={isColorItem ? styles.colorPreview : styles.itemPreviewCircle}
          resizeMode="contain"
        />
      );
    }

    return <View style={styles.itemPreviewCircle} />;
  };

  const renderItemCard = (item: ShopItem) => {
    const isSelected = draftHamkku[item.category] === item.itemId;
    const isOwned = item.owned;
    const isColorItem = item.category === "wall" || item.category === "floor";

    return (
      <TouchableOpacity
        key={item.itemId}
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
          <Text style={styles.coinText}>{character?.coin ?? 0}코인</Text>
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
            <TouchableOpacity
              style={styles.greenAction}
              activeOpacity={0.85}
              onPress={handleApply}
              disabled={equipItems.isPending}
            >
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
                disabled={purchaseItem.isPending}
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

      {/* TODO: 햄꾸 닉네임 API가 명세서에 없어 로컬 상태로만 저장 */}
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
