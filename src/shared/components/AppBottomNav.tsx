"use client";

import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import type { AppBottomNavValue } from "@/shared/model/appNavigation";
import { BottomNav } from "@/shared/ui/BottomNav";
import { getBottomNavHref } from "@/shared/utils/bottomNavigationPolicy";

export function AppBottomNav({ activeTab }: { activeTab: AppBottomNavValue }) {
  const router = useRouter();

  return (
    <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
      <BottomNav
        value={activeTab}
        onValueChange={(value) => router.push(getBottomNavHref(value))}
        onCreate={() => router.push(ROUTES.REVIEWS.NEW)}
      />
    </div>
  );
}
