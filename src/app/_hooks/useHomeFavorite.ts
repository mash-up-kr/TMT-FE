import { useMemo, useState } from "react";
import type { ReviewCardFavoriteAction } from "@/shared/components/ReviewCard/ReviewCard";
import { usePlaceFavorite } from "@/shared/hooks/usePlaceFavorite";
import type { FeedReview } from "../_model/home";

export function useHomeFavorite(reviews: FeedReview[] | undefined) {
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  const favorite = usePlaceFavorite({
    onSuccessAction: (result) => {
      setFavoriteOverrides((current) => ({
        ...current,
        [result.placeId]: result.isFavorite,
      }));
    },
  });

  const reviewsWithFavorite = useMemo(
    () =>
      reviews?.map((review) => {
        const isFavorite = favoriteOverrides[review.place.id];

        return isFavorite === undefined
          ? review
          : { ...review, place: { ...review.place, isFavorite } };
      }),
    [favoriteOverrides, reviews],
  );

  const favoriteAction: ReviewCardFavoriteAction = {
    isPending: favorite.isPending,
    onToggleAction: favorite.onToggleAction,
  };

  return { reviews: reviewsWithFavorite, favoriteAction };
}
