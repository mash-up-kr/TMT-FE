"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/shared/ui/BottomNav";
import { GNB } from "@/shared/ui/GNB";
import { BlankIcon } from "@/shared/ui/Icons";

type HomeShellProps = {
  children: ReactNode;
  hideNav?: boolean;
};

export function HomeShell({ children, hideNav = false }: HomeShellProps) {
  return (
    <>
      <GNB align="left" className="shrink-0" title={null} left={<BlankIcon size={28} />} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      {!hideNav && (
        <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
          <BottomNav value="home" onValueChange={() => {}} onCreate={() => {}} />
        </div>
      )}
    </>
  );
}
