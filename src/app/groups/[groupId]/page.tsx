import { GroupDetailContainer } from "./_components/GroupDetailContainer";

export default async function GroupDetailPage({
  params,
}: Readonly<{ params: Promise<{ groupId: string }> }>) {
  const { groupId } = await params;

  return <GroupDetailContainer groupId={groupId} />;
}
