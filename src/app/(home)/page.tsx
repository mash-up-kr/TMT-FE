import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getHomeQueryOptions } from "@/api/gen/home/home.gen";
import { getServerQueryClient, getServerRequestInit } from "@/shared/providers/serverQuery";
import { HomeScreen } from "./_components/HomeScreen";

export default async function Home() {
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery(getHomeQueryOptions({ request: await getServerRequestInit() }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeScreen />
    </HydrationBoundary>
  );
}
