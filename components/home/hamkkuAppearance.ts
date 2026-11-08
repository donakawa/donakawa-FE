import { useCharacter, type Character, type ItemCategory } from "@/api/character";
import {
  DEFAULT_HAMKKU_SELECTION,
  getHamkkuItem,
  type HamkkuCategory,
  type HamkkuItem,
} from "@/constants/hamkku";

export const API_CATEGORY: Record<HamkkuCategory, ItemCategory> = {
  skin: "SKIN",
  accessory: "ACCESSORY",
  wall: "WALLPAPER",
  floor: "FLOOR",
};

export const EQUIPPED_FIELD: Record<HamkkuCategory, keyof Character["equipped"]> = {
  skin: "skin",
  accessory: "accessory",
  wall: "wallpaper",
  floor: "floor",
};

// TODO: SKIN_JUNGLE, SKIN_BLACK, SKIN_BLUE, ACC_BASIC, WALL_PINK, FLOOR_BASIC 외의 키는 추정값. 백엔드 시드 데이터 확인 필요
const LOCAL_ITEM_ID_BY_KEY: Record<string, string> = {
  SKIN_BASIC: "skin-default",
  SKIN_PEARL: "skin-default",
  SKIN_JUNGLE: "skin-gray",
  SKIN_BLACK: "skin-gold",
  SKIN_BLUE: "skin-black",
  SKIN_GUINEAPIG: "skin-brown",
  ACC_BASIC: "accessory-none",
  ACC_SPROUT: "accessory-sprout",
  ACC_RIBBON: "accessory-ribbon",
  ACC_MUSTACHE: "accessory-mustache",
  ACC_SEED: "accessory-seed",
  ACC_MONEY: "accessory-money",
  WALL_BASIC: "wall-default",
  WALL_PINK: "wall-pink",
  WALL_YELLOW: "wall-yellow",
  FLOOR_BASIC: "floor-default",
  FLOOR_PINK: "floor-pink",
  FLOOR_YELLOW: "floor-yellow",
};

// TODO: 카테고리별 아이템 조회 응답에 itemKey가 추가되면 그걸 사용
export const getItemKeyFromImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return undefined;
  const fileName = imageUrl.split("?")[0].split("/").pop() ?? "";
  return fileName.replace(/\.[a-z0-9]+$/i, "").toUpperCase() || undefined;
};

const warnedUnknownKeys = new Set<string>();

export const getLocalHamkkuItem = (itemKey?: string): HamkkuItem | undefined => {
  if (!itemKey) return undefined;
  const localId = LOCAL_ITEM_ID_BY_KEY[itemKey];

  // 매핑에 없는 키는 기본 아이템으로 대체돼 "적용이 안 되는" 것처럼 보이므로 개발 중에 알림
  if (!localId && __DEV__ && !warnedUnknownKeys.has(itemKey)) {
    warnedUnknownKeys.add(itemKey);
    console.warn(`[hamkku] 앱에 매핑되지 않은 itemKey: ${itemKey}`);
  }
  return localId ? getHamkkuItem(localId) : undefined;
};

const getDefaultItem = (category: HamkkuCategory) =>
  getHamkkuItem(DEFAULT_HAMKKU_SELECTION[category]);

export const useHamkkuAppearance = () => {
  const { data: character } = useCharacter();

  const resolve = (category: HamkkuCategory) =>
    getLocalHamkkuItem(character?.equipped[EQUIPPED_FIELD[category]]?.itemKey) ??
    getDefaultItem(category);

  return {
    character,
    skin: resolve("skin"),
    accessory: resolve("accessory"),
    wall: resolve("wall"),
    floor: resolve("floor"),
  };
};
