import type { RecommendationResponse } from "@/api/gen/_model/recommendationResponse.gen";
import type { ReviewedPlaceItem } from "@/api/gen/_model/reviewedPlaceItem.gen";
import {
  FOOD_CATEGORIES,
  type FoodCategory,
  type RecommendResult,
  type RecommendStore,
  type RecommendSummary,
} from "../_model/recommend";

/**
 * 응답의 `categoryId`는 스티커 14종의 키다. 서버가 매핑에 실패하면 null로 내려온다.
 *
 * 우리가 가진 키인지 확인하고 좁힌다. 캐스팅으로 넘기면 없는 키가 스티커 표를 그대로 통과해
 * `undefined`가 이미지 src에 들어간다.
 */
function toFoodCategory(categoryId: string | null | undefined): FoodCategory | null {
  const known = FOOD_CATEGORIES.find((category) => category === categoryId);

  return known ?? null;
}

export function toRecommendStores(items: readonly ReviewedPlaceItem[]): RecommendStore[] {
  return items.map((item) => ({
    placeId: item.placeId,
    name: item.name,
    thumbnailUrl: item.thumbnailUrl ?? null,
    category: toFoodCategory(item.categoryId),
  }));
}

/** 요약은 좋았던 점·아쉬웠던 점 각각 있을 때만 한 줄이 된다. */
function toSummaries(summary: RecommendationResponse["summary"]): RecommendSummary[] {
  if (!summary) {
    return [];
  }

  const lines: RecommendSummary[] = [];

  if (summary.pros) {
    lines.push({ id: `${summary.reviewId}-up`, tone: "up", text: summary.pros });
  }
  if (summary.cons) {
    lines.push({ id: `${summary.reviewId}-down`, tone: "down", text: summary.cons });
  }

  return lines;
}

export function toRecommendResult(response: RecommendationResponse): RecommendResult {
  return {
    placeId: response.place.placeId,
    name: response.place.name,
    roadAddress: response.place.roadAddress,
    categoryName: response.place.categoryName ?? null,
    thumbnailUrl: response.place.thumbnailUrl ?? null,
    summaries: toSummaries(response.summary),
  };
}
