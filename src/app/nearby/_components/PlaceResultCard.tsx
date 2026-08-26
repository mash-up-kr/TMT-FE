import Link from "next/link";
import { HeartIcon, ReviewsIcon, StarIcon } from "@/shared/ui/Icons";
import { formatDistance } from "@/shared/utils/formatDistance";
import type { PlaceCard } from "../_utils/nearbyMapper";

/** 지표 아이콘 크기. GroupCard와 같은 12px 고정이라 값으로 둔다. */
const ICON_SIZE = 12;
/** 썸네일. 시안이 없어 GroupCard 썸네일 높이(100px)에 맞춘 정사각으로 둔다. */
const THUMBNAIL_SIZE = "size-[80px]";

type PlaceResultCardProps = {
  place: PlaceCard;
};

/**
 * 검색·큐레이션 칩 결과의 가게 카드.
 *
 * 시안 미확정 상태다 (B 명세 §6-2 — 결과 화면이 아직 없다). PlaceCard가 주는 필드를
 * GroupCard의 토큰·간격에 맞춰 배치해뒀고, 시안이 나오면 이 컴포넌트 내부만 교체한다.
 */
export function PlaceResultCard({ place }: PlaceResultCardProps) {
  return (
    <Link
      href={`/places/${place.id}`}
      className="flex items-center gap-ds-12 bg-surface-primary px-ds-20 py-ds-12"
    >
      <div
        className={`${THUMBNAIL_SIZE} shrink-0 overflow-hidden rounded-ds-md bg-surface-secondary`}
      >
        {place.thumbnailUrl ? (
          // biome-ignore lint/performance/noImgElement: 이미지 호스트가 확정되지 않아 next.config의 remotePatterns를 채울 수 없다.
          <img src={place.thumbnailUrl} alt="" className="size-full object-cover" loading="lazy" />
        ) : null}
      </div>

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

      <HeartIcon
        filled={place.isFavorite}
        aria-hidden="true"
        size={24}
        className="shrink-0 text-icon-interactive-primary"
      />
    </Link>
  );
}
