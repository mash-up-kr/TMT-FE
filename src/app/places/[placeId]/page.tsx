import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getPlaceDetailQueryOptions } from "@/api/gen/place-detail/place-detail.gen";
import { getServerQueryClient, getServerRequestInit } from "@/shared/providers/serverQuery";
import { PlaceDetailScreen } from "./_components/PlaceDetailScreen";

type PlaceDetailPageProps = {
  params: Promise<{ placeId: string }>;
};

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { placeId } = await params;
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery(
    getPlaceDetailQueryOptions(placeId, { request: await getServerRequestInit() }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlaceDetailScreen placeId={placeId} />
    </HydrationBoundary>
  );
}
