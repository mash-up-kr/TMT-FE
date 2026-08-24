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
    { query: { enabled: hasCoordinates, select: toFeedReviews } },
  );
}
