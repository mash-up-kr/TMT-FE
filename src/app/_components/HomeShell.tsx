"use client";

import type { ReactNode } from "react";
import { BottomNav } from "@/shared/ui/BottomNav";

type HomeShellProps = {
  children: ReactNode;
  hideNav?: boolean;
};

export function HomeShell({ children, hideNav = false }: HomeShellProps) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      {!hideNav && (
        <div className="flex shrink-0 justify-center px-ds-20 py-ds-12">
          <BottomNav value="home" onValueChange={() => {}} onCreate={() => {}} />
        </div>
      )}
    </>
  );
}
