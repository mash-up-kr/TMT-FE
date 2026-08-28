import { GroupEditScreen } from "./_components/GroupEditScreen";

export default async function GroupEditPage({
  params,
}: Readonly<{
  params: Promise<{ groupId: string }>;
}>) {
  const { groupId } = await params;

  return <GroupEditScreen groupId={groupId} />;
}
