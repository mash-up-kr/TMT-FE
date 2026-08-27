import { GroupDetailContainer } from "./_components/GroupDetailContainer";

export default async function GroupDetailPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ groupId: string }>;
  searchParams: Promise<{ created?: string | string[] }>;
}>) {
  const [{ groupId }, { created }] = await Promise.all([params, searchParams]);

  return (
    <GroupDetailContainer groupId={groupId} initialFirstReviewSheetOpen={created === "true"} />
  );
}
