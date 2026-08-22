import type { ReactNode } from "react";
import { DraftReviewFlow } from "../../_components/DraftReviewFlow";

export default async function DraftReviewLayout({
  params,
  children,
}: Readonly<{ params: Promise<{ draftId: string }>; children: ReactNode }>) {
  const { draftId } = await params;

  return <DraftReviewFlow draftId={draftId}>{children}</DraftReviewFlow>;
}
