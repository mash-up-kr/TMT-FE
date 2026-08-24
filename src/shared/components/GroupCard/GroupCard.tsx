import type { ComponentProps, ComponentType } from "react";
import fallbackImage from "@/shared/assets/dummy.png";
import { type IconProps, MembersIcon, ReviewsIcon, StoreIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import { handleImageError } from "@/shared/utils/handleImageError";
import SparkleIcon from "./assets/sparkle.svg?react";

/** 지표·뱃지에 쓰는 아이콘 크기. 시안이 12px 고정이라 ds 스케일 대신 값으로 둔다. */
const ICON_SIZE = 12;

const matchedLabel = (count: number) => `내가 저장한 가게와 ${count}개 일치해요`;

type GroupCardProps = Omit<ComponentProps<"div">, "title"> & {
  /** 그룹에 공유된 리뷰 사진에서 파생된다. 공유가 없는 신규 그룹은 없는 게 정상이다. */
  thumbnail: string | null;
  title: string;
  description: string;
  memberCount: number;
  reviewCount: number;
  placeCount: number;
  /** 내가 저장한 가게와 겹치는 수. 비로그인이면 0이라 뱃지가 사라진다. */
  matchedCount: number;
};

export function GroupCard({
  thumbnail,
  title,
  description,
  memberCount,
  reviewCount,
  placeCount,
  matchedCount,
  className,
  ...props
}: GroupCardProps) {
  return (
    <div
      data-slot="group-card"
      className={cn(
        "flex w-full flex-col overflow-hidden rounded-ds-md border-sm border-stroke-secondary bg-surface-primary",
        className,
      )}
      {...props}
    >
      <GroupCardThumbnail src={thumbnail} />
      <div className="flex flex-col gap-ds-12 p-ds-16">
        <GroupCardHeading title={title} description={description} />
        <GroupCardStats members={memberCount} reviews={reviewCount} places={placeCount} />
        {matchedCount > 0 ? <GroupCardBadge>{matchedLabel(matchedCount)}</GroupCardBadge> : null}
      </div>
    </div>
  );
}

type GroupCardThumbnailProps = {
  src: string | null;
};

/** 이미지가 비어도 회색 면이 남아 카드 높이가 흔들리지 않는다. */
function GroupCardThumbnail({ src }: GroupCardThumbnailProps) {
  return (
    <div className="h-25 w-full shrink-0 bg-surface-secondary">
      {/* biome-ignore lint/performance/noImgElement: 이미지 호스트가 확정되지 않아 next.config의 remotePatterns를 채울 수 없다. */}
      <img
        src={src ?? fallbackImage.src}
        alt=""
        className="size-full object-cover"
        loading="lazy"
        onError={({ currentTarget }) => handleImageError(currentTarget, fallbackImage.src)}
      />
    </div>
  );
}

type GroupCardHeadingProps = {
  title: string;
  description: string;
};

function GroupCardHeading({ title, description }: GroupCardHeadingProps) {
  return (
    <div className="flex flex-col gap-ds-4">
      <p className="truncate text-body-lg-bold text-content-primary">{title}</p>
      <p className="line-clamp-2 text-body-md-medium text-content-secondary">{description}</p>
    </div>
  );
}

type GroupCardStatsProps = {
  members: number;
  reviews: number;
  places: number;
};

function GroupCardStats({ members, reviews, places }: GroupCardStatsProps) {
  return (
    <ul className="flex gap-ds-12">
      {/* 멤버만 보이는 문구가 "57명"이라 무엇의 수인지 드러나지 않아 읽히는 문구를 따로 준다. */}
      <Stat icon={MembersIcon} label={`멤버 ${members}명`}>{`${members}명`}</Stat>
      <Stat icon={ReviewsIcon}>{`리뷰 ${reviews}개`}</Stat>
      <Stat icon={StoreIcon}>{`가게 ${places}개`}</Stat>
    </ul>
  );
}

type StatProps = {
  icon: ComponentType<IconProps>;
  /** 보이는 문구만으로 의미가 통하지 않을 때 스크린리더용으로 대신 읽힌다. */
  label?: string;
  children: string;
};

function Stat({ icon: Icon, label, children }: StatProps) {
  return (
    <li
      aria-label={label}
      className="flex items-center gap-ds-4 text-body-sm-medium text-content-tertiary"
    >
      <Icon size={ICON_SIZE} className="shrink-0" />
      {children}
    </li>
  );
}

type GroupCardBadgeProps = {
  children: string;
};

/** 저장한 가게와 겹치는 정도를 알리는 강조 뱃지. */
function GroupCardBadge({ children }: GroupCardBadgeProps) {
  return (
    <p className="flex w-fit items-center gap-ds-2 rounded-ds-xs bg-surface-groupcard-badge px-ds-4 py-ds-2 text-body-sm-medium text-content-interactive-primary">
      {children}
      <SparkleIcon aria-hidden="true" width={ICON_SIZE} height={ICON_SIZE} className="shrink-0" />
    </p>
  );
}
