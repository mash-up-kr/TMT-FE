"use client";

import { useRouter } from "next/navigation";
import type { ScreenLayoutProps } from "@/shared/components/ScreenLayout";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { ROUTES } from "@/shared/constants/routes";
import { BottomNav, type BottomNavValue } from "@/shared/ui/BottomNav";

type BottomNavScreenLayoutProps = ScreenLayoutProps & {
  activeTab: BottomNavValue;
};

const TAB_ROUTES: Record<BottomNavValue, string> = {
  home: ROUTES.ROOT,
  feed: ROUTES.FEED,
  group: ROUTES.GROUPS.ROOT,
  my: ROUTES.PROFILE.ME,
};

export function BottomNavScreenLayout({
  activeTab,
  ...screenLayoutProps
}: BottomNavScreenLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenLayout {...screenLayoutProps} />
      <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
        <BottomNav
          value={activeTab}
          onValueChange={(value) => router.push(TAB_ROUTES[value])}
          onCreate={() => router.push(ROUTES.GROUPS.NEW)}
        />
      </div>
    </div>
  );
}
