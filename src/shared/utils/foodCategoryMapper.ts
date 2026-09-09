import { FOOD_CATEGORIES, type FoodCategory } from "@/shared/model/foodCategory";

/**
 * 서버 categoryId와 아이콘 키의 대응. 정본 목록은 `GET /v1/group-tags`의 foodCategories다.
 * 대부분 `cat_` 접두사만 다르지만 분식·고기는 이름이 달라 표로 둔다.
 */
const CATEGORY_IDS: Record<string, FoodCategory> = {
  cat_korean: "korean",
  cat_bunsik: "snack",
  cat_chinese: "chinese",
  cat_japanese: "japanese",
  cat_western: "western",
  cat_asian: "asian",
  cat_meat: "grill",
  cat_seafood: "seafood",
  cat_cafe: "cafe",
  cat_brunch: "brunch",
  cat_pub: "pub",
  cat_bar: "bar",
  cat_fastfood: "fastfood",
  cat_buffet: "buffet",
};

/**
 * 서버가 매핑에 실패하면 null로 내려온다. 우리가 모르는 값도 null로 본다.
 *
 * 추천 응답(`ReviewedPlaceItem.categoryId`)만 스펙이 접두사 없는 아이콘 키라고 적어둬서
 * 두 형태를 모두 받는다. 매장 응답이 `cat_` 형태인 것은 실제 응답으로 확인했다.
 */
export function toFoodCategory(categoryId: string | null | undefined): FoodCategory | null {
  if (!categoryId) {
    return null;
  }

  return CATEGORY_IDS[categoryId] ?? FOOD_CATEGORIES.find((c) => c === categoryId) ?? null;
}
