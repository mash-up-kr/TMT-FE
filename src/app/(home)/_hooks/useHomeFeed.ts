import { keepPreviousData } from "@tanstack/react-query";
import { useFeed } from "@/api/gen/home/home.gen";
import type { CurrentPosition } from "@/shared/hooks/useCurrentPosition";
import type { FeedReview } from "../_model/home";
import { toFeedReviews } from "../_utils/homeMapper";

export function useHomeFeed(position: CurrentPosition) {
  const hasCoordinates = position.status === "granted";

  return useFeed<FeedReview[]>(
    {
      latitude: hasCoordinates ? position.latitude : undefined,
      longitude: hasCoordinates ? position.longitude : undefined,
    },
    {
      query: {
        enabled: hasCoordinates,
        select: toFeedReviews,
        // 재측위로 좌표 칸이 바뀌어도 이전 목록을 유지해 스켈레톤으로 되돌아가지 않는다.
        placeholderData: keepPreviousData,
      },
    },
  );
}
