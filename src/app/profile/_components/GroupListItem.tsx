import Link from "next/link";
import dummy from "@/shared/assets/dummy.png";
import { MatchedPlaceBadge } from "@/shared/components/MatchedPlaceBadge/MatchedPlaceBadge";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import { cn } from "@/shared/utils/cn";
import type { ProfileGroupItem, ProfileViewer } from "../_model/profile";

type GroupListItemProps = {
  group: ProfileGroupItem;
  href: string;
  viewer: ProfileViewer;
};

const thumbnailStyles = {
  mine: "size-[80px] rounded-ds-md",
  other: "size-ds-48 rounded-ds-sm",
} satisfies Record<ProfileViewer, string>;

export function GroupListItem({ group, href, viewer }: GroupListItemProps) {
  const showsMatched = viewer === "mine" && Boolean(group.matchedSavedPlaceCount);

  return (
    <li className="border-stroke-secondary border-b py-ds-16 last:border-b-0">
      <Link href={href} className="flex items-start gap-ds-12">
        <ImageWithFallback
          src={group.coverImageUrl}
          fallbackSrc={dummy}
          alt=""
          className={cn("shrink-0 object-cover", thumbnailStyles[viewer])}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-ds-12">
          <div className="flex flex-col gap-ds-4">
            <p className="truncate text-body-lg-bold text-content-primary">{group.name}</p>
            <p className="line-clamp-2 text-body-md-medium text-content-secondary">
              {group.oneLineDescription}
            </p>
          </div>
          {showsMatched && (
            <MatchedPlaceBadge>
              {`내가 저장한 가게와 ${group.matchedSavedPlaceCount}곳 일치해요`}
            </MatchedPlaceBadge>
          )}
        </div>
      </Link>
    </li>
  );
}
