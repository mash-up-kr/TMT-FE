import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getFeedQueryKey } from "@/api/gen/home/home.gen";
import {
  getPlaceDetailQueryKey,
  useAddFavorite,
  useRemoveFavorite,
} from "@/api/gen/place-detail/place-detail.gen";
import { getMyFavoritesQueryKey } from "@/api/gen/profile/profile.gen";
import type { ReviewCardFavoriteAction } from "@/shared/components/ReviewCard/ReviewCard";
import { toast } from "@/shared/ui/Toast";
import type { FeedReview } from "../_model/home";

export function useHomeFavorite(reviews: FeedReview[] | undefined) {
  const queryClient = useQueryClient();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  const isPending = addFavorite.isPending || removeFavorite.isPending;

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

  async function toggleFavorite(place: FeedReview["place"]): Promise<void> {
    if (isPending) {
      return;
    }

    try {
      const result = place.isFavorite
        ? await removeFavorite.mutateAsync({ placeId: place.id })
        : await addFavorite.mutateAsync({ placeId: place.id });

      setFavoriteOverrides((current) => ({
        ...current,
        [result.placeId]: result.isFavorite,
      }));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getFeedQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getMyFavoritesQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getPlaceDetailQueryKey(place.id) }),
      ]);
    } catch {
      toast.error("좋아요 처리에 실패했어요. 다시 시도해 주세요.");
    }
  }

  const favoriteAction: ReviewCardFavoriteAction = {
    isPending,
    onToggleAction: toggleFavorite,
  };

  return { reviews: reviewsWithFavorite, favoriteAction };
}
