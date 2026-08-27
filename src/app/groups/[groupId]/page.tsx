import { GroupDetailScreen } from "./_components/GroupDetailScreen";

export default async function GroupDetailPage({
  params,
}: Readonly<{
  params: Promise<{ groupId: string }>;
}>) {
  const { groupId } = await params;

  return <GroupDetailScreen groupId={groupId} />;
}
