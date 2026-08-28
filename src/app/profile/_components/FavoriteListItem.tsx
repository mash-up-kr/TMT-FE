"use client";

import Link from "next/link";
import dummyImage from "@/shared/assets/dummy-image.png";
import { PlaceFavoriteButton } from "@/shared/components/PlaceFavoriteButton";
import { ImageWithFallback } from "@/shared/ui/ImageWithFallback";
import type { ProfileFavoriteItem } from "../_model/profile";

type FavoriteListItemProps = {
  place: ProfileFavoriteItem;
  href: string;
  onUnfavorite?: (placeId: string) => void;
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
        <PlaceFavoriteButton
          placeName={place.name}
          isFavorite
          isPending={pending}
          onToggleAction={() => onUnfavorite(place.placeId)}
        />
      )}
    </li>
  );
}
