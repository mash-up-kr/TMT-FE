import type { ReactNode } from "react";
import { ReviewFlowShell } from "./_components/ReviewFlowShell";

export default function ReviewWriteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <ReviewFlowShell>{children}</ReviewFlowShell>;
}
