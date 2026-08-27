/** 시안 「마이페이지 - 일러스트 에셋」(Figma 1659:56764)이 가진 14종. */
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

/**
 * 냄비에 담을 수 있는 매장 한 곳.
 *
 * 매장 추천 endpoint가 아직 OpenAPI에 없어 지금은 `_constants/`의 더미가 이 모양을 만든다.
 * 계약이 생기면 `_utils/`의 mapper가 같은 모양을 만들고 이 타입은 그대로 쓴다.
 */
export type RecommendStore = {
  placeId: string;
  name: string;
  category: FoodCategory;
};

/** 리뷰 요약 한 줄. 좋았던 점과 아쉬웠던 점을 아이콘으로 가른다. */
export type RecommendSummary = {
  id: string;
  tone: "up" | "down";
  text: string;
};

/**
 * 추천 결과 한 곳.
 *
 * 추천 endpoint가 아직 OpenAPI에 없어 지금은 `_constants/`의 더미가 이 모양을 만든다.
 * 계약이 생기면 `_utils/`의 mapper가 같은 모양을 만들고 이 타입은 그대로 쓴다.
 */
export type RecommendResult = {
  placeId: string;
  name: string;
  roadAddress: string;
  categoryName: string;
  thumbnailUrl: string | null;
  summaries: readonly RecommendSummary[];
};
