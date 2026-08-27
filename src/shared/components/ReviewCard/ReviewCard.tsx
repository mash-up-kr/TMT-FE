import Link from "next/link";
import AvatarTomato from "@/shared/assets/avatar-tomato.svg?react";
import imageFallback from "@/shared/assets/dummy-image.png";
import profileFallback from "@/shared/assets/dummy-profile.png";
import { ReviewTagIcon } from "@/shared/components/ReviewTagIcon/ReviewTagIcon";
import { placeDetailPath } from "@/shared/constants/routes";
import type { ReviewCardData } from "@/shared/model/review";
import { ThumbDownIcon, ThumbUpIcon } from "@/shared/ui/ColorIcons";
import { HeartIcon, StarIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { cn } from "@/shared/utils/cn";
import { formatDistance } from "@/shared/utils/formatDistance";

const RESTRICTED_CONTENT_CLASS = "pointer-events-none select-none blur-[4px]";

type ReviewCardProps = {
  review: ReviewCardData;
  isContentRestricted?: boolean;
  maxVisibleTags?: number;
  hidePlace?: boolean;
};

export function ReviewCard({
  review,
  isContentRestricted = false,
  maxVisibleTags,
  hidePlace = false,
}: ReviewCardProps) {
  return (
    <article className="flex flex-col bg-surface-primary">
      <ReviewCardHeader
        nickname={review.authorNickname}
        profileImageUrl={review.authorProfileImageUrl}
        rating={review.rating}
        distanceMeters={review.distanceMeters}
      />
      <ReviewCardPhoto url={review.photoUrls.at(0) ?? null} />
      <div className="flex flex-col gap-ds-12 rounded-b-ds-md bg-surface-primary p-ds-16">
        <AiSummary
          pros={review.pros}
          cons={review.cons}
          isContentRestricted={isContentRestricted}
        />
        {review.content ? (
          <p
            aria-hidden={isContentRestricted || undefined}
            className={cn(
              "whitespace-pre-line text-body-md-medium text-content-primary",
              isContentRestricted && RESTRICTED_CONTENT_CLASS,
            )}
          >
            {review.content}
          </p>
        ) : null}
        <TagList tags={review.tags} maxVisible={maxVisibleTags} />
        {hidePlace ? null : <PlaceRow place={review.place} />}
      </div>
    </article>
  );
}

type ReviewCardHeaderProps = {
  nickname: string;
  profileImageUrl: string | null;
  rating: number;
  distanceMeters: number | null;
};

function ReviewCardHeader({
  nickname,
  profileImageUrl,
  rating,
  distanceMeters,
}: ReviewCardHeaderProps) {
  return (
    <header className="flex items-center gap-ds-8 px-ds-12 pt-ds-16 pb-ds-8">
      <AuthorAvatar imageUrl={profileImageUrl} />
      <div className="flex min-w-0 flex-1 items-center justify-between gap-ds-8">
        <p className="truncate text-body-lg-medium text-content-primary">{nickname}</p>
        <div className="flex flex-col items-end justify-center">
          <p className="flex items-center gap-ds-2 text-body-sm-medium text-content-interactive-primary">
            <StarIcon
              aria-hidden="true"
              size={12}
              className="shrink-0 text-icon-interactive-primary"
            />
            {rating.toFixed(1)}
          </p>
          {distanceMeters === null ? null : (
            <p className="text-body-sm-medium text-content-disabled">
              {formatDistance(distanceMeters)}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}

function AuthorAvatar({ imageUrl }: { imageUrl: string | null }) {
  if (!imageUrl) {
    return (
      <div className="flex size-ds-40 shrink-0 items-center justify-center rounded-ds-full bg-surface-groupcard-badge">
        <AvatarTomato aria-hidden="true" className="h-[24.215px] w-[26.667px]" />
      </div>
    );
  }

  return (
    <ImageWithFallback
      src={imageUrl}
      fallbackSrc={profileFallback}
      alt=""
      width={40}
      height={40}
      className="size-ds-40 shrink-0 rounded-ds-full object-cover"
    />
  );
}

function ReviewCardPhoto({ url }: { url: string | null }) {
  if (!url) {
    return null;
  }

  return (
    <div className="relative h-[360px] w-full shrink-0 overflow-hidden bg-surface-tertiary">
      <ImageWithFallback
        src={url}
        fallbackSrc={imageFallback}
        alt=""
        className="size-full object-cover"
      />
    </div>
  );
}

type AiSummaryProps = {
  pros: string | null;
  cons: string | null;
  isContentRestricted: boolean;
};

function AiSummary({ pros, cons, isContentRestricted }: AiSummaryProps) {
  if (!pros && !cons) {
    return null;
  }

  return (
    <div className="flex flex-col gap-ds-8">
      {pros ? <SummaryLine label="장점">{pros}</SummaryLine> : null}
      {cons ? (
        <SummaryLine label="단점" negative isContentRestricted={isContentRestricted}>
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
  isContentRestricted?: boolean;
};

function SummaryLine({ label, children, negative, isContentRestricted }: SummaryLineProps) {
  const Icon = negative ? ThumbDownIcon : ThumbUpIcon;

  return (
    <p className="relative flex w-fit max-w-full items-start gap-ds-4 rounded-ds-xs bg-surface-secondary px-ds-8 py-ds-4 text-body-sm-regular text-content-secondary">
      <span className="sr-only">{label}</span>
      <Icon className="size-ds-20 shrink-0" />
      <span
        aria-hidden={isContentRestricted || undefined}
        className={cn("min-w-0 flex-1", isContentRestricted && RESTRICTED_CONTENT_CLASS)}
      >
        {children}
      </span>
    </p>
  );
}

const TAG_CHIP_CLASS =
  "inline-flex shrink-0 items-center gap-ds-4 rounded-ds-full inset-ring inset-ring-stroke-primary bg-surface-primary px-ds-12 py-ds-4 text-body-sm-medium text-content-primary";

type TagListProps = {
  tags: ReviewCardData["tags"];
  maxVisible?: number;
};

function TagList({ tags, maxVisible }: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  const visible = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = tags.length - visible.length;

  return (
    <ul className="flex flex-wrap gap-ds-4">
      {visible.map((tag) => (
        <li key={tag.id} className={TAG_CHIP_CLASS}>
          <ReviewTagIcon tagId={tag.id} className="size-ds-16 shrink-0" />
          {tag.label}
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li className={TAG_CHIP_CLASS} aria-label={`태그 ${hiddenCount}개 더 있음`}>
          +{hiddenCount}
        </li>
      ) : null}
    </ul>
  );
}

function PlaceRow({ place }: { place: ReviewCardData["place"] }) {
  return (
    <Link
      href={placeDetailPath(place.id)}
      className="flex items-center gap-ds-4 rounded-ds-sm bg-surface-secondary px-ds-12 py-ds-8"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-body-md-bold text-content-primary">{place.name}</p>
        <p className="truncate text-body-sm-medium text-content-secondary">{place.regionName}</p>
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
