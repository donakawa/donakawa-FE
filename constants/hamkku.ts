import Acc1 from "@/assets/images/hamkku/acc_1.svg";
import Acc2 from "@/assets/images/hamkku/acc_2.svg";
import Acc3 from "@/assets/images/hamkku/acc_3.svg";
import Acc4 from "@/assets/images/hamkku/acc_4.svg";
import Acc5 from "@/assets/images/hamkku/acc_5.svg";
import Skin1 from "@/assets/images/hamkku/skin_1.svg";
import Skin2 from "@/assets/images/hamkku/skin_2.svg";
import Skin3 from "@/assets/images/hamkku/skin_3.svg";
import Skin4 from "@/assets/images/hamkku/skin_4.svg";
import Skin5 from "@/assets/images/hamkku/skin_5.svg";
import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

export type HamkkuCategory = "skin" | "accessory" | "wall" | "floor";

export type HamkkuItem = {
  id: string;
  category: HamkkuCategory;
  name: string;
  price: number;
  defaultOwned?: boolean;
  Svg?: ComponentType<SvgProps>;
  skinVariant?: 1 | 2 | 3 | 4;
  color?: string;
};

export const HAMKKU_CATEGORIES: { id: HamkkuCategory; label: string }[] = [
  { id: "skin", label: "스킨" },
  { id: "accessory", label: "액세서리" },
  { id: "wall", label: "벽지" },
  { id: "floor", label: "바닥" },
];

export const HAMKKU_ITEMS: HamkkuItem[] = [
  {
    id: "skin-default",
    category: "skin",
    name: "(기본) 펄",
    price: 0,
    defaultOwned: true,
    Svg: Skin1,
    skinVariant: 1,
  },
  {
    id: "skin-gray",
    category: "skin",
    name: "정글리안",
    price: 0,
    defaultOwned: true,
    Svg: Skin2,
    skinVariant: 2,
  },
  {
    id: "skin-gold",
    category: "skin",
    name: "블랙아이햄스터",
    price: 350,
    Svg: Skin3,
    skinVariant: 3,
  },
  {
    id: "skin-black",
    category: "skin",
    name: "블루사파이어",
    price: 350,
    Svg: Skin4,
    skinVariant: 4,
  },
  {
    id: "skin-brown",
    category: "skin",
    name: "(전설) 기니피그",
    price: 800,
    Svg: Skin5,
  },
  {
    id: "accessory-none",
    category: "accessory",
    name: "(기본) 없음",
    price: 0,
    defaultOwned: true,
  },
  {
    id: "accessory-sprout",
    category: "accessory",
    name: "새싹",
    price: 100,
    Svg: Acc1,
  },
  {
    id: "accessory-ribbon",
    category: "accessory",
    name: "리본",
    price: 100,
    Svg: Acc2,
  },
  {
    id: "accessory-mustache",
    category: "accessory",
    name: "콧수염",
    price: 300,
    Svg: Acc3,
  },
  {
    id: "accessory-seed",
    category: "accessory",
    name: "해바라기씨",
    price: 350,
    Svg: Acc4,
  },
  {
    id: "accessory-money",
    category: "accessory",
    name: "(전설) 지폐",
    price: 700,
    Svg: Acc5,
  },
  {
    id: "wall-default",
    category: "wall",
    name: "(기본) 평범한 벽",
    price: 0,
    defaultOwned: true,
    color: "#F0FFE5",
  },
  {
    id: "wall-pink",
    category: "wall",
    name: "분홍색 벽",
    price: 0,
    defaultOwned: true,
    color: "#FFEAF4",
  },
  {
    id: "wall-yellow",
    category: "wall",
    name: "노란색 벽",
    price: 10,
    color: "#FFFECB",
  },
  {
    id: "floor-default",
    category: "floor",
    name: "(기본) 평범한 바닥",
    price: 0,
    defaultOwned: true,
    color: "#E0F9BF",
  },
  {
    id: "floor-pink",
    category: "floor",
    name: "분홍색 바닥",
    price: 0,
    defaultOwned: true,
    color: "#F2AFCF",
  },
  {
    id: "floor-yellow",
    category: "floor",
    name: "노란색 바닥",
    price: 10,
    color: "#F7F58F",
  },
];

export const DEFAULT_HAMKKU_SELECTION: Record<HamkkuCategory, string> = {
  skin: "skin-default",
  accessory: "accessory-none",
  wall: "wall-default",
  floor: "floor-default",
};

export const DEFAULT_OWNED_HAMKKU_ITEM_IDS = HAMKKU_ITEMS.filter(
  (item) => item.defaultOwned,
).map((item) => item.id);

export const getHamkkuItem = (id: string) =>
  HAMKKU_ITEMS.find((item) => item.id === id);
