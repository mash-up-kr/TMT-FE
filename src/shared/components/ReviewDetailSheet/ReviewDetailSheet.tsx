"use client";

import imageFallback from "@/shared/assets/dummy-image.png";
import { ReviewTagIcon } from "@/shared/components/ReviewTagIcon/ReviewTagIcon";
import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { ButtonStack } from "@/shared/ui/ButtonStack";
import { ThumbDownIcon, ThumbUpIcon } from "@/shared/ui/ColorIcons";
import { MapPinIcon, StarIcon } from "@/shared/ui/Icons";
import { ImageViewer, ImageViewerTrigger } from "@/shared/ui/ImageViewer";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { cn } from "@/shared/utils/cn";

/** 사진 스트립 치수. 시안 실측값이 ds 스케일에 없어 값으로 둔다.
 * 콘텐츠 총폭 392px 고정 — 2장 194×2+4, 3장 128×3+8. 보이는 영역(340px)보다 넓어
 * 마지막 장이 잘려 보이고, 이것이 스크롤 가능하다는 표시를 겸한다. */
const PHOTO_HEIGHT = "h-[168px]";
const PHOTO_WIDTH_PAIR = "w-[194px]";
const PHOTO_WIDTH_TRIPLE = "w-[128px]";

/** next/image가 srcset을 고를 때 쓰는 실제 렌더 크기. 위 클래스와 같은 값이어야 한다. */
const PHOTO_HEIGHT_PX = 168;
const PHOTO_WIDTH_SINGLE_PX = 340;
const PHOTO_WIDTH_PAIR_PX = 194;
const PHOTO_WIDTH_TRIPLE_PX = 128;

export interface ReviewDetailPhoto {
  id: string;
  url: string;
}

export interface ReviewDetailTag {
  id: string;
  label: string;
}

export interface ReviewDetail {
  placeName: string;
  address: string | null;
  categoryName: string | null;
  rating: number | null;
  tags: ReviewDetailTag[];
  photos: ReviewDetailPhoto[];
  pros: string | null;
  cons: string | null;
  content: string | null;
}

type ReviewDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  detail: ReviewDetail;
  /** 미완성 저장이면 넘긴다. '이어서 작성하기' CTA가 나타난다. */
  onContinueWriting?: () => void;
};

