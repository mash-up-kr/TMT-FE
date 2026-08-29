import type { RecommendationResponse } from "@/api/gen/_model/recommendationResponse.gen";
import type { RecommendResult, RecommendSummary } from "../_model/recommend";

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
