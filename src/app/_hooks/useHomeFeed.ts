"use client";

import { useFeed } from "@/api/gen/home/home.gen";
import type { FeedReview } from "../_model/home";
import { toFeedReviews } from "../_utils/homeMapper";
import type { CurrentPosition } from "./useCurrentPosition";

const SERVER_IGNORES_USER_ID = 1;

export function useHomeFeed(position: CurrentPosition) {
  const hasCoordinates = position.status === "granted";

  return useFeed<FeedReview[]>(
    {
      userId: SERVER_IGNORES_USER_ID,
      latitude: hasCoordinates ? position.latitude : undefined,
      longitude: hasCoordinates ? position.longitude : undefined,
    },
    { query: { enabled: hasCoordinates, select: toFeedReviews } },
  );
}
