import Link from "next/link";
import dummy from "@/shared/assets/dummy.png";
import { MatchedPlaceBadge } from "@/shared/components/MatchedPlaceBadge/MatchedPlaceBadge";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { ProfileGroupItem } from "../_model/profile";

/**
 * 내 프로필은 80px 썸네일과 일치 칩을 함께 그리고(1674:60998),
 * 타인 프로필은 48px 썸네일만 그린다(1692:24507). 두 시안의 실제 차이다.
 */
export type GroupListVariant = "mine" | "other";

type GroupListItemProps = {
  group: ProfileGroupItem;
  href: string;
  variant: GroupListVariant;
};

const thumbnailStyles = {
  mine: "size-[80px] rounded-ds-md",
  other: "size-ds-48 rounded-ds-sm",
} satisfies Record<GroupListVariant, string>;

export function GroupListItem({ group, href, variant }: GroupListItemProps) {
  const showMatched = variant === "mine" && Boolean(group.matchedSavedPlaceCount);

  return (
    <li className="border-stroke-secondary border-b py-ds-16 last:border-b-0">
      <Link href={href} className="flex items-start gap-ds-12">
        <ImageWithFallback
          src={group.coverImageUrl}
          fallbackSrc={dummy}
          alt=""
          className={`shrink-0 object-cover ${thumbnailStyles[variant]}`}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-ds-12">
          <div className="flex flex-col gap-ds-4">
            <p className="truncate text-body-lg-bold text-content-primary">{group.name}</p>
            <p className="line-clamp-2 text-body-md-medium text-content-secondary">
              {group.oneLineDescription}
            </p>
          </div>
          {showMatched ? (
            <MatchedPlaceBadge>
              {`내가 저장한 가게와 ${group.matchedSavedPlaceCount}곳 일치해요`}
            </MatchedPlaceBadge>
          ) : null}
        </div>
      </Link>
    </li>
  );
}
