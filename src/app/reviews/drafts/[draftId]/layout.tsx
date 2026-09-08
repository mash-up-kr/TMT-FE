import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DraftReviewFlow } from "../../_components/DraftReviewFlow";

export const metadata: Metadata = {
  title: "리뷰 쓰기",
};

export default async function DraftReviewLayout({
  params,
  children,
}: Readonly<{ params: Promise<{ draftId: string }>; children: ReactNode }>) {
  const { draftId } = await params;

  return <DraftReviewFlow draftId={draftId}>{children}</DraftReviewFlow>;
}
