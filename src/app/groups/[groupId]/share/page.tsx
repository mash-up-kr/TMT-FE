import type { Metadata } from "next";
import { ReviewShareScreen } from "../_components/ReviewShareScreen";

export const metadata: Metadata = {
  title: "리뷰 공유",
};

export default async function GroupSharePage({
  params,
}: Readonly<{
  params: Promise<{ groupId: string }>;
}>) {
  const { groupId } = await params;

  return <ReviewShareScreen groupId={groupId} mode="share" />;
}
