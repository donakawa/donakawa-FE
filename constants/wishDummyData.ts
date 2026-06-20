import type { ImageSourcePropType } from "react-native";

export const WISH_DUMMY_IMAGE_KEYS = [
  "wishlist-dummy1",
  "wishlist-dummy2",
  "wishlist-dummy3",
  "wishlist-dummy4",
] as const;

export type WishDummyImageKey = (typeof WISH_DUMMY_IMAGE_KEYS)[number];

const WISH_DUMMY_IMAGE_BY_KEY: Record<WishDummyImageKey, ImageSourcePropType> = {
  "wishlist-dummy1": require("@/assets/images/wish/wishlist-dummy1.png"),
  "wishlist-dummy2": require("@/assets/images/wish/wishlist-dummy2.png"),
  "wishlist-dummy3": require("@/assets/images/wish/wishlist-dummy3.png"),
  "wishlist-dummy4": require("@/assets/images/wish/wishlist-dummy4.png"),
};

export const WISH_DUMMY_IMAGES = WISH_DUMMY_IMAGE_KEYS.map(
  (key) => WISH_DUMMY_IMAGE_BY_KEY[key],
);

export type WishDummyProduct = {
  id: string;
  name: string;
  price: number;
  image: ImageSourcePropType;
  imageKey: WishDummyImageKey;
  onSale?: boolean;
};

const WISH_DUMMY_PRODUCT_BASE = [
  { id: "1", name: "ZARA 시티 걸 드레스 그린", price: 57300, onSale: true },
  { id: "2", name: "알로하 플라워 네일 팁", price: 34500 },
  { id: "3", name: "Adidas 가젤 오렌지", price: 124300, onSale: true },
  { id: "4", name: "빈티지 리본 숄더백", price: 89000 },
  { id: "5", name: "포근한 스트라이프 니트", price: 64200 },
];

export function getWishDummyImageByKey(key: WishDummyImageKey) {
  return WISH_DUMMY_IMAGE_BY_KEY[key];
}

export function getRandomWishDummyImageKey(): WishDummyImageKey {
  const index = Math.floor(Math.random() * WISH_DUMMY_IMAGE_KEYS.length);
  return WISH_DUMMY_IMAGE_KEYS[index];
}

export function getRandomWishDummyImages(count = 4): ImageSourcePropType[] {
  return Array.from({ length: count }, () =>
    getWishDummyImageByKey(getRandomWishDummyImageKey()),
  );
}

export function createRandomWishDummyProducts(): WishDummyProduct[] {
  return WISH_DUMMY_PRODUCT_BASE.map((product) => {
    const imageKey = getRandomWishDummyImageKey();

    return {
      ...product,
      imageKey,
      image: getWishDummyImageByKey(imageKey),
    };
  });
}
