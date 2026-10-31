import type { CursorPageGroupCardResponse } from "@/api/gen/_model/cursorPageGroupCardResponse.gen";
import { useListGroups } from "@/api/gen/group/group.gen";
import { useNearbyReviews } from "@/api/gen/nearby/nearby.gen";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import type { FeedReview, HomeRecommendedGroup } from "../_model/home";
import { toFeedReviews, toRecommendedGroup } from "../_utils/homeMapper";

/** 첫 화면에서 아래쪽 추천 그룹까지 닿을 수 있는 양만 보여준다. 더 보려면 피드 탭으로 간다. */
const GUEST_REVIEW_LIMIT = 5;
const GUEST_GROUP_LIMIT = 5;

function toRecommendedGroups(page: CursorPageGroupCardResponse): HomeRecommendedGroup[] {
  return page.items.map(toRecommendedGroup);
}

export function useGuestNearbyReviews(position: ResolvedPosition | null) {
  return useNearbyReviews<FeedReview[]>(
    {
      latitude: position?.latitude ?? 0,
      longitude: position?.longitude ?? 0,
      limit: GUEST_REVIEW_LIMIT,
    },
    { query: { enabled: position !== null, select: toFeedReviews } },
  );
}

export function useGuestRecommendedGroups() {
  return useListGroups<HomeRecommendedGroup[]>(
    { limit: GUEST_GROUP_LIMIT },
    { query: { select: toRecommendedGroups } },
  );
}
