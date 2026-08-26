"use client";

import type { ReactNode } from "react";
import { TabScreenLayout } from "@/shared/components/TabScreenLayout";
import { GNB } from "@/shared/ui/GNB";
import { BlankIcon } from "@/shared/ui/Icons";

type HomeShellProps = {
  children: ReactNode;
  hideNav?: boolean;
};

export function HomeShell({ children, hideNav = false }: HomeShellProps) {
  const content = (
    <>
      <GNB align="left" className="shrink-0" title={null} left={<BlankIcon size={28} />} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </>
  );

  return hideNav ? content : <TabScreenLayout activeTab="home">{content}</TabScreenLayout>;
}
