import { GroupDetailScreen } from "./_components/GroupDetailScreen";

export default async function GroupDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ created?: string | string[] }>;
}>) {
  const [{ groupId }, { created }] = await Promise.all([params, searchParams]);

  return <GroupDetailScreen groupId={groupId} initialFirstReviewSheetOpen={created === "true"} />;
}
