import type { FoodCategory } from "@/shared/model/foodCategory";

/** 냄비에 담을 수 있는 매장 한 곳. `_utils/recommendMapper.ts`가 응답을 이 모양으로 바꾼다. */
export type RecommendStore = {
  placeId: string;
  name: string;
  /** 내가 그 매장에 쓴 최신 리뷰의 첫 사진. 없으면 카테고리 스티커가 대신 그려진다. */
  thumbnailUrl: string | null;
  /** 서버가 매핑에 실패하면 null. 우리가 가진 14종 밖의 값도 null로 본다. */
  category: FoodCategory | null;
};

/** 리뷰 요약 한 줄. 좋았던 점과 아쉬웠던 점을 아이콘으로 가른다. */
export type RecommendSummary = {
  id: string;
  tone: "up" | "down";
  text: string;
};

/** 추천 결과 한 곳. `_utils/recommendMapper.ts`가 추천 응답을 이 모양으로 바꾼다. */
export type RecommendResult = {
  placeId: string;
  name: string;
  roadAddress: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  summaries: readonly RecommendSummary[];
};
