import type { Metadata } from "next";
import { placeDetail } from "@/api/gen/place-detail/place-detail.gen";
import { placeDetailPath } from "@/shared/constants/routes";
import { OG_IMAGE_PATH, SITE, shareDescription } from "@/shared/constants/site";
import { PlaceDetailScreen } from "./_components/PlaceDetailScreen";

type PlaceDetailPageProps = {
  params: Promise<{ placeId: string }>;
};

/**
 * 장소는 항상 기본 카드를 쓴다. 리뷰 사진의 공개 범위와 대표 선정 정책이 없어,
 * 사진을 자동으로 대표 이미지로 올리면 원치 않는 사진이 공유될 수 있다.
 */
export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
  const { placeId } = await params;
  const place = await placeDetail(placeId).catch(() => null);
  if (!place?.name) {
    return {};
  }

  const title = `${place.name} 리뷰 | ${SITE.name}`;
  const description = shareDescription.place(place.name);
  const url = placeDetailPath(placeId);

  return {
    title: `${place.name} 리뷰`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url,
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { placeId } = await params;
  return <PlaceDetailScreen placeId={placeId} />;
}
