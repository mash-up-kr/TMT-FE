"use client";

import Link from "next/link";
import dummyImage from "@/shared/assets/dummy-image.png";
import { IconButton } from "@/shared/ui/IconButton";
import { HeartIcon } from "@/shared/ui/Icons";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { ProfileFavoriteItem } from "../_model/profile";

type FavoriteListItemProps = {
  place: ProfileFavoriteItem;
  href: string;
  /** 없으면 하트를 렌더하지 않는다. 타인 프로필 좋아요 탭이 그렇다. */
  onUnfavorite?: (placeId: string) => void;
  /** 해제 요청이 진행 중인 동안 이 행의 하트만 잠근다. */
  pending?: boolean;
};

export function FavoriteListItem({ place, href, onUnfavorite, pending }: FavoriteListItemProps) {
  return (
    <li className="flex items-center gap-ds-8 border-stroke-secondary border-b bg-surface-primary py-ds-16">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-ds-12">
        <ImageWithFallback
          src={place.thumbnailUrl}
          fallbackSrc={dummyImage}
          alt=""
          className="size-ds-48 shrink-0 rounded-ds-sm object-cover"
        />
        <span className="flex min-w-0 flex-1 flex-col gap-ds-4">
          <span className="truncate text-body-lg-bold text-content-primary">{place.name}</span>
          <span className="flex h-[20px] items-center gap-ds-4 text-body-md-medium text-content-secondary">
            <span className="truncate">{place.roadAddress}</span>
            {place.categoryName && (
              <>
                <span aria-hidden="true" className="h-[12px] w-px shrink-0 bg-content-tertiary" />
                <span className="shrink-0">{place.categoryName}</span>
              </>
            )}
          </span>
        </span>
      </Link>
      {onUnfavorite && (
        <IconButton
          aria-label={`${place.name} 좋아요 해제`}
          aria-busy={pending}
          disabled={pending}
          className="shrink-0 disabled:opacity-50"
          onClick={() => onUnfavorite(place.placeId)}
        >
          <HeartIcon filled size={28} className="text-icon-interactive-primary" />
        </IconButton>
      )}
    </li>
  );
}
