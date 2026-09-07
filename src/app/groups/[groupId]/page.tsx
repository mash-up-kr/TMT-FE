import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getGroupDetailQueryOptions } from "@/api/gen/group/group.gen";
import { getServerQueryClient, getServerRequestInit } from "@/shared/providers/serverQuery";
import { GroupDetailScreen } from "./_components/GroupDetailScreen";

export default async function GroupDetailPage({
  params,
}: Readonly<{
  params: Promise<{ groupId: string }>;
}>) {
  const { groupId } = await params;
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery(
    getGroupDetailQueryOptions(groupId, { request: await getServerRequestInit() }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <GroupDetailScreen groupId={groupId} />
    </HydrationBoundary>
  );
}
