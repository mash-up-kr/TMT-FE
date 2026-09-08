import { keepPreviousData } from "@tanstack/react-query";
import { useNearbyReviews } from "@/api/gen/nearby/nearby.gen";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import type { ReviewCardData } from "@/shared/model/review";
import { toFeedReviews } from "../_utils/feedMapper";

export function useFeedReviews(position: ResolvedPosition | null) {
  return useNearbyReviews<ReviewCardData[]>(
    {
      latitude: position?.latitude ?? 0,
      longitude: position?.longitude ?? 0,
    },
    {
      query: {
        enabled: position !== null,
        select: toFeedReviews,
        // 좌표가 바뀌어도 이전 목록을 유지해 빈 화면을 거치지 않는다.
        placeholderData: keepPreviousData,
      },
    },
  );
}
