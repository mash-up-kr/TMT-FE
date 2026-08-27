import { PlaceDetailScreen } from "./_components/PlaceDetailScreen";

type PlaceDetailPageProps = {
  params: Promise<{ placeId: string }>;
};

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { placeId } = await params;

  return <PlaceDetailScreen placeId={placeId} />;
}
