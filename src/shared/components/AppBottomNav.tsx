"use client";

import { useRouter } from "next/navigation";
import { useReviewEntryPath } from "@/shared/hooks/useReviewEntryPath";
import { BottomNav } from "@/shared/ui/BottomNav";
import { type AppBottomNavValue, getBottomNavHref } from "@/shared/utils/bottomNavigationPolicy";

/**
 * 알약을 본문 위에 띄운다. 스트립 높이를 여백이 아니라 토큰으로 잡아, 예약한 높이와
 * 실제 그리는 높이가 어긋날 수 없게 한다. 스트립은 가로 전체지만 알약은 그 일부라,
 * 나머지 영역이 지도 드래그 같은 본문 조작을 먹지 않도록 이벤트를 통과시킨다.
 */
export function AppBottomNav({ activeTab }: { activeTab: AppBottomNavValue }) {
  const router = useRouter();
  const reviewEntryPath = useReviewEntryPath();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-navigation flex h-(--layout-bottom-navigation-height) items-center justify-center px-ds-20">
      <BottomNav
        className="pointer-events-auto"
        value={activeTab}
        onValueChange={(value) => router.push(getBottomNavHref(value))}
        onCreate={() => router.push(reviewEntryPath)}
      />
    </div>
  );
}
