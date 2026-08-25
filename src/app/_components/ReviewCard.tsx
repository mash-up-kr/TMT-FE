import imageFallback from "@/shared/assets/dummy-image.png";
import profileFallback from "@/shared/assets/dummy-profile.png";
import { ReviewTagIcon } from "@/shared/components/ReviewTagIcon/ReviewTagIcon";
import { ThumbDownIcon, ThumbUpIcon } from "@/shared/ui/ColorIcons";
import { HeartIcon, StarIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { FeedReview } from "../_model/home";
import AvatarTomato from "./assets/avatar-tomato.svg?react";

type ReviewCardProps = {
  review: FeedReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
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
        <AiSummary pros={review.pros} cons={review.cons} />
        {review.content ? (
          <p className="whitespace-pre-line text-body-md-medium text-content-primary">
            {review.content}
          </p>
        ) : null}
        <TagList tags={review.tags} />
        <PlaceRow place={review.place} />
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

function formatDistance(meters: number): string {
  return meters < 1000 ? `${Math.round(meters)}m` : `${(meters / 1000).toFixed(1)}km`;
}

type AuthorAvatarProps = {
  imageUrl: string | null;
};

function AuthorAvatar({ imageUrl }: AuthorAvatarProps) {
  if (!imageUrl) {
    return (
      <div className="flex size-ds-40 shrink-0 items-center justify-center rounded-ds-full bg-[#ffe0e0]">
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
      sizes="40px"
      className="size-ds-40 shrink-0 rounded-ds-full object-cover"
    />
  );
}

type ReviewCardPhotoProps = {
  url: string | null;
};

function ReviewCardPhoto({ url }: ReviewCardPhotoProps) {
  if (!url) {
    return null;
  }

  return (
    <div className="relative h-[360px] w-full shrink-0 overflow-hidden bg-surface-tertiary">
      <ImageWithFallback
        src={url}
        fallbackSrc={imageFallback}
        alt=""
        fill
        sizes="100vw"
        className="size-full object-cover"
      />
    </div>
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
    <p className="flex w-fit max-w-full items-start gap-ds-4 rounded-ds-xs bg-surface-secondary px-ds-8 py-ds-4 text-body-sm-regular text-content-secondary">
      <span className="sr-only">{label}</span>
      <Icon className="size-ds-20 shrink-0" />
      <span className="min-w-0 flex-1">{children}</span>
    </p>
  );
}

type TagListProps = {
  tags: FeedReview["tags"];
};

function TagList({ tags }: TagListProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-ds-4">
      {tags.map((tag) => (
        <li
          key={tag.id}
          className="inline-flex shrink-0 items-center gap-ds-4 rounded-ds-full inset-ring inset-ring-stroke-primary bg-surface-primary px-ds-12 py-ds-4 text-body-sm-medium text-content-primary"
        >
          <ReviewTagIcon tagId={tag.id} className="size-ds-16 shrink-0" />
          {tag.label}
        </li>
      ))}
    </ul>
  );
}

type PlaceRowProps = {
  place: FeedReview["place"];
};

function PlaceRow({ place }: PlaceRowProps) {
  return (
    <div className="flex items-center gap-ds-4 rounded-ds-sm bg-surface-secondary px-ds-12 py-ds-8">
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="truncate text-body-md-bold text-content-primary">{place.name}</p>
        {place.roadAddress ? (
          <p className="truncate text-body-sm-medium text-content-secondary">{place.roadAddress}</p>
        ) : null}
      </div>
      <HeartIcon
        filled
        aria-hidden="true"
        size={24}
        className="shrink-0 text-icon-interactive-primary"
      />
    </div>
  );
}
