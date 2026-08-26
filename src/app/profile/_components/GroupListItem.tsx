import Link from "next/link";
import { MatchedPlaceBadge } from "@/shared/components/MatchedPlaceBadge/MatchedPlaceBadge";
import type { ProfileGroupItem } from "../_model/profile";

type GroupListItemProps = {
  group: ProfileGroupItem;
  href: string;
};

export function GroupListItem({ group, href }: GroupListItemProps) {
  return (
    <li className="border-stroke-secondary border-b py-ds-16 last:border-b-0">
      <Link href={href} className="flex items-start gap-ds-12">
        <GroupThumbnail url={group.imageUrl} />
        <div className="flex min-w-0 flex-1 flex-col gap-ds-12">
          <div className="flex flex-col gap-ds-4">
            <p className="truncate text-body-lg-bold text-content-primary">{group.name}</p>
            <p className="line-clamp-2 text-body-md-medium text-content-secondary">
              {group.description}
            </p>
          </div>
          {group.matchedSavedPlaceCount > 0 ? (
            <MatchedPlaceBadge>
              {`내가 저장한 가게와 ${group.matchedSavedPlaceCount}곳 일치해요`}
            </MatchedPlaceBadge>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

function GroupThumbnail({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div aria-hidden="true" className="size-[80px] shrink-0 rounded-ds-md bg-surface-tertiary" />
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: 이미지 호스트가 확정되지 않아 next.config의 remotePatterns를 채울 수 없다.
    <img
      src={url}
      alt=""
      className="size-[80px] shrink-0 rounded-ds-md object-cover"
      loading="lazy"
    />
  );
}
