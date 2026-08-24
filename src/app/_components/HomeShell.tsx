import type { ReactNode } from "react";
import { BottomNavScreenLayout } from "@/shared/components/BottomNavScreenLayout";
import { ScreenLayout } from "@/shared/components/ScreenLayout";
import { GNB } from "@/shared/ui/GNB";
import { BlankIcon } from "@/shared/ui/Icons";

type HomeShellProps = {
  children: ReactNode;
  hideNav?: boolean;
};

export function HomeShell({ children, hideNav = false }: HomeShellProps) {
  const header = (
    <GNB align="left" className="shrink-0" title={null} left={<BlankIcon size={28} />} />
  );

  return hideNav ? (
    <ScreenLayout header={header}>{children}</ScreenLayout>
  ) : (
    <BottomNavScreenLayout activeTab="home" header={header}>
      {children}
    </BottomNavScreenLayout>
  );
}
