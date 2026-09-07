"use client";

import { useRouter } from "next/navigation";
import { GNB } from "@/shared/ui/GNB";
import { IconButton } from "@/shared/ui/IconButton";
import { ChevronLeftIcon } from "@/shared/ui/Icons";
import { PlaceDetailSkeleton } from "./_components/PlaceDetailSkeleton";

export default function PlaceDetailLoading() {
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <GNB
        align="left"
        className="shrink-0"
        title={null}
        left={
          <IconButton aria-label="뒤로 가기" onClick={() => router.back()}>
            <ChevronLeftIcon size={28} />
          </IconButton>
        }
      />
      <PlaceDetailSkeleton />
    </div>
  );
}
