import type { ReactNode } from "react";
import { ReviewFlowShell } from "../_components/ReviewFlowShell";
import { NEW_REVIEW_BASE_PATH } from "../_constants/steps";

export default function ReviewWriteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <ReviewFlowShell basePath={NEW_REVIEW_BASE_PATH}>{children}</ReviewFlowShell>;
}
