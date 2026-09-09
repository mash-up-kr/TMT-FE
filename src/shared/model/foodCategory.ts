/**
 * 매장 카테고리. 마이페이지 스티커(Figma 1659:56764)와 24px 카테고리 아이콘
 * (Figma 2789:39152)이 같은 14종을 쓴다. 서버의 categoryId가 이 슬러그와 같다.
 */
export const FOOD_CATEGORIES = [
  "grill",
  "bar",
  "snack",
  "buffet",
  "brunch",
  "asian",
  "western",
  "japanese",
  "pub",
  "chinese",
  "cafe",
  "fastfood",
  "korean",
  "seafood",
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];
