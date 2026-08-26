import { GroupDetailView } from "./_components/GroupDetailView";

export default async function GroupDetailPage({
  params,
}: Readonly<{ params: Promise<{ groupId: string }> }>) {
  const { groupId } = await params;

  return <GroupDetailView groupId={groupId} />;
}
