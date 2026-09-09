import { useMemo, useState } from "react";
import { type PlaceFavoriteTarget, usePlaceFavorite } from "@/shared/hooks/usePlaceFavorite";

/** 좋아요를 덮어쓸 수 있는 리뷰의 최소 형태. ReviewCardData와 홈의 FeedReview가 모두 만족한다. */
type FavoritableReview = {
  place: {
    id: string;
    isFavorite?: boolean;
  };
};

export type ReviewFavoriteAction = Readonly<{
  isPending: boolean;
  onToggleAction: (place: PlaceFavoriteTarget) => void;
}>;

/**
 * 리뷰 목록의 가게 좋아요를 토글하고, 결과를 목록에 덮어쓴다.
 * 무효화된 조회가 돌아오기만 기다리면 하트가 한 박자 늦게 바뀌어 안 눌린 것처럼 보인다.
 */
export function useReviewFavorites<Review extends FavoritableReview>(
  reviews: Review[] | undefined,
) {
  const [favoriteOverrides, setFavoriteOverrides] = useState<Record<string, boolean>>({});
  const favorite = usePlaceFavorite({
    onSuccessAction: (result) => {
      setFavoriteOverrides((current) => ({ ...current, [result.placeId]: result.isFavorite }));
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

  const favoriteAction: ReviewFavoriteAction = {
    isPending: favorite.isPending,
    onToggleAction: favorite.onToggleAction,
  };

  return { reviews: reviewsWithFavorite, favoriteAction };
}
