import type { Metadata } from "next";
import { GroupEditScreen } from "./_components/GroupEditScreen";

export const metadata: Metadata = {
  title: "그룹 수정",
};

export default async function GroupEditPage({
  params,
}: Readonly<{
  params: Promise<{ groupId: string }>;
}>) {
  const { groupId } = await params;

  return <GroupEditScreen groupId={groupId} />;
}
