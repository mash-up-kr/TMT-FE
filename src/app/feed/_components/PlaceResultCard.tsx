import Link from "next/link";
import fallbackImage from "@/shared/assets/dummy.png";
import { PlaceFavoriteButton } from "@/shared/components/PlaceFavoriteButton";
import { placeDetailPath } from "@/shared/constants/routes";
import { ReviewsIcon, StarIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { formatDistance } from "@/shared/utils/formatDistance";
import type { PlaceCard } from "../_utils/nearbyMapper";

/** 지표 아이콘 크기. GroupCard와 같은 12px 고정이라 값으로 둔다. */
const ICON_SIZE = 12;
/** 썸네일. 시안이 없어 GroupCard 썸네일 높이(100px)에 맞춘 정사각으로 둔다. */
const THUMBNAIL_SIZE = "size-[80px]";

type PlaceResultCardProps = {
  place: PlaceCard;
  favoriteAction: PlaceResultCardFavoriteAction;
};

type PlaceResultCardFavoriteAction = Readonly<{
  isPending: boolean;
  onToggleAction: (place: PlaceCard) => void;
}>;

/**
 * 검색·큐레이션 칩 결과의 가게 카드.
 *
 * 시안 미확정 상태다 (B 명세 §6-2 — 결과 화면이 아직 없다). PlaceCard가 주는 필드를
 * GroupCard의 토큰·간격에 맞춰 배치해뒀고, 시안이 나오면 이 컴포넌트 내부만 교체한다.
 */
export function PlaceResultCard({ place, favoriteAction }: PlaceResultCardProps) {
  return (
    <div className="flex items-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-12">
      <Link href={placeDetailPath(place.id)} className="flex min-w-0 flex-1 items-center gap-ds-12">
        <ImageWithFallback
          src={place.thumbnailUrl}
          fallbackSrc={fallbackImage}
          alt=""
          className={`${THUMBNAIL_SIZE} shrink-0 rounded-ds-md object-cover`}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-ds-4">
          <div className="flex items-center gap-ds-4">
            <p className="truncate text-body-lg-bold text-content-primary">{place.name}</p>
            {place.averageRating === null ? null : (
              <p className="flex shrink-0 items-center gap-ds-2 text-body-sm-medium text-content-interactive-primary">
                <StarIcon size={ICON_SIZE} className="shrink-0 text-icon-interactive-primary" />
                {place.averageRating.toFixed(1)}
              </p>
            )}
          </div>

          <p className="truncate text-body-sm-medium text-content-secondary">
            {[place.regionName, place.categoryName].filter(Boolean).join(" · ")}
          </p>

          <div className="flex items-center gap-ds-12 text-body-sm-medium text-content-tertiary">
            <p className="flex items-center gap-ds-4">
              <ReviewsIcon size={ICON_SIZE} className="shrink-0" />
              {`리뷰 ${place.reviewCount}개`}
            </p>
            {place.distanceMeters === null ? null : <p>{formatDistance(place.distanceMeters)}</p>}
          </div>
        </div>
      </Link>

      <PlaceFavoriteButton
        placeName={place.name}
        isFavorite={place.isFavorite}
        isPending={favoriteAction.isPending}
        size={24}
        onToggleAction={() => favoriteAction.onToggleAction(place)}
      />
    </div>
  );
}
