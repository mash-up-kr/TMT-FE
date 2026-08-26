import { usePlaceReviews as usePlaceReviewsQuery } from "@/api/gen/place-detail/place-detail.gen";
import type { ReviewCardReview } from "@/shared/components/ReviewCard/ReviewCard";
import type { CurrentPosition } from "@/shared/hooks/useCurrentPosition";
import { toPlaceReviews } from "../_utils/placeMapper";

const SERVER_IGNORES_USER_ID = 1;

export function usePlaceReviews(placeId: string, position: CurrentPosition) {
  const hasCoordinates = position.status === "granted";

  return usePlaceReviewsQuery<ReviewCardReview[]>(
    placeId,
    {
      userId: SERVER_IGNORES_USER_ID,
      latitude: hasCoordinates ? position.latitude : undefined,
      longitude: hasCoordinates ? position.longitude : undefined,
    },
    { query: { select: toPlaceReviews } },
  );
}
