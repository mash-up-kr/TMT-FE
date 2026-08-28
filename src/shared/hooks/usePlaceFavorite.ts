import { useQueryClient } from "@tanstack/react-query";
import type { FavoriteResponse } from "@/api/gen/_model/favoriteResponse.gen";
import type { PlaceDetailResponse } from "@/api/gen/_model/placeDetailResponse.gen";
import { getFeedQueryKey } from "@/api/gen/home/home.gen";
import { getNearbyReviewsQueryKey } from "@/api/gen/nearby/nearby.gen";
import { getSearchPlacesQueryKey } from "@/api/gen/place/place.gen";
import {
  getPlaceDetailQueryKey,
  useAddFavorite,
  useRemoveFavorite,
} from "@/api/gen/place-detail/place-detail.gen";
import { getMeQueryKey, getMyFavoritesQueryKey } from "@/api/gen/profile/profile.gen";
import { toast } from "@/shared/ui/Toast";

export type PlaceFavoriteTarget = Readonly<{
  id: string;
  isFavorite?: boolean;
}>;

type UsePlaceFavoriteOptions = {
  onSuccessAction?: (result: FavoriteResponse) => void;
};

export function usePlaceFavorite({ onSuccessAction }: UsePlaceFavoriteOptions = {}) {
  const queryClient = useQueryClient();
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const isPending = addFavorite.isPending || removeFavorite.isPending;

  async function toggleFavorite(place: PlaceFavoriteTarget): Promise<void> {
    if (isPending) {
      return;
    }

    try {
      const result = place.isFavorite
        ? await removeFavorite.mutateAsync({ placeId: place.id })
        : await addFavorite.mutateAsync({ placeId: place.id });

      queryClient.setQueryData<PlaceDetailResponse>(
        getPlaceDetailQueryKey(result.placeId),
        (current) => (current ? { ...current, isFavorite: result.isFavorite } : current),
      );
      onSuccessAction?.(result);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getFeedQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getNearbyReviewsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getSearchPlacesQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getMyFavoritesQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getMeQueryKey() }),
      ]);
    } catch {
      toast.error("좋아요 처리에 실패했어요. 다시 시도해 주세요.");
    }
  }

  return { isPending, onToggleAction: toggleFavorite };
}