export function ReviewDetailSheet({
  open,
  onOpenChange,
  detail,
  onContinueWriting,
}: ReviewDetailSheetProps) {
  const { placeName, address, categoryName, rating, tags, photos, pros, cons, content } = detail;
  const hasBody = Boolean(pros || cons || content);

  return (
    <BottomSheet
      label="리뷰 상세"
      open={open}
      onOpenChange={onOpenChange}
      footer={
        onContinueWriting ? (
          <ButtonStack>
            <Button onClick={onContinueWriting}>이어서 작성하기</Button>
          </ButtonStack>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-ds-20 pb-ds-12">
        <section className="flex flex-col gap-ds-12">
          <PlaceName name={placeName} rating={rating} />
          <PlaceInfo address={address} categoryName={categoryName} />
          <TagList tags={tags} />
        </section>

        {photos.length > 0 ? <PhotoStrip photos={photos} /> : null}

        {hasBody ? (
          <>
            <div aria-hidden="true" className="-mx-ds-20 h-ds-12 shrink-0 bg-surface-secondary" />
            <div className="flex flex-col gap-ds-20">
              <AiSummary pros={pros} cons={cons} />
              {content ? (
                <p className="whitespace-pre-line text-body-md-medium text-content-primary">
                  {content}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </BottomSheet>
  );
}

type PlaceNameProps = {
  name: string;
  rating: number | null;
};

function PlaceName({ name, rating }: PlaceNameProps) {
  return (
    <div className="flex items-center gap-ds-4">
      <h2 className="truncate text-heading-md text-content-primary">{name}</h2>
      {rating !== null && (
        <p className="flex shrink-0 items-center gap-ds-2 text-body-md-medium text-content-interactive-primary">
          <StarIcon size={16} className="shrink-0 text-icon-interactive-primary" />
          {rating.toFixed(1)}
        </p>
      )}
    </div>
  );
}

type PlaceInfoProps = {
  address: string | null;
  categoryName: string | null;
};

function PlaceInfo({ address, categoryName }: PlaceInfoProps) {
  if (!address && !categoryName) {
    return null;
  }

  return (
    <p className="flex items-center gap-ds-4 text-body-md-medium text-content-tertiary">
      <MapPinIcon size={20} className="shrink-0" />
      {address ? <span className="truncate">{address}</span> : null}
      {address && categoryName ? (
        <span aria-hidden="true" className="h-ds-12 w-px shrink-0 bg-stroke-primary" />
      ) : null}
      {categoryName ? <span className="shrink-0">{categoryName}</span> : null}
    </p>
  );
}

type TagListProps = {
  tags: ReviewDetailTag[];
};

function TagList({ tags }: TagListProps) {
  const dragScroll = useDragScroll<HTMLUListElement>();

  if (tags.length === 0) {
    return null;
  }

  return (
    <ul
      {...dragScroll}
      className="scrollbar-hidden -mx-ds-20 flex select-none gap-ds-4 overflow-x-auto px-ds-20"
    >
      {tags.map((tag) => (
        <li
          key={tag.id}
          className="inline-flex shrink-0 items-center gap-ds-4 rounded-ds-full inset-ring inset-ring-stroke-primary bg-surface-primary px-ds-12 py-ds-4 text-body-md-medium text-content-primary"
        >
          <ReviewTagIcon tagId={tag.id} className="size-ds-16 shrink-0" />
          {tag.label}
        </li>
      ))}
    </ul>
  );
}

type PhotoStripProps = {
  photos: ReviewDetailPhoto[];
};

function PhotoStrip({ photos }: PhotoStripProps) {
  const dragScroll = useDragScroll<HTMLUListElement>();
  const photoUrls = photos.map((photo) => photo.url);

  if (photos.length === 1) {
    return (
      <ImageViewer imageUrls={photoUrls} label="리뷰 사진" fallbackSrc={imageFallback}>
        <ImageViewerTrigger
          index={0}
          className={cn(
            "w-full shrink-0 overflow-hidden rounded-ds-lg bg-surface-secondary",
            PHOTO_HEIGHT,
          )}
        >
          <ImageWithFallback
            src={photos[0].url}
            fallbackSrc={imageFallback}
            alt="리뷰 사진"
            width={PHOTO_WIDTH_SINGLE_PX}
            height={PHOTO_HEIGHT_PX}
            className="size-full object-cover"
          />
        </ImageViewerTrigger>
      </ImageViewer>
    );
  }

  return (
    <ImageViewer imageUrls={photoUrls} label="리뷰 사진" fallbackSrc={imageFallback}>
      <ul
        {...dragScroll}
        className="scrollbar-hidden -mr-ds-20 flex select-none gap-ds-4 overflow-x-auto rounded-l-ds-lg"
      >
        {photos.map((photo, index) => (
          <li
            key={photo.id}
            className={cn(
              "shrink-0 overflow-hidden bg-surface-secondary",
              PHOTO_HEIGHT,
              photos.length === 2 ? PHOTO_WIDTH_PAIR : PHOTO_WIDTH_TRIPLE,
              index === photos.length - 1 && "rounded-r-ds-lg",
            )}
          >
            <ImageViewerTrigger index={index} className="size-full">
              <ImageWithFallback
                src={photo.url}
                fallbackSrc={imageFallback}
                alt={`리뷰 사진 ${index + 1}`}
                width={photos.length === 2 ? PHOTO_WIDTH_PAIR_PX : PHOTO_WIDTH_TRIPLE_PX}
                height={PHOTO_HEIGHT_PX}
                draggable={false}
                className="size-full object-cover"
              />
            </ImageViewerTrigger>
          </li>
        ))}
      </ul>
    </ImageViewer>
  );
}

type AiSummaryProps = {
  pros: string | null;
  cons: string | null;
};

function AiSummary({ pros, cons }: AiSummaryProps) {
  if (!pros && !cons) {
    return null;
  }

  return (
    <div className="flex flex-col gap-ds-8">
      {pros ? <SummaryLine label="장점">{pros}</SummaryLine> : null}
      {cons ? (
        <SummaryLine label="단점" negative>
          {cons}
        </SummaryLine>
      ) : null}
    </div>
  );
}

type SummaryLineProps = {
  label: string;
  children: string;
  negative?: boolean;
};

function SummaryLine({ label, children, negative }: SummaryLineProps) {
  const Icon = negative ? ThumbDownIcon : ThumbUpIcon;

  return (
    <p className="flex w-fit items-start gap-ds-4 rounded-ds-xs bg-surface-secondary px-ds-8 py-ds-4 text-body-sm-regular text-content-secondary">
      <span className="sr-only">{label}</span>
      <Icon className="size-ds-20 shrink-0" />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}
