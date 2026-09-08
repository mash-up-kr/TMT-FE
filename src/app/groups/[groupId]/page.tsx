import type { Metadata } from "next";
import { groupDetail } from "@/api/gen/group/group.gen";
import { ROUTES } from "@/shared/constants/routes";
import { OG_IMAGE_PATH, SITE, shareDescription } from "@/shared/constants/site";
import { GroupDetailScreen } from "./_components/GroupDetailScreen";

type GroupDetailPageProps = Readonly<{
  params: Promise<{ groupId: string }>;
}>;

/**
 * 그룹 상세는 인증 없이 열리는 endpoint라 서버에서 이름을 읽어 공유 카드를 만든다.
 * 이름이 비었거나 조회에 실패하면 아무것도 선언하지 않아 root layout의 기본 카드로 되돌아간다.
 * 색인은 root layout의 `noindex` 기본값을 그대로 물려받는다 — 공유만 허용하고 검색에는 노출하지 않는다.
 *
 * 대표 이미지는 소유자가 지정한 `imageUrl`만 쓴다. `coverImages`는 항목마다 `reviewId`가 붙은
 * 멤버의 리뷰 사진이라, 공개 범위와 대표 선정 정책이 없는 지금 공유 카드로 올리면
 * 원치 않는 사진이 밖으로 나갈 수 있다.
 */
export async function generateMetadata({ params }: GroupDetailPageProps): Promise<Metadata> {
  const { groupId } = await params;
  const group = await groupDetail(groupId).catch(() => null);
  if (!group?.name) {
    return {};
  }

  const title = `${group.name} | ${SITE.name}`;
  const description = shareDescription.group(group.name);
  const url = ROUTES.GROUPS.DETAIL(groupId);

  return {
    title: group.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: SITE.locale,
      url,
      title,
      description,
      images: [group.imageUrl ?? OG_IMAGE_PATH],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [group.imageUrl ?? OG_IMAGE_PATH],
    },
  };
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const { groupId } = await params;
  return <GroupDetailScreen groupId={groupId} />;
}
