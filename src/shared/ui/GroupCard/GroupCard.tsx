import type { ComponentProps } from "react";
import { MembersIcon, ReviewsIcon, StoreIcon } from "@/shared/ui/Icons";
import { cn } from "@/shared/utils/cn";
import SparkleIcon from "./assets/sparkle.svg?react";

const STATS = [
  {
    id: "members",
    icon: MembersIcon,
    text: (count: number) => `${count}명`,
    label: (count: number) => `멤버 ${count}명`,
  },
  {
    id: "reviews",
    icon: ReviewsIcon,
    text: (count: number) => `리뷰 ${count}개`,
    label: (count: number) => `리뷰 ${count}개`,
  },
  {
    id: "places",
    icon: StoreIcon,
    text: (count: number) => `가게 ${count}개`,
    label: (count: number) => `가게 ${count}개`,
  },
] as const;

const matchedLabel = (count: number) => `내가 저장한 가게와 ${count}개 일치해요`;

type GroupCardProps = Omit<ComponentProps<"div">, "title"> & {
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
        <GroupCardStats counts={[memberCount, reviewCount, placeCount]} />
        {matchedCount > 0 ? <GroupCardBadge>{matchedLabel(matchedCount)}</GroupCardBadge> : null}
      </div>
    </div>
  );
}

function GroupCardThumbnail({ src }: { src: string | null }) {
  return (
    <div className="h-25 w-full shrink-0 bg-surface-secondary">
      {src ? (
        // biome-ignore lint/performance/noImgElement: 이미지 호스트가 확정되지 않아 next.config의 remotePatterns를 채울 수 없다.
        <img src={src} alt="" className="size-full object-cover" loading="lazy" />
      ) : null}
    </div>
  );
}

function GroupCardHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-ds-4">
      <p className="truncate text-body-lg-bold text-content-primary">{title}</p>
      <p className="line-clamp-2 text-body-md-medium text-content-secondary">{description}</p>
    </div>
  );
}

function GroupCardStats({ counts }: { counts: readonly [number, number, number] }) {
  return (
    <ul className="flex gap-ds-12">
      {STATS.map(({ id, icon: Icon, text, label }, i) => {
        const count = counts[i];
        return (
          <li
            key={id}
            aria-label={label(count)}
            className="flex items-center gap-ds-4 text-body-sm-medium text-content-tertiary"
          >
            <Icon size={12} className="shrink-0" />
            {text(count)}
          </li>
        );
      })}
    </ul>
  );
}

function GroupCardBadge({ children }: { children: string }) {
  return (
    <p className="flex w-fit items-center gap-ds-2 rounded-ds-xs bg-surface-badge px-ds-4 py-ds-2 text-body-sm-medium text-content-interactive-primary">
      {children}
      <SparkleIcon aria-hidden="true" width={12} height={12} className="shrink-0" />
    </p>
  );
}
