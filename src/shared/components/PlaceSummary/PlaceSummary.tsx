"use client";

import fallbackImage from "@/shared/assets/dummy-image.png";
import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { MapPinIcon, PhoneIcon, StarIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";

/** 시안 실측 120px 정사각 스트립. ds 스케일에 없어 값으로 둔다. */
const PHOTO_SIZE = "size-[120px]";

export interface PlaceSummaryData {
  photoUrls: string[];
  roadAddress: string;
  phoneNumber: string | null;
}

type PlaceSummaryProps = {
  place: PlaceSummaryData;
  /**
   * 지도-바텀시트 전환. 시안에 링크가 항상 있어 기본으로 노출하고,
   * 전환 대상 화면이 정해지면 핸들러를 넘긴다.
   */
  onMapClick?: () => void;
  /** 핀 시트에는 전화 줄이 없다 (시안 1340:28920). */
  hidePhone?: boolean;
};

/**
 * 사진 스트립과 위치·전화 정보. 가게 상세 상단과 핀 클릭 시트가 공유한다 (B 명세 §3-1).
 *
 * 가게명·별점은 포함하지 않는다 — 상세는 본문 제목으로, 시트는 찜·닫기와 한 줄로
 * 배치해 화면마다 형태가 다르다.
 */
export function PlaceSummary({ place, onMapClick, hidePhone = false }: PlaceSummaryProps) {
  return (
    <>
      {place.photoUrls.length > 0 ? <PhotoStrip urls={place.photoUrls} /> : null}

      <div className="flex flex-col gap-ds-12 px-ds-20 py-ds-20 text-body-md-medium text-content-tertiary">
        <p className="flex items-center gap-ds-4">
          <MapPinIcon size={20} className="shrink-0 text-icon-interactive-primary" />
          <span className="min-w-0 truncate">{place.roadAddress}</span>
          <span aria-hidden="true" className="h-ds-12 w-px shrink-0 bg-stroke-primary" />
          <button
            type="button"
            onClick={onMapClick}
            className="shrink-0 text-body-md-medium text-content-info"
          >
            지도
          </button>
        </p>
        {!hidePhone && place.phoneNumber ? (
          <p className="flex items-center gap-ds-4">
            <PhoneIcon size={20} className="shrink-0" />
            <span className="min-w-0 truncate">{place.phoneNumber}</span>
            <span aria-hidden="true" className="h-ds-12 w-px shrink-0 bg-stroke-primary" />
            <a
              href={`tel:${place.phoneNumber.replace(/\s+/g, "")}`}
              className="shrink-0 text-body-md-medium text-content-info"
            >
              전화하기
            </a>
          </p>
        ) : null}
      </div>
    </>
  );
}

function PhotoStrip({ urls }: { urls: string[] }) {
  const dragScroll = useDragScroll<HTMLUListElement>();

  return (
    <ul
      {...dragScroll}
      className="scrollbar-hidden flex select-none gap-ds-8 overflow-x-auto px-ds-20"
    >
      {urls.map((url) => (
        <li
          key={url}
          className={`${PHOTO_SIZE} shrink-0 overflow-hidden rounded-ds-lg bg-surface-secondary`}
        >
          <ImageWithFallback
            src={url}
            fallbackSrc={fallbackImage}
            alt=""
            draggable={false}
            className="size-full object-cover"
          />
        </li>
      ))}
    </ul>
  );
}

type PlaceRatingProps = {
  value: number | null;
};

/** 가게명 옆 별점. 상세·시트가 같은 표기를 쓴다. */
export function PlaceRating({ value }: PlaceRatingProps) {
  if (value === null) {
    return null;
  }

  return (
    <p className="flex shrink-0 items-center gap-ds-2 text-body-md-medium text-content-interactive-primary">
      <StarIcon size={16} className="shrink-0 text-icon-interactive-primary" />
      {value.toFixed(1)}
    </p>
  );
}
