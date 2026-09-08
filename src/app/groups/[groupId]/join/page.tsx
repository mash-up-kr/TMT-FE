import type { Metadata } from "next";
import { ReviewShareScreen } from "./_components/ReviewShareScreen";

export const metadata: Metadata = {
  title: "그룹 가입",
};

export default async function GroupJoinPage({
  params,
}: Readonly<{
  params: Promise<{ groupId: string }>;
}>) {
  const { groupId } = await params;

  return <ReviewShareScreen groupId={groupId} />;
}
