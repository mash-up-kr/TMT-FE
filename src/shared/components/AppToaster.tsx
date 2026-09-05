"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "@/shared/ui/Toast";
import { resolveToastBottomInset } from "@/shared/utils/toastInsetPolicy";

/** root toast viewport. BottomNav policy를 재사용하는 Toast inset policy로 위치를 결정한다. */
export function AppToaster() {
  const pathname = usePathname();

  return <Toaster bottomInset={resolveToastBottomInset(pathname)} />;
}
