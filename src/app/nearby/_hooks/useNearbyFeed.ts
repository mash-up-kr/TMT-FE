import { useNearbyReviews } from "@/api/gen/nearby/nearby.gen";
import type { ResolvedPosition } from "@/shared/hooks/useResolvedPosition";
import type { ReviewCardData } from "@/shared/model/review";
import { toNearbyReviews } from "../_utils/nearbyMapper";

export function useNearbyFeed(position: ResolvedPosition | null) {
  return useNearbyReviews<ReviewCardData[]>(
    {
      latitude: position?.latitude ?? 0,
      longitude: position?.longitude ?? 0,
    },
    { query: { enabled: position !== null, select: toNearbyReviews } },
  );
}
