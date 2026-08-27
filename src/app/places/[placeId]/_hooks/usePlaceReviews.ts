import { usePlaceReviews as usePlaceReviewsQuery } from "@/api/gen/place-detail/place-detail.gen";
import type { CurrentPosition } from "@/shared/hooks/useCurrentPosition";
import type { ReviewCardData } from "@/shared/model/review";
import { toPlaceReviews } from "../_utils/placeMapper";

export function usePlaceReviews(placeId: string, position: CurrentPosition) {
  const hasCoordinates = position.status === "granted";

  return usePlaceReviewsQuery<ReviewCardData[]>(
    placeId,
    {
      latitude: hasCoordinates ? position.latitude : undefined,
      longitude: hasCoordinates ? position.longitude : undefined,
    },
    { query: { select: toPlaceReviews } },
  );
}
