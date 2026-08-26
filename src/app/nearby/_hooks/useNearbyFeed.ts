import { useNearbyReviews } from "@/api/gen/nearby/nearby.gen";
import type { ReviewCardReview } from "@/shared/components/ReviewCard/ReviewCard";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { toNearbyReviews } from "../_utils/nearbyMapper";

const SERVER_IGNORES_USER_ID = 1;

export function useNearbyFeed(position: ResolvedPosition | null) {
  return useNearbyReviews<ReviewCardReview[]>(
    {
      userId: SERVER_IGNORES_USER_ID,
      latitude: position?.latitude,
      longitude: position?.longitude,
    },
    { query: { enabled: position !== null, select: toNearbyReviews } },
  );
}
