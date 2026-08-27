import { useNearbyReviews } from "@/api/gen/nearby/nearby.gen";
import type { ReviewCardReview } from "@/shared/components/ReviewCard/ReviewCard";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import { toNearbyReviews } from "../_utils/nearbyMapper";

export function useNearbyFeed(position: ResolvedPosition | null) {
  return useNearbyReviews<ReviewCardReview[]>(
    {
      latitude: position?.latitude,
      longitude: position?.longitude,
    },
    { query: { enabled: position !== null, select: toNearbyReviews } },
  );
}
